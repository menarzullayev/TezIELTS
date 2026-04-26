from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from core.cfg import cfg

engine_kwargs = {
    "echo": False,
    "future": True,
}

if not cfg.db_url_async.startswith("sqlite"):
    engine_kwargs.update(
        {
            "pool_size": 20,
            "max_overflow": 10,
        }
    )

engine = create_async_engine(cfg.db_url_async, **engine_kwargs)

# Async Session Factory
async_session_maker = async_sessionmaker(
    engine, 
    class_=AsyncSession, 
    expire_on_commit=False,
    autoflush=False
)

# Declarative Base for ORM Models
Base = declarative_base()

async def get_db_session() -> AsyncSession:
    """Dependency for providing database sessions."""
    async with async_session_maker() as session:
        yield session
