"""
Password hashing utilities using bcrypt.

This module provides secure password hashing and verification functions
using the passlib library with bcrypt algorithm (cost factor 12).
"""

from passlib.context import CryptContext

# Configure password hashing context with bcrypt
# Cost factor 12 provides good security while maintaining reasonable performance (~300ms)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)


def hash_password(password: str) -> str:
    """
    Hash a plaintext password using bcrypt.

    Args:
        password: The plaintext password to hash

    Returns:
        The bcrypt hashed password string

    Example:
        >>> hashed = hash_password("mypassword123")
        >>> print(hashed)
        $2b$12$...
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plaintext password against a bcrypt hash.

    Args:
        plain_password: The plaintext password to verify
        hashed_password: The bcrypt hashed password to check against

    Returns:
        True if the password matches, False otherwise

    Example:
        >>> hashed = hash_password("mypassword123")
        >>> verify_password("mypassword123", hashed)
        True
        >>> verify_password("wrongpassword", hashed)
        False
    """
    return pwd_context.verify(plain_password, hashed_password)
