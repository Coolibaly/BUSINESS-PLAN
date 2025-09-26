# app/llm/embeddings.py
import os
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import OpenAIEmbeddings, HuggingFaceEmbeddings
from langchain_community.document_loaders import TextLoader
from app.core.config import settings

VECTORSTORE_PATH = os.getenv("VECTORSTORE_PATH", "data/chroma")

def get_embeddings():
    backend = str(getattr(settings, "LLM_EMBEDDINGS_BACKEND", "openai")).lower()
    if backend == "hf":
        return HuggingFaceEmbeddings(model_name=getattr(settings, "HF_EMBEDDINGS_MODEL", "sentence-transformers/all-MiniLM-L6-v2"))
    # défaut: OpenAI
    return OpenAIEmbeddings(openai_api_key=settings.OPENAI_API_KEY)

def get_retriever():
    embeddings = get_embeddings()
    vectordb = Chroma(persist_directory=VECTORSTORE_PATH, embedding_function=embeddings)
    return vectordb.as_retriever(search_kwargs={"k": 5})

def ingest_file(filepath: str):
    loader = TextLoader(filepath)
    docs = loader.load()
    vectordb = Chroma.from_documents(
        documents=docs,
        embedding=get_embeddings(),
        persist_directory=VECTORSTORE_PATH
    )
    vectordb.persist()
