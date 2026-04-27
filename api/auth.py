from fastapi import APIRouter, HTTPException, Request
from database.db import get_db
from core.security import hash_password, verify_password
import json
import secrets
from datetime import datetime

router = APIRouter(prefix="/api", tags=["auth"])

@router.post("/register")
async def register(request: Request):
    body = await request.body()
    data = json.loads(body.decode('utf-8'))
    
    name = data.get("name", "")
    email = data.get("email", "").lower()
    password = data.get("password", "")
    
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password required")
    
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Email already registered")
    
    password_hash = hash_password(password)
    created_at = datetime.now().isoformat()
    
    cursor.execute("""
        INSERT INTO users (email, password_hash, name, created_at)
        VALUES (?, ?, ?, ?)
    """, (email, password_hash, name, created_at))
    
    conn.commit()
    conn.close()
    
    return {"message": "User registered successfully"}

@router.post("/login")
async def login(request: Request):
    body = await request.body()
    data = json.loads(body.decode('utf-8'))
    
    email = data.get("email", "").lower()
    password = data.get("password", "")
    
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, name, email, password_hash FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()
    
    if not user or not verify_password(password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = secrets.token_hex(32)
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "name": user["name"] or user["email"].split('@')[0],
            "email": user["email"]
        }
    }