from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Use Render's DATABASE_URL or fallback to local
DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql://fastapi_db_348f_user:wGIXTsQua15wI6mfCk81LAUvN43iYQ4A@dpg-d3h0nvu3jp1c73f4p93g-a/fastapi_db_348f")

# Render requires SSL mode for PostgreSQL
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL, connect_args={"sslmode": "require"} if "render.com" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:

        db.close()
