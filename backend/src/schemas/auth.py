"""
Authentication schemas for request/response validation.

This module defines Pydantic schemas for authentication operations:
- SignupRequest: For user registration
- SigninRequest: For user login
- AuthResponse: For returning authentication results with JWT token
"""

from pydantic import BaseModel, EmailStr, Field
from .user import UserResponse


class SignupRequest(BaseModel):
    """
    Schema for user signup/registration requests.
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


class SigninRequest(BaseModel):
    """
    Schema for user signin/login requests.
    """

    email: EmailStr = Field(
        ...,
        description="User's email address"
    )
    password: str = Field(
        ...,
        description="User's password"
    )


class AuthResponse(BaseModel):
    """
    Schema for authentication response with user data and JWT token.

    Returned after successful signup or signin.
    """

    user: UserResponse = Field(
        ...,
        description="User account information"
    )
    token: str = Field(
        ...,
        description="JWT access token for authenticated requests"
    )
