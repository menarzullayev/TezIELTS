from celery import Celery
from core.cfg import cfg

celery_app = Celery(
    "tez_ielts",
    broker=cfg.redis_url,
    backend=cfg.redis_url,
    include=["evl.app.tasks"]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    worker_prefetch_multiplier=1,
    task_acks_late=True,
    task_reject_on_worker_lost=True,
    task_always_eager=cfg.celery_task_always_eager,
    task_eager_propagates=cfg.celery_task_eager_propagates,
)

if __name__ == "__main__":
    celery_app.start()
