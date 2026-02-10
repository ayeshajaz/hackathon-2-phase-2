"""
Database connection and session management for the backend.

This module provides SQLAlchemy engine configuration and session management
for connecting to Neon Serverless PostgreSQL.
"""

import os
from sqlmodel import create_engine, Session
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

# Create SQLAlchemy engine with connection pooling
# pool_pre_ping=True ensures connections are valid before using them
# This is important for serverless databases that may close idle connections
engine = create_engine(
    DATABASE_URL,
    echo=False,  # Set to True for SQL query logging during development
    pool_pre_ping=True,  # Verify connections before using them
    pool_size=5,  # Number of connections to maintain in the pool
    max_overflow=10,  # Maximum number of connections that can be created beyond pool_size
)


def get_session():
    """
    Dependency injection function for FastAPI routes.

    Provides a database session that is automatically closed after the request.

    Usage in FastAPI routes:
        @app.get("/endpoint")
        def endpoint(session: Session = Depends(get_session)):
            # Use session here
            pass

    Yields:
        Session: SQLModel database session
    """
    with Session(engine) as session:
        yield session
