from fastapi import APIRouter, Request
from database.db import get_db
import json
import uuid
from datetime import datetime

router = APIRouter(prefix="/api", tags=["orders"])

@router.post("/orders")
async def create_order(request: Request):
    body = await request.body()
    order_data = json.loads(body.decode('utf-8'))
    
    # Получаем session-id из заголовка или куки
    session_id = request.headers.get("X-Session-ID", str(uuid.uuid4()))
    
    conn = get_db()
    cursor = conn.cursor()
    
    order_record = {
        "id": f"ORD-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}",
        "created_at": datetime.now().isoformat(),
        "data": order_data
    }
    
    cursor.execute("""
        INSERT INTO orders_storage (session_id, order_data, created_at)
        VALUES (?, ?, ?)
    """, (session_id, json.dumps(order_record), datetime.now().isoformat()))
    
    # Очищаем корзину после заказа
    cursor.execute("DELETE FROM cart_storage WHERE session_id = ?", (session_id,))
    
    conn.commit()
    conn.close()
    
    return {"order_id": order_record["id"], "status": "success"}