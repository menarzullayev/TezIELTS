from pydantic import BaseModel
from loguru import logger
from usr.dom.user import UsrEntity, IUsrRepo

class CrtUsrReq(BaseModel):
    eml: str
    pwd: str

class CrtUsrCmd:
    def __init__(self, repo: IUsrRepo):
        self.repo = repo

    async def execute(self, req: CrtUsrReq) -> str:
        logger.info(f"Creating user: {req.eml}")
        
        # Check if exists
        existing = await self.repo.get_by_eml(req.eml)
        if existing:
            from core.exc import DomainException
            raise DomainException("User already exists", 409)

        usr = UsrEntity(eml=req.eml, pwd=req.pwd)
        usr.validate()
        
        uid = await self.repo.save_usr(usr)
        logger.info(f"User created: {uid}")
        return uid
