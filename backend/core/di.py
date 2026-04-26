from dishka import Provider, Scope, make_async_container, provide
from sqlalchemy.ext.asyncio import AsyncSession
from typing import AsyncIterable
from core.db import async_session_maker

class AppProvider(Provider):
    # Provide a fresh async DB session per request
    @provide(scope=Scope.REQUEST)
    async def get_session(self) -> AsyncIterable[AsyncSession]:
        async with async_session_maker() as session:
            yield session

def setup_di():
    return make_async_container(AppProvider())

