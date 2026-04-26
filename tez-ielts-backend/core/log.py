import sys
from loguru import logger
from core.cfg import cfg

def setup_logging():
    """
    Configures Loguru for the application.
    Removes the default handler, adds a colorized console handler,
    and a file handler for JSON logs with rotation and retention.
    """
    logger.remove()

    # Console Handler: Colorful and human-readable
    logger.add(
        sys.stdout,
        colorize=True,
        format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
        level="DEBUG" if cfg.debug else "INFO"
    )

    # File Handler: JSON formatted, async, auto-rotating, compressing
    logger.add(
        "logs/app.log",
        serialize=True,           # JSON format
        enqueue=True,             # Asynchronous writes (safe for multi-threading/asyncio)
        rotation="10 MB",         # Rotate when file reaches 10MB
        retention="1 month",      # Keep logs for 1 month
        compression="zip",        # Compress older logs to save space
        level="INFO"
    )

    logger.info("Logging subsystem initialized successfully.")

# Expose the configured logger
log = logger
