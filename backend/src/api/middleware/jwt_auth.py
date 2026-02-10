"""
JWT authentication middleware for FastAPI.

This module provides a dependency function for validating JWT tokens
and extracting the authenticated user's ID from the token payload.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Annotated
import uuid

from ...utils.jwt_utils import verify_token

# HTTP Bearer token security scheme
security = HTTPBearer()


def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)]
) -> uuid.UUID:
    """
    Dependency function to extract and validate the current user from JWT token.

    This function:
    1. Extracts the JWT token from the Authorization header (Bearer scheme)
    2. Validates the token signature and expiration
    3. Extracts the user_id from the token payload
    4. Returns the user_id as a UUID

    Args:
        credentials: HTTP Bearer credentials (injected by FastAPI)

    Returns:
        UUID of the authenticated user

    Raises:
        401 Unauthorized: If token is missing, invalid, or expired

    Usage:
        @app.get("/protected")
        def protected_route(user_id: Annotated[uuid.UUID, Depends(get_current_user)]):
            return {"user_id": str(user_id)}
    """
    token = credentials.credentials

    try:
        # Verify and decode the token
        payload = verify_token(token)

        # Extract user_id from payload
        user_id_str = payload.get("user_id")
        if not user_id_str:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing user_id",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Convert user_id string to UUID
        user_id = uuid.UUID(user_id_str)
        return user_id

    except ValueError as e:
        # Token verification failed (expired or invalid)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        # Unexpected error
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
