"""Initial migration - create tasks table

Revision ID: 6218b941d920
Revises:
Create Date: 2026-02-10 16:17:46.502603

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6218b941d920'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """
    Create tasks table with all required columns.

    This migration creates the tasks table with:
    - id: Primary key (auto-increment)
    - title: Task title (varchar 200, not null)
    - description: Optional description (text, nullable)
    - completed: Completion status (boolean, default false)
    - owner_user_id: User who owns the task (varchar 100, not null, indexed)
    - created_at: Creation timestamp (timestamp, not null)
    - updated_at: Last update timestamp (timestamp, not null)
    """
    # Create tasks table
    op.create_table(
        'tasks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('completed', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('owner_user_id', sa.String(length=100), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.PrimaryKeyConstraint('id')
    )

    # Create index on owner_user_id for efficient user-scoped queries
    op.create_index(
        op.f('ix_tasks_owner_user_id'),
        'tasks',
        ['owner_user_id'],
        unique=False
    )


def downgrade() -> None:
    """
    Drop tasks table and its indexes.
    """
    # Drop index first
    op.drop_index(op.f('ix_tasks_owner_user_id'), table_name='tasks')

    # Drop table
    op.drop_table('tasks')
