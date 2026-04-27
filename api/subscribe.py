from fastapi import APIRouter, HTTPException, Request
from database.db import get_db
import json
from datetime import datetime

router = APIRouter(prefix="/api", tags=["subscribe"])

@router.post("/subscribe")
async def subscribe(request: Request):
    body = await request.body()
    data = json.loads(body.decode('utf-8'))
    
    email = data.get("email", "").lower()
    
    if not email:
        raise HTTPException(status_code=400, detail="Email required")
    
    conn = get_db()
    cursor = conn.cursor()
    
    try:
        cursor.execute("INSERT INTO subscribers (email, created_at) VALUES (?, ?)",
                      (email, datetime.now().isoformat()))
        conn.commit()
    except Exception:
        conn.close()
        raise HTTPException(status_code=400, detail="Already subscribed")
    
    conn.close()
    return {"message": "Subscribed successfully"}