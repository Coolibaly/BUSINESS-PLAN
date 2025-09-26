# app/api/files.py
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, Query, Response
from fastapi import APIRouter, UploadFile, File, Query
from sqlmodel import Session
from app.core.deps import get_db, get_current_user
from app.db.models import BusinessPlan
from app.services.finance.models import FileAsset
import shutil, os
from uuid import uuid4
from app.services.transcription import transcribe_audio, save_temp_audio, TranscriptionError
from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from pathlib import Path
import tempfile, shutil, os
from typing import Literal
from app.services.transcription import transcribe_audio, save_temp_audio, TranscriptionError
from app.services.transcription import run_whisper_local, run_openai_whisper

router = APIRouter()

UPLOAD_DIR = "data/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_TYPES = ["logo", "annexe"]

@router.post("/{plan_id}/{kind}")
def upload_file(plan_id: int, kind: Literal["logo","annexe"], uploaded: UploadFile = File(...),
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if kind not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Type de fichier non autorisé")

    plan = db.get(BusinessPlan, plan_id)
    if not plan or plan.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Plan non trouvé")

    ext = os.path.splitext(uploaded.filename)[-1]
    if not ext.lower() in [".png", ".jpg", ".jpeg", ".pdf"]:
        raise HTTPException(status_code=415, detail="Format de fichier non supporté")

    filename = f"{plan_id}_{kind}_{uuid4().hex}{ext}"
    path = os.path.join(UPLOAD_DIR, filename)

    with open(path, "wb") as f:
        shutil.copyfileobj(uploaded.file, f)

    asset = FileAsset(
        plan_id=plan.id,
        kind=kind,
        path=path,
        meta={"filename": uploaded.filename, "content_type": uploaded.content_type}
    )
    db.add(asset)
    db.commit()

    return {
        "detail": "Fichier uploadé",
        "id": asset.id,
        "path": path
    }

ALLOWED_MIME_SUFFIX = {
    "audio/mpeg": ".mp3",
    "audio/wav": ".wav",
    "audio/x-wav": ".wav",
    "audio/webm": ".webm",
    "audio/ogg": ".ogg",
    "audio/x-m4a": ".m4a",
    "audio/mp4": ".m4a",   # certains navigateurs envoient m4a en mp4
    "video/mp4": ".mp4",
    "application/octet-stream": "",
}

def _guess_suffix(upload: UploadFile) -> str:
    # 1) si le nom a une extension, on la garde
    ext = Path(upload.filename or "").suffix.lower()
    if ext:
        return ext
    # 2) sinon on mappe via le content-type
    return ALLOWED_MIME_SUFFIX.get((upload.content_type or "").lower(), "")

@router.post("/audio:transcribe")
@router.post("/audio/transcribe")  # alias sans ':'
def transcribe_audio(
    audio: UploadFile | None = File(None),
    file: UploadFile | None = File(None),
    engine: str = Query("local"),
):
    # alias compat
    if engine == "whisper":
        engine = "local"
    audio = audio or file
    if not audio:
        raise HTTPException(status_code=422, detail="Champ de fichier requis: 'audio' (ou 'file')")
    # pseudo-impl: plug-in ton pipeline existant
    if engine == "local":
        # ex: utiliser whisper local
        text = run_whisper_local(audio)  # -> impl dans ton service
    elif engine == "openai":
        text = run_openai_whisper(audio) # -> impl dans ton service
    else:
        raise HTTPException(400, detail="engine doit être 'local' ou 'openai'")
    return {"text": text}

# Compat: /files/{plan_id}/upload?type=logo|annexe avec champ 'file' OU 'uploaded'
@router.post("/{plan_id}/upload")
def upload_compat(
    plan_id: int,
    type: Literal["logo","annexe"] = Query(..., alias="type"),
    uploaded: UploadFile | None = File(None),
    file: UploadFile | None = File(None),
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    real = uploaded or file
    if real is None:
        raise HTTPException(status_code=422, detail="Aucun fichier fourni (utilise 'uploaded' ou 'file')")
    return upload_file(plan_id, type, real, db, user)
