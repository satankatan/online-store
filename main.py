from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.db import init_db
from api import auth, cart, orders, subscribe

# Создаём приложение
app = FastAPI(title="Urban Muse API", version="1.0.0")

# Настройка CORS (важно для фронта!)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешаем все источники (для разработки)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем все роутеры
app.include_router(auth.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(subscribe.router)

# Эндпоинт для товаров (фронт хранит товары у себя)
@app.get("/api/products")
async def get_products():
    # Фронт сам управляет товарами, возвращаем пустой массив
    return []

# Корневой эндпоинт
@app.get("/")
def root():
    return {"message": "Urban Muse API", "status": "running"}

# Инициализация базы данных при запуске
@app.on_event("startup")
def startup():
    init_db()
    print("=" * 50)
    print("🛍️  Urban Muse Backend Server")
    print("=" * 50)
    print("Сервер запущен на http://localhost:8000")
    print("Документация: http://localhost:8000/docs")
    print("=" * 50)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)