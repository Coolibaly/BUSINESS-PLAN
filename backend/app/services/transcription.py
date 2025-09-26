# app/services/transcription.py
from typing import Literal, Optional
from pathlib import Path
from fastapi import UploadFile

import shutil
if not shutil.which("ffmpeg"):
    raise RuntimeError("ffmpeg non installé. Installe-le (apt install ffmpeg) ou ajoute-le à PATH.")

class TranscriptionError(RuntimeError):
    pass

def _load_local_whisper():
    try:
        import whisper  # from openai-whisper
        if not hasattr(whisper, "load_model"):
            raise ImportError(
                "Le module 'whisper' importé n'est pas 'openai-whisper'. "
                "Désinstallez 'whisper' et installez 'openai-whisper'."
            )
        return whisper
    except Exception as e:
        raise TranscriptionError(str(e)) from e

def transcribe_audio(
    file_path: str | Path,
    engine: Literal["local", "openai"] = "local",
    language: Optional[str] = None,
    model_size: str = "base",
) -> str:
    file_path = str(file_path)

    if engine == "local":
        whisper = _load_local_whisper()
        model = whisper.load_model(model_size)
        # Vous pouvez ajouter language=... si vous voulez forcer une langue
        result = model.transcribe(file_path, language=language)
        return result.get("text", "").strip()

    # ---------- Option API OpenAI (si tu préfères) ----------
    # Nécessite la var d'env OPENAI_API_KEY
    from openai import OpenAI
    client = OpenAI()
    with open(file_path, "rb") as f:
        # modèle rapide et pas cher en 2025
        resp = client.audio.transcriptions.create(
            model="gpt-4o-mini-transcribe",
            file=f,
            # language=language,  # décommente si tu veux forcer
        )
    return (resp.text or "").strip()

# --- à ajouter dans app/services/transcription.py ---
import tempfile
from typing import Any

def _guess_suffix_from_upload(upload: Any) -> str:
    # essaie via le nom de fichier
    filename = getattr(upload, "filename", None) or ""
    lower = filename.lower()
    for ext in (".wav", ".mp3", ".m4a", ".ogg", ".webm"):
        if lower.endswith(ext):
            return ext

    # sinon via le content_type
    ctype = getattr(upload, "content_type", None) or ""
    mapping = {
        "audio/mpeg": ".mp3",
        "audio/wav": ".wav",
        "audio/x-wav": ".wav",
        "audio/mp4": ".m4a",
        "audio/x-m4a": ".m4a",
        "audio/ogg": ".ogg",
        "audio/webm": ".webm",
    }
    return mapping.get(ctype, ".wav")  # défaut: .wav

def save_temp_audio(upload: Any) -> str:
    """
    Écrit l'UploadFile (ou un file-like) dans un fichier temporaire et
    renvoie le chemin du fichier créé.
    """
    suffix = _guess_suffix_from_upload(upload)
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix, prefix="audio_")
    try:
        fileobj = getattr(upload, "file", None) or upload  # support UploadFile ou file-like
        try:
            fileobj.seek(0)
        except Exception:
            pass

        # écriture par chunks pour éviter de charger le fichier en mémoire
        while True:
            chunk = fileobj.read(1024 * 1024)
            if not chunk:
                break
            tmp.write(chunk)
        tmp.flush()
        path = tmp.name
    except Exception as e:
        raise TranscriptionError(f"Failed to write temporary audio file: {e}") from e
    finally:
        try:
            tmp.close()
        except Exception:
            pass

        # libère la ressource UploadFile si présente
        try:
            if hasattr(upload, "file"):
                upload.file.close()
        except Exception:
            pass

    return path
# --- fin ajout ---

def run_whisper_local(upload: UploadFile) -> str:
    import whisper

    # Sauvegarder le fichier temporairement
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        shutil.copyfileobj(upload.file, tmp)
        tmp_path = tmp.name

    # Charger le modèle Whisper
    model = whisper.load_model("base")
    result = model.transcribe(tmp_path)

    return result["text"]


# Si tu veux utiliser l’API OpenAI
def run_openai_whisper(upload: UploadFile) -> str:
    from openai import OpenAI
    import tempfile, shutil

    client = OpenAI()

    # Sauvegarder le fichier temporairement
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        shutil.copyfileobj(upload.file, tmp)
        tmp_path = tmp.name

    # Envoyer à l’API OpenAI
    with open(tmp_path, "rb") as f:
        result = client.audio.transcriptions.create(
            model="whisper-1",
            file=f
        )
    return result.text
