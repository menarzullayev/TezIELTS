from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dishka.integrations.fastapi import setup_dishka
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from core.di import setup_di
from core.log import setup_logging, log
from core.sec import limiter
from usr.api.usr_router import router as usr_router
from evl.api.evl_router import router as evl_router
from core.exc import DomainException, domain_exception_handler

def create_app() -> FastAPI:
    # Setup Loguru
    setup_logging()
    log.info("Starting TezIELTS FastAPI server...")

    app = FastAPI(title="TezIELTS API", version="0.1.0")
    
    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Rate Limiting
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
    app.add_exception_handler(DomainException, domain_exception_handler)

    # Dependency Injection Container
    container = setup_di()
    setup_dishka(container, app)

    # Routers
    app.include_router(usr_router, prefix="/api/v1")
    app.include_router(evl_router, prefix="/api/v1")

    return app

app = create_app()

@app.get("/health")
async def health_check():
    return {"status": "ok"}
