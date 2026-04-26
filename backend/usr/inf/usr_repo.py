import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from usr.dom.user import IUsrRepo, UsrEntity
from usr.inf.usr_orm import UserORM

class UsrRepoImpl(IUsrRepo):
    def __init__(self, session: AsyncSession):
        self._session = session

    async def save_usr(self, usr: UsrEntity) -> str:
        new_id = str(uuid.uuid4())
        db_user = UserORM(
            id=new_id,
            email=usr.eml,
            name=usr.nme,
            password_hash=usr.pwd,
            role=usr.rol,
        )
        self._session.add(db_user)
        await self._session.commit()
        await self._session.refresh(db_user)
        return db_user.id

    async def get_by_eml(self, eml: str) -> UsrEntity | None:
        result = await self._session.execute(
            select(UserORM).where(UserORM.email == eml)
        )
        db_user = result.scalar_one_or_none()
        if not db_user:
            return None
        return UsrEntity(
            uid=db_user.id,
            eml=db_user.email,
            nme=db_user.name,
            pwd=db_user.password_hash,
            rol=db_user.role,
        )

