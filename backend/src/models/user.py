"""
User model for authentication and user management.

This module defines the User SQLModel for storing user account information
including email, hashed password, and timestamps.
"""

from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional
import uuid


class User(SQLModel, table=True):
    """
    User model for authentication.

    Stores user account information with secure password hashing.
    Each user has a unique UUID and email address.
    """

    __tablename__ = "users"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        nullable=False,
        description="Unique user identifier (UUID v4)"
    )
    email: str = Field(
        max_length=255,
        unique=True,
        index=True,
        nullable=False,
        description="User's email address (unique, indexed for fast lookup)"
    )
    hashed_password: str = Field(
        max_length=255,
        nullable=False,
        description="Bcrypt hashed password (never store plaintext)"
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        description="Timestamp when user account was created"
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        description="Timestamp when user account was last updated"
    )
