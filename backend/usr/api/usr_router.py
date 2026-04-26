from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from core.db import get_db_session
from core.log import log
from core.sec import (limiter, hash_password, verify_password, 
                      create_access_token, create_refresh_token, get_current_user)
from usr.api.dto import LgnReq, RegReq, TknRes, UsrRes
from usr.dom.user import UsrEntity
from usr.inf.usr_repo import UsrRepoImpl

router = APIRouter(prefix="/usr", tags=["User & Auth"])


@router.post("/reg", response_model=UsrRes, status_code=201)
@limiter.limit("5/minute")
async def register_user(
    request: Request, 
    req: RegReq,
    session: AsyncSession = Depends(get_db_session)
):
    log.info(f"reg_req: {req.eml}")
    repo = UsrRepoImpl(session)

    # Check if email exists
    existing = await repo.get_by_eml(req.eml)
    if existing:
        log.warning(f"reg_fail: Email already exists - {req.eml}")
        raise HTTPException(status_code=400, detail="Bu email allaqachon ro'yxatdan o'tgan")

    usr = UsrEntity(
        eml=req.eml,
        nme=req.nme,
        pwd=hash_password(req.pwd),
        rol="user"
    )
    new_id = await repo.save_usr(usr)
    log.info(f"reg_ok: {req.eml} -> id={new_id}")
    return UsrRes(uid=new_id, eml=req.eml, nme=req.nme, rol="user")


@router.post("/lgn", response_model=TknRes)
@limiter.limit("10/minute")
async def login_user(
    request: Request, 
    req: LgnReq,
    session: AsyncSession = Depends(get_db_session)
):
    log.info(f"lgn_req: {req.eml}")
    repo = UsrRepoImpl(session)

    user = await repo.get_by_eml(req.eml)
    if not user or not verify_password(req.pwd, user.pwd):
        log.warning(f"lgn_fail: Invalid credentials - {req.eml}")
        raise HTTPException(status_code=401, detail="Email yoki parol noto'g'ri")

    payload = {"sub": user.uid, "rol": user.rol}
    acc_tkn = create_access_token(payload)
    ref_tkn = create_refresh_token(payload)

    log.info(f"lgn_ok: {req.eml}")
    return TknRes(acc_tkn=acc_tkn, ref_tkn=ref_tkn)


@router.get("/me", response_model=UsrRes)
async def get_me(
    current_user: dict = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session)
):
    uid = current_user.get("sub")
    log.info(f"me_req: UID={uid}")
    
    from sqlalchemy import select
    from usr.inf.usr_orm import UserORM
    result = await session.execute(select(UserORM).where(UserORM.id == uid))
    db_user = result.scalar_one_or_none()

    if not db_user:
        raise HTTPException(status_code=404, detail="Foydalanuvchi topilmadi")

    return UsrRes(uid=db_user.id, eml=db_user.email, nme=db_user.name, rol=db_user.role)
