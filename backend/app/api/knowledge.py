# app/api/knowledge.py
from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from typing import List
import os
from app.llm.embeddings import ingest_file, get_retriever

router = APIRouter()

UPLOAD_DIR = "data/knowledge"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/ingest")
def ingest(file: UploadFile = File(...)):
    filename = file.filename
    if not filename.endswith((".txt", ".md")):
        raise HTTPException(status_code=415, detail="Format de fichier non supporté (TXT ou MD uniquement)")
    path = os.path.join(UPLOAD_DIR, filename)
    with open(path, "wb") as f:
        f.write(file.file.read())

    ingest_file(path)
    return {"detail": f"Document {filename} indexé avec succès"}


@router.get("/search")
def search(q: str = Query(...)):
    retriever = get_retriever()
    docs = retriever.get_relevant_documents(q)
    return [{
        "content": doc.page_content,
        "metadata": doc.metadata,
    } for doc in docs]
