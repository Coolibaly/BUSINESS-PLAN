# app/core/security.py
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from cryptography.fernet import Fernet, InvalidToken
from app.core.config import settings
from typing import Optional
import base64

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

def create_refresh_token(data: dict):
    expire = datetime.utcnow() + timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
    data.update({"exp": expire})
    return jwt.encode(data, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

def decode_token(token: str):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        return None

# Fernet encryption
fernet = Fernet(settings.FERNET_SECRET.encode())

def encrypt_data(value: str) -> str:
    """
    Chiffre la chaîne `value` et renvoie un token Base64 url-safe.
    """
    # value.encode() → bytes → encrypt → bytes → decode() → str
    return fernet.encrypt(value.encode()).decode()

def decrypt_data(token: str) -> str:
    """
    Déchiffre le `token` (str) et renvoie la chaîne d’origine.
    Lève une InvalidToken si le token est invalide ou expiré.
    """
    try:
        return fernet.decrypt(token.encode()).decode()
    except InvalidToken as e:
        # Ici vous pouvez logger ou transformer l’erreur
        raise ValueError("Token Fernet invalide ou expiré") from e
# Roles
class Roles:
    ADMIN = "admin"
    ANALYST = "analyst"
    OWNER = "owner"
