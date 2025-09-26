# app/llm/prompt_loader.py
from pathlib import Path
from langchain.prompts import PromptTemplate
import re

PROMPTS_DIR = Path(__file__).with_name("prompts")

def load_prompt_by_name(name: str) -> PromptTemplate:
    path = PROMPTS_DIR / (name if name.endswith(".txt") else f"{name}.txt")
    text = path.read_text(encoding="utf-8")
    vars_ = sorted(set(re.findall(r"{([a-zA-Z_][a-zA-Z0-9_]*)}", text)))
    return PromptTemplate(template=text, input_variables=vars_)
