"""
FastAPI application entry point for the task management backend.

This module initializes the FastAPI application, configures middleware,
and creates database tables on startup.
"""

import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel
from contextlib import asynccontextmanager
import time

from .database import engine
from .models.task import Task  # Import Task model to register it with SQLModel metadata
from .models.user import User  # Import User model to register it with SQLModel metadata

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for FastAPI application.

    Handles startup and shutdown events:
    - Startup: Database initialization
    - Shutdown: Clean up resources (if needed)

    IMPORTANT: Database Schema Management
    ======================================

    PRODUCTION (Recommended):
    - Use Alembic migrations to manage database schema
    - Run migrations before starting the app:
      $ alembic upgrade head
    - This approach is safe and preserves existing data

    DEVELOPMENT (Optional):
    - Uncomment the SQLModel.metadata.create_all(engine) line below
    - This will auto-create tables on startup (useful for quick local dev)
    - WARNING: This does NOT handle schema changes or migrations

    DO NOT use drop_all() in production - it will delete all data!
    """
    # Startup: Log application start
    try:
        logger.info("Starting application...")
        logger.info("Connecting to database...")

        # DEVELOPMENT ONLY: Uncomment to auto-create tables on startup
        # SQLModel.metadata.create_all(engine)
        # logger.info("Database tables created (dev mode)")

        # PRODUCTION: Use Alembic migrations instead
        # Run: alembic upgrade head
        logger.info("Database ready (use 'alembic upgrade head' to apply migrations)")

        logger.info("Application startup complete")
    except Exception as e:
        logger.error(f"Failed to initialize application: {str(e)}")
        raise

    yield

    # Shutdown: Clean up resources
    logger.info("Application shutdown")


# Initialize FastAPI application
app = FastAPI(
    title="Task Management API",
    description="RESTful API for managing user tasks with JWT authentication and persistent storage in Neon PostgreSQL",
    version="2.0.0",
    lifespan=lifespan,
)

# Configure OpenAPI security scheme for JWT Bearer token authentication
app.openapi_schema = None  # Reset schema to force regeneration


def custom_openapi():
    """
    Customize OpenAPI schema to include JWT Bearer token authentication.
    """
    if app.openapi_schema:
        return app.openapi_schema

    from fastapi.openapi.utils import get_openapi

    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )

    # Add security scheme for Bearer token
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "Enter your JWT token in the format: Bearer <token>",
        }
    }

    # Apply security globally to all endpoints (except auth endpoints)
    # Individual endpoints can override this with security=[]
    openapi_schema["security"] = [{"BearerAuth": []}]

    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi

# Configure CORS middleware for future frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """
    Middleware to log all HTTP requests and their processing time.
    """
    start_time = time.time()

    # Log incoming request
    logger.info(f"Incoming request: {request.method} {request.url.path}")

    try:
        response = await call_next(request)

        # Log response status and processing time
        process_time = time.time() - start_time
        logger.info(
            f"Request completed: {request.method} {request.url.path} "
            f"- Status: {response.status_code} - Time: {process_time:.3f}s"
        )

        return response
    except Exception as e:
        # Log errors
        logger.error(
            f"Request failed: {request.method} {request.url.path} - Error: {str(e)}"
        )
        raise


@app.get("/")
def root():
    """
    Root endpoint for health check.

    Returns:
        dict: Welcome message and API status
    """
    return {
        "message": "Task Management API",
        "status": "running",
        "docs": "/docs",
        "redoc": "/redoc",
    }


# Register task routes
from .api.routes.tasks import router as tasks_router
from .api.routes.auth import router as auth_router

app.include_router(auth_router)
app.include_router(tasks_router)
