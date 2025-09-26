# app/llm/chains.py
import os
import re
from pathlib import Path
from functools import lru_cache
from typing import List

from fastapi import HTTPException
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

from app.core.config import settings
from app.db.models import PlanSectionType

# — Backend LLM
try:
    from langchain_openai import ChatOpenAI  # recommandé
except Exception:
    ChatOpenAI = None

try:
    from langchain_ollama import Ollama
    OLLAMA_AVAILABLE = True
except Exception:
    OLLAMA_AVAILABLE = False

try:
    from langchain_core.output_parsers import StrOutputParser
except Exception:
    # compat possible selon la version langchain
    from langchain.output_parsers import StrOutputParser  # fallback


PROMPTS_DIR = Path(__file__).with_name("prompts")


def _extract_vars(template_text: str) -> List[str]:
    """Récupère les variables {var} présentes dans un fichier de prompt."""
    return sorted(set(re.findall(r"{([a-zA-Z_][a-zA-Z0-9_]*)}", template_text)))


@lru_cache(maxsize=64)
def _read_prompt_file(filename: str) -> str:
    path = PROMPTS_DIR / filename
    if not path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Prompt introuvable: {filename}. Disponibles: "
                   f"{', '.join(sorted(p.name for p in PROMPTS_DIR.glob('*.txt')))}"
        )
    return path.read_text(encoding="utf-8")


def load_prompt(section: PlanSectionType) -> PromptTemplate:
    """
    Mappe une section métier vers le bon fichier .txt et construit le PromptTemplate.
    """
    # Sélection du prompt finance (préférence pour le structuré s'il existe)
    finance_file = "financial_structured.txt"
    if not (PROMPTS_DIR / finance_file).exists():
        finance_file = "finance.txt"

    mapping = {
        PlanSectionType.exec_summary: "exec_summary.txt",
        PlanSectionType.activity:     "activity.txt",
        PlanSectionType.market:       "market.txt",
        PlanSectionType.marketing:    "marketing.txt",
        PlanSectionType.ops:          "ops.txt",
        PlanSectionType.hr:           "hr.txt",
        PlanSectionType.finance:      finance_file,
    }

    filename = mapping.get(section)
    if not filename:
        raise HTTPException(
            status_code=400,
            detail=f"Aucun prompt mappé pour la section: {getattr(section, 'value', str(section))}"
        )

    text = _read_prompt_file(filename)
    vars_ = _extract_vars(text)
    return PromptTemplate(template=text, input_variables=vars_)


def _get_openai_chat():
    if ChatOpenAI is None:
        raise HTTPException(status_code=500, detail="langchain_openai non disponible")
    if not settings.OPENAI_API_KEY:
        raise HTTPException(status_code=400, detail="OPENAI_API_KEY manquant")

    # ✅ Sécurise les modèles chat (évite d'appeler un modèle *instruct* sur /chat/completions)
    model = settings.OPENAI_MODEL
    if model.endswith("-instruct"):
        # bascule auto vers un modèle chat compatible
        model = "gpt-4o-mini"

    return ChatOpenAI(
        model=model,
        temperature=settings.LLM_TEMPERATURE,
        max_tokens=settings.LLM_MAX_TOKENS,
        streaming=getattr(settings, "LLM_STREAMING", False),
        api_key=settings.OPENAI_API_KEY,
    )

def get_llm():
    use_ollama = str(getattr(settings, "USE_OLLAMA", "false")).lower() == "true"
    use_openai = str(getattr(settings, "USE_OPENAI", "false")).lower() == "true"
    if use_ollama:
        return _get_ollama()
    if use_openai:
        return _get_openai_chat()
    raise HTTPException(status_code=400, detail="LLM désactivé. Activez USE_OPENAI ou USE_OLLAMA.")

# ✅ Nouveau : runnable sans LLMChain (supprime l’avertissement deprecation)
def get_llm_runnable(section: PlanSectionType):
    prompt = load_prompt(section)
    llm = get_llm()
    return prompt | llm | StrOutputParser()

def get_llm_chain(section: PlanSectionType) -> LLMChain:
    """Construit une LLMChain pour générer une section de business plan."""
    prompt = load_prompt(section)
    llm = get_llm()
    return LLMChain(llm=llm, prompt=prompt)
