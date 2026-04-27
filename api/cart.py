from fastapi import APIRouter, Request
from database.db import get_db
import json
import uuid
from datetime import datetime

router = APIRouter(prefix="/api", tags=["cart"])

def get_session_id(request: Request) -> str:
    session_id = request.headers.get("X-Session-ID")
    if not session_id:
        session_id = str(uuid.uuid4())
    return session_id

@router.get("/cart")
async def get_cart(request: Request):
    session_id = get_session_id(request)
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT cart_data FROM cart_storage WHERE session_id = ?", (session_id,))
    result = cursor.fetchone()
    conn.close()
    
    if result:
        return json.loads(result[0])
    return {"cart": [], "total": 0}

@router.post("/cart")
async def save_cart(request: Request):
    session_id = get_session_id(request)
    body = await request.body()
    cart_data = body.decode('utf-8')
    
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT INTO cart_storage (session_id, cart_data, updated_at)
        VALUES (?, ?, ?)
        ON CONFLICT(session_id) DO UPDATE SET
            cart_data = excluded.cart_data,
            updated_at = excluded.updated_at
    """, (session_id, cart_data, datetime.now().isoformat()))
    
    conn.commit()
    conn.close()
    return {"status": "saved"}