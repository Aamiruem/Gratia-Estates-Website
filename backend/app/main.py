if __package__ in (None, ""):
    import sys
    from pathlib import Path

    backend_dir = Path(__file__).resolve().parent.parent
    backend_python = backend_dir / ".venv" / "Scripts" / "python.exe"
    if (
        __name__ == "__main__"
        and backend_python.is_file()
        and Path(sys.executable).resolve() != backend_python.resolve()
    ):
        import os

        os.execv(
            str(backend_python),
            [str(backend_python), str(Path(__file__).resolve()), *sys.argv[1:]],
        )

    sys.path.insert(0, str(backend_dir))
    __package__ = "app"

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import config  # noqa: F401
from .database import create_tables
from .routers.auth import router as auth_router
from .routers.reactions import router as reactions_router
from .routers.users import router as users_router
from .routers.videos import router as videos_router
from .seed import seed_sample_videos


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    seed_sample_videos()
    yield


app = FastAPI(
    title="Real Estate Authentication API",
    version="1.0.0",
    description="React + FastAPI + PostgreSQL authentication backend",
    lifespan=lifespan,
)

frontend_origins = {
    origin.strip()
    for origin in (
        "http://localhost:5173,http://127.0.0.1:5173,"
        + os.getenv("FRONTEND_ORIGINS", "")
        + ","
        + os.getenv("FRONTEND_ORIGIN", "")
    ).split(",")
    if origin.strip()
}

app.add_middleware(
    CORSMiddleware,
    allow_origins=sorted(frontend_origins),
    allow_origin_regex=(
        r"https?://(localhost|127\.0\.0\.1|10(?:\.\d{1,3}){3}|"
        r"172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2}|"
        r"192\.168(?:\.\d{1,3}){2}):\d+"
    ),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


app.include_router(auth_router)
app.include_router(users_router)
app.include_router(videos_router)
app.include_router(reactions_router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=False,
    )
