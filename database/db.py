import sqlite3
from datetime import datetime

DB_NAME = "urban_muse.db"

def get_db():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # Таблица пользователей
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            name TEXT,
            created_at TEXT
        )
    ''')
    
    # Таблица корзины
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS cart_storage (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT UNIQUE NOT NULL,
            cart_data TEXT NOT NULL,
            updated_at TEXT
        )
    ''')
    
    # Таблица заказов
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders_storage (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT,
            order_data TEXT NOT NULL,
            created_at TEXT
        )
    ''')
    
    # Таблица подписчиков
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS subscribers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            created_at TEXT
        )
    ''')
    
    conn.commit()
    conn.close()
    print("✅ База данных готова")