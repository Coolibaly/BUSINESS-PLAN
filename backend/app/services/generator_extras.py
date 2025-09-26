# app/services/generator_extras.py
from __future__ import annotations

from typing import Dict, Optional, TYPE_CHECKING

from sqlmodel import Session
from langchain.chains import LLMChain

from app.llm.prompt_loader import load_prompt_by_name
from app.llm.chains import get_llm
from .generator import _build_context, _existing_sections_md, _sanitize_var

if TYPE_CHECKING:
    # Import uniquement pour la vérification de types (évite les imports circulaires au runtime)
    from app.db.models import BusinessPlan


def generate_prompt_preview(
    db: Session,
    plan: "BusinessPlan",
    prompt_name: str,
    extra_ctx: Optional[Dict[str, str]] = None,
) -> str:
    """
    Génère le rendu d'un prompt arbitraire (par nom de fichier dans /app/llm/prompts).
    - Hydrate automatiquement les variables du prompt à partir du contexte plan + extra_ctx.
    - Si le prompt demande raw_md, on injecte la concaténation des sections déjà générées.
    """
    tmpl = load_prompt_by_name(prompt_name)
    llm = get_llm()  # même backend que tes chains (OpenAI / Ollama)
    required = getattr(tmpl, "input_variables", []) or []

    # Construit le contexte de base
    base = _build_context(db, plan)

    # Si le prompt demande raw_md, construire la matière à partir des sections existantes
    if "raw_md" in required and "raw_md" not in base:
        base["raw_md"] = _existing_sections_md(db, plan.id)

    # Merge du contexte additionnel (prioritaire)
    if extra_ctx:
        for k, v in extra_ctx.items():
            base[_sanitize_var(k)] = v if isinstance(v, str) else str(v)

    # Hydrate uniquement les variables requises
    inputs = {name: base.get(name, "") for name in required}

    # Utiliser LLMChain pour un comportement cohérent et un texte de sortie
    chain = LLMChain(llm=llm, prompt=tmpl)
    result = chain.invoke(inputs)

    text = result.get("text", "").strip() if isinstance(result, dict) else str(result).strip()
    return text
