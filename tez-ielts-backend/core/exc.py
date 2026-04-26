from fastapi import Request
from fastapi.responses import JSONResponse
from loguru import logger

class DomainException(Exception):
    def __init__(self, msg: str, code: int = 400):
        self.msg = msg
        self.code = code

async def domain_exception_handler(request: Request, exc: DomainException):
    logger.warning(f"Domain Error: {exc.msg}")
    return JSONResponse(status_code=exc.code, content={"detail": exc.msg})
