"""
JWT token generation and validation utilities.

This module provides functions for creating and verifying JWT access tokens
using the PyJWT library. Tokens are signed with HS256 algorithm and include
user identification and expiration information.
"""

import jwt
from datetime import datetime, timedelta
import os
from typing import Dict, Any

# Load JWT configuration from environment variables
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRATION_HOURS = int(os.getenv("JWT_EXPIRATION_HOURS", "24"))

# Validate JWT_SECRET is configured
if not JWT_SECRET:
    raise ValueError(
        "JWT_SECRET environment variable is not set. "
        "Please configure JWT_SECRET in your .env file."
    )


def create_access_token(user_id: str, email: str) -> str:
    """
    Create a JWT access token for a user.

    The token includes:
    - user_id: UUID of the authenticated user
    - email: User's email address
    - exp: Expiration timestamp (current time + JWT_EXPIRATION_HOURS)
    - iat: Issued at timestamp (current time)

    Args:
        user_id: The user's UUID (as string)
        email: The user's email address

    Returns:
        JWT token string

    Example:
        >>> token = create_access_token("550e8400-e29b-41d4-a716-446655440000", "user@example.com")
        >>> print(token)
        eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    """
    now = datetime.utcnow()
    payload = {
        "user_id": str(user_id),
        "email": email,
        "exp": now + timedelta(hours=JWT_EXPIRATION_HOURS),
        "iat": now
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def verify_token(token: str) -> Dict[str, Any]:
    """
    Verify and decode a JWT access token.

    Args:
        token: The JWT token string to verify

    Returns:
        Decoded token payload as a dictionary containing user_id, email, exp, iat

    Raises:
        ValueError: If token is expired or invalid

    Example:
        >>> token = create_access_token("550e8400-e29b-41d4-a716-446655440000", "user@example.com")
        >>> payload = verify_token(token)
        >>> print(payload["user_id"])
        550e8400-e29b-41d4-a716-446655440000
    """
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise ValueError("Token has expired")
    except jwt.InvalidTokenError:
        raise ValueError("Invalid token")
