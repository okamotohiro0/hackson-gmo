from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from core.config import get_env

# データベースの接続情報を取得
DATABASE_URL = get_env().database_url

# SQLAlchemyエンジンの作成
engine = create_engine(DATABASE_URL)

# セッションファクトリの作成
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# FastAPIの依存関数として使用するget_db関数
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
