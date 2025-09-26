# scripts/ingest_knowledge.py
from app.llm.embeddings import ingest_file
import os

if __name__ == "__main__":
    for file in os.listdir("data/knowledge"):
        if file.endswith(".txt"):
            ingest_file(os.path.join("data/knowledge", file))
            print(f"Ingesté : {file}")
