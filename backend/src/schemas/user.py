"""
User schemas for request/response validation.

This module defines Pydantic schemas for user-related operations:
- UserCreate: For user registration (input)
- UserResponse: For returning user data (output, excludes password)
"""

from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
import uuid


class UserCreate(BaseModel):
    """
    Schema for creating a new user account.

    Used for user registration/signup requests.
    """

    email: EmailStr = Field(
        ...,
        description="User's email address (must be valid email format)"
    )
    password: str = Field(
        ...,
        min_length=8,
        description="User's password (minimum 8 characters)"
    )


class UserResponse(BaseModel):
    """
    Schema for returning user data in API responses.

    Excludes sensitive information like hashed_password.
    """

    id: uuid.UUID = Field(
        ...,
        description="Unique user identifier"
    )
    email: str = Field(
        ...,
        description="User's email address"
    )
    created_at: datetime = Field(
        ...,
        description="Timestamp when user account was created"
    )

    class Config:
        from_attributes = True
