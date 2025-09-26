# app/services/advice.py
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import List, Callable

from sqlalchemy import delete
from sqlmodel import Session
from langchain.prompts import PromptTemplate
from app.core.config import settings

# Modèles (gardés tels que dans ton code existant)
from app.services.finance.models import FinancialAssumptions, Advice  # SQLModel attendue
# Si ton Advice est dans app.db.models, remplace l'import ci-dessus par:
# from app.db.models import Advice

# LLM (chat) – on passe par la même lib que dans chains.py
try:
    from langchain_openai import ChatOpenAI
except ImportError:
    ChatOpenAI = None  # géré plus bas


@dataclass(frozen=True)
class FinancialRule:
    """Représente une règle d’alerte financière."""
    name: str
    condition: Callable[[FinancialAssumptions], bool]
    message: str


# Seuils métier configurables
MIN_MARGIN_THRESHOLD = 100          # FCFA
MAX_FIXED_COSTS = 400_000           # FCFA
MAX_CAPEX = 1_000_000               # FCFA
MAX_SALARIES_AND_RENT = 400_000     # FCFA

# Ensemble des règles à appliquer sur l’analyse financière
FINANCIAL_RULES: List[FinancialRule] = [
    FinancialRule(
        name="Marge unitaire trop faible",
        condition=lambda a: (a.pricing - a.variable_costs) < MIN_MARGIN_THRESHOLD,
        message=(
            "Votre marge unitaire est inférieure à "
            f"{MIN_MARGIN_THRESHOLD} FCFA. "
            "Envisagez d’augmenter le prix de vente ou de réduire vos coûts variables "
            "(matières premières, logistique…)."
        ),
    ),
    FinancialRule(
        name="Charges fixes et salaires élevés",
        condition=lambda a: (a.fixed_costs + a.salaries) > MAX_SALARIES_AND_RENT,
        message=(
            "Les charges fixes et salaires dépassent "
            f"{MAX_SALARIES_AND_RENT} FCFA. "
            "Réévaluez vos postes de dépense : loyers, effectifs, sous-traitance..."
        ),
    ),
    FinancialRule(
        name="Investissement initial (CAPEX) important",
        condition=lambda a: a.capex > MAX_CAPEX,
        message=(
            "Le CAPEX prévu excède "
            f"{MAX_CAPEX} FCFA. "
            "Envisagez des équipements d'occasion, des partenariats ou des financements à taux préférentiels."
        ),
    ),
    FinancialRule(
        name="Point mort élevé",
        condition=lambda a: getattr(a, "break_even_units", 0) > (a.annual_volume * 0.5),
        message=(
            "Le seuil de rentabilité requiert plus de la moitié de votre volume annuel. "
            "Réduisez les coûts fixes/variables ou stimulez la demande par des campagnes ciblées."
        ),
    ),
]


LLM_TEMPLATE = """Vous êtes un expert financier ivoirien, spécialisé dans l’accompagnement des jeunes entrepreneurs.
Votre mission : analyser rapidement les paramètres du projet et proposer **trois** conseils pratiques, localisés et adaptés aux standards bancaires ivoiriens.

Contexte du projet :
- Secteur         : {sector}
- Localisation    : {city} (région {region})
- Prix unitaire   : {pricing} FCFA
- Coûts variables : {variable_costs} FCFA
- Coûts fixes     : {fixed_costs} FCFA
- Salaires annuels: {salaries} FCFA
- CAPEX           : {capex} FCFA
- Volume annuel   : {annual_volume} unités
- Seuil de rentabilité (unités) : {break_even_units}

Instructions :
1. Appliquez les règles financières (marge, charges, CAPEX, seuil de rentabilité) et mettez en avant les 1–2 leviers prioritaires.
2. Contexte local : mentionnez brièvement les réalités du marché ivoirien (transport, fiscalité, microcrédit/mobile money).
3. Formulez des conseils clairs, concis et actionnables (trois points numérotés).
"""

def _build_llm():
    """Construit un client ChatOpenAI si activé, sinon None."""
    if not settings.USE_OPENAI:
        return None
    if not settings.OPENAI_API_KEY:
        # Lève une erreur contrôlée : l’API a besoin de la clé pour générer la partie LLM
        raise ValueError("OPENAI_API_KEY manquant pour la génération de conseils LLM.")
    if ChatOpenAI is None:
        raise ValueError("Le paquet 'langchain-openai' est requis. Installez-le avec: pip install -U langchain-openai")
    return ChatOpenAI(
        model=settings.OPENAI_MODEL,
        temperature=0.3,
        api_key=settings.OPENAI_API_KEY,
        base_url=getattr(settings, "OPENAI_BASE_URL", None),
    )


def generate_advice(db: Session, plan, assumptions: FinancialAssumptions):
    """Génère les conseils (métier + LLM) et les enregistre en base."""
    # 1) Supprimer les anciens conseils du plan
    db.exec(delete(Advice).where(Advice.plan_id == plan.id))
    db.commit()

    # 2) Conseils basés sur règles métier
    for rule in FINANCIAL_RULES:
        try:
            if rule.condition(assumptions):
                db.add(Advice(
                    plan_id=plan.id,
                    category=rule.name,
                    message=rule.message,
                    priority=1,
                    created_at=datetime.utcnow(),  # si champ existant
                ))
        except Exception:
            # En cas de champ manquant dans assumptions, on ignore la règle
            continue

    db.commit()

    # 3) Conseils générés par LLM (optionnel si USE_OPENAI)
    try:
        llm = _build_llm()
    except ValueError:
        llm = None  # on continue sans LLM

    if llm is not None:
        prompt = PromptTemplate.from_template(LLM_TEMPLATE)

        # Certains champs peuvent ne pas exister dans tes hypotheses → on sécurise
        input_vars = {
            "sector": getattr(plan, "sector", "N/A"),
            "city": getattr(plan, "city", "N/A"),
            "region": getattr(plan, "country", "CI"),
            "pricing": getattr(assumptions, "pricing", 0),
            "variable_costs": getattr(assumptions, "variable_costs", 0),
            "fixed_costs": getattr(assumptions, "fixed_costs", 0),
            "salaries": getattr(assumptions, "salaries", 0),
            "capex": getattr(assumptions, "capex", 0),
            "annual_volume": getattr(assumptions, "annual_volume", 0),
            "break_even_units": getattr(assumptions, "break_even_units", 0),
        }

        # Utiliser directement le LLM via prompt.format
        from langchain.chains import LLMChain
        chain = LLMChain(llm=llm, prompt=prompt)
        result = chain.invoke(input_vars)  # -> dict {"text": "..."} en général
        text = result.get("text", "").strip() if isinstance(result, dict) else str(result).strip()

        # Enregistrer chaque ligne non vide comme un conseil
        for line in text.split("\n"):
            clean = line.strip().lstrip("-•1234567890. ").strip()
            if clean:
                db.add(Advice(
                    plan_id=plan.id,
                    category="Conseil LLM",
                    message=clean,
                    priority=2,
                    created_at=datetime.utcnow(),
                ))

        db.commit()
