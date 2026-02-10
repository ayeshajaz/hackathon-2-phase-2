"""
Authentication routes for user signup, signin, and profile management.

This module provides endpoints for:
- User registration (signup)
- User authentication (signin)
- Getting current user information
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import Annotated
import uuid

from ...database import get_session
from ...models.user import User
from ...schemas.auth import SignupRequest, SigninRequest, AuthResponse
from ...schemas.user import UserResponse
from ...utils.password import hash_password, verify_password
from ...utils.jwt_utils import create_access_token
from ..middleware.jwt_auth import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup(
    signup_data: SignupRequest,
    session: Annotated[Session, Depends(get_session)]
):
    """
    Register a new user account.

    Creates a new user with the provided email and password. The password is
    securely hashed using bcrypt before storage. Returns the user data and a
    JWT access token.

    Args:
        signup_data: User registration data (email, password)
        session: Database session (injected)

    Returns:
        AuthResponse with user data and JWT token

    Raises:
        409 Conflict: Email already exists
        400 Bad Request: Invalid email format or weak password (handled by Pydantic)
    """
    # Check if email already exists
    existing_user = session.exec(
        select(User).where(User.email == signup_data.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    # Hash the password
    hashed_password = hash_password(signup_data.password)

    # Create new user
    new_user = User(
        email=signup_data.email,
        hashed_password=hashed_password
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    # Generate JWT token
    token = create_access_token(str(new_user.id), new_user.email)

    # Return user data and token
    return AuthResponse(
        user=UserResponse.model_validate(new_user),
        token=token
    )


@router.post("/signin", response_model=AuthResponse)
def signin(
    signin_data: SigninRequest,
    session: Annotated[Session, Depends(get_session)]
):
    """
    Authenticate a user and return a JWT token.

    Verifies the user's email and password, then generates a JWT access token
    for authenticated requests.

    Args:
        signin_data: User login credentials (email, password)
        session: Database session (injected)

    Returns:
        AuthResponse with user data and JWT token

    Raises:
        401 Unauthorized: Invalid email or password
    """
    # Find user by email
    user = session.exec(
        select(User).where(User.email == signin_data.email)
    ).first()

    # Verify user exists and password is correct
    if not user or not verify_password(signin_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Generate JWT token
    token = create_access_token(str(user.id), user.email)

    # Return user data and token
    return AuthResponse(
        user=UserResponse.model_validate(user),
        token=token
    )


@router.get("/me", response_model=UserResponse)
def get_current_user_info(
    user_id: Annotated[uuid.UUID, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)]
):
    """
    Get the current authenticated user's information.

    This endpoint requires JWT authentication via the Authorization header.
    Returns the authenticated user's profile data.

    Args:
        user_id: UUID of authenticated user (extracted from JWT token)
        session: Database session (injected)

    Returns:
        UserResponse with current user data

    Raises:
        401 Unauthorized: Missing, invalid, or expired token
        404 Not Found: User not found in database
    """
    # Query user from database
    user = session.get(User, user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return UserResponse.model_validate(user)
