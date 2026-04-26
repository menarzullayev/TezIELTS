# TezIELTS Monorepo

Bu repo endi bitta monorepo sifatida ishlaydi:

- `frontend/` - Next.js ilovasi
- `backend/` - FastAPI + Celery backend

## Ishga tushirish

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Testlar

Frontend unit testlari:

```bash
cd frontend
npm run test:unit
```

Backend testlari:

```bash
cd backend
pytest -q
```

## Environment Fayllar

- `frontend/.env.example`
- `backend/.env.example`

Haqiqiy sirlar `.env` fayllarda saqlanadi va Git'ga kiritilmaydi.

## CI

GitHub Actions:

- `frontend/` uchun format, lint, vitest, audit
- `backend/` uchun ruff, bandit, pytest, docker build
