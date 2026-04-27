import hashlib
import secrets

def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    password_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000).hex()
    return f"{password_hash}:{salt}"

def verify_password(password: str, hashed: str) -> bool:
    try:
        password_hash, salt = hashed.split(":")
        return hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000).hex() == password_hash
    except:
        return False