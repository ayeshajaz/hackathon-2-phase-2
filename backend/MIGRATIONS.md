# Database Migrations Guide

This guide explains how to manage database schema changes using Alembic migrations.

## Overview

This project uses **Alembic** for database migrations with **SQLModel**. Migrations allow you to:
- Version control your database schema
- Apply schema changes safely without data loss
- Roll back changes if needed
- Collaborate with team members on schema changes

## Prerequisites

- Python virtual environment activated
- Dependencies installed (`pip install -r requirements.txt`)
- `.env` file configured with `DATABASE_URL`

## Quick Start

### Apply Existing Migrations

When setting up the project for the first time or pulling new migrations:

```bash
cd backend/

# Apply all pending migrations
alembic upgrade head
```

This will create the `tasks` table in your Neon PostgreSQL database.

### Verify Migration Status

```bash
# Check current migration version
alembic current

# View migration history
alembic history --verbose
```

## Creating New Migrations

### Automatic Migration Generation (Recommended)

When you modify SQLModel models (e.g., add a new field to Task):

```bash
# 1. Update your SQLModel model in src/models/
# 2. Generate migration automatically
alembic revision --autogenerate -m "Add new_field to tasks table"

# 3. Review the generated migration file in alembic/versions/
# 4. Apply the migration
alembic upgrade head
```

**Important**: Always review auto-generated migrations before applying them!

### Manual Migration Creation

For complex changes or data migrations:

```bash
# Create empty migration file
alembic revision -m "Custom migration description"

# Edit the generated file in alembic/versions/
# Add your custom upgrade() and downgrade() logic

# Apply the migration
alembic upgrade head
```

## Migration Commands

### Upgrade (Apply Migrations)

```bash
# Upgrade to latest version
alembic upgrade head

# Upgrade by 1 version
alembic upgrade +1

# Upgrade to specific revision
alembic upgrade <revision_id>
```

### Downgrade (Rollback Migrations)

```bash
# Downgrade by 1 version
alembic downgrade -1

# Downgrade to specific revision
alembic downgrade <revision_id>

# Downgrade to base (remove all migrations)
alembic downgrade base
```

### Information Commands

```bash
# Show current version
alembic current

# Show migration history
alembic history

# Show detailed history
alembic history --verbose

# Show pending migrations
alembic heads
```

## Migration File Structure

Each migration file contains:

```python
def upgrade() -> None:
    """Apply schema changes"""
    # Add your upgrade logic here
    op.create_table(...)
    op.add_column(...)

def downgrade() -> None:
    """Revert schema changes"""
    # Add your downgrade logic here
    op.drop_column(...)
    op.drop_table(...)
```

## Initial Migration

The initial migration (`6218b941d920_initial_migration_create_tasks_table.py`) creates:

**tasks table**:
- `id` - Integer, Primary Key, Auto-increment
- `title` - String(200), Not Null
- `description` - Text, Nullable
- `completed` - Boolean, Not Null, Default: false
- `owner_user_id` - String(100), Not Null, Indexed
- `created_at` - DateTime, Not Null, Default: CURRENT_TIMESTAMP
- `updated_at` - DateTime, Not Null, Default: CURRENT_TIMESTAMP

**Indexes**:
- `ix_tasks_owner_user_id` on `owner_user_id` column

## Development vs Production

### Development Mode

For quick local development, you can optionally use auto-create:

1. Edit `src/main.py`
2. Uncomment: `SQLModel.metadata.create_all(engine)`
3. Restart the server

**Warning**: This doesn't handle schema changes or migrations!

### Production Mode (Recommended)

Always use Alembic migrations in production:

1. Generate migration: `alembic revision --autogenerate -m "description"`
2. Review the generated migration file
3. Test migration in staging environment
4. Apply migration: `alembic upgrade head`
5. Deploy application code

## Common Workflows

### Adding a New Column

```bash
# 1. Update SQLModel in src/models/task.py
class Task(SQLModel, table=True):
    # ... existing fields ...
    new_field: Optional[str] = Field(default=None)

# 2. Generate migration
alembic revision --autogenerate -m "Add new_field to tasks"

# 3. Review migration file
# 4. Apply migration
alembic upgrade head
```

### Renaming a Column

```bash
# 1. Create manual migration
alembic revision -m "Rename column old_name to new_name"

# 2. Edit migration file
def upgrade():
    op.alter_column('tasks', 'old_name', new_column_name='new_name')

def downgrade():
    op.alter_column('tasks', 'new_name', new_column_name='old_name')

# 3. Update SQLModel
# 4. Apply migration
alembic upgrade head
```

### Adding an Index

```bash
# 1. Generate migration
alembic revision --autogenerate -m "Add index on completed column"

# 2. Or create manually
def upgrade():
    op.create_index('ix_tasks_completed', 'tasks', ['completed'])

def downgrade():
    op.drop_index('ix_tasks_completed', 'tasks')

# 3. Apply migration
alembic upgrade head
```

## Troubleshooting

### Migration Fails

```bash
# Check current state
alembic current

# View SQL without applying
alembic upgrade head --sql

# Force mark as applied (use with caution!)
alembic stamp head
```

### Reset Database (Development Only)

```bash
# WARNING: This deletes all data!

# Downgrade to base
alembic downgrade base

# Upgrade to latest
alembic upgrade head
```

### Merge Conflicts in Migrations

If multiple developers create migrations:

```bash
# Create merge migration
alembic merge -m "Merge migrations" <rev1> <rev2>

# Apply merge
alembic upgrade head
```

## Best Practices

1. **Always review auto-generated migrations** - Alembic may not detect all changes correctly
2. **Test migrations in staging first** - Never apply untested migrations to production
3. **Write reversible migrations** - Always implement `downgrade()` functions
4. **One logical change per migration** - Keep migrations focused and atomic
5. **Add comments to complex migrations** - Explain why changes are needed
6. **Backup before major migrations** - Always have a backup before schema changes
7. **Version control migrations** - Commit migration files to git
8. **Never edit applied migrations** - Create new migrations for changes

## Configuration

### Environment Variables

Alembic reads `DATABASE_URL` from `.env`:

```bash
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

### Alembic Configuration

- `alembic.ini` - Main configuration file
- `alembic/env.py` - Environment setup (SQLModel integration)
- `alembic/versions/` - Migration files directory

## Resources

- [Alembic Documentation](https://alembic.sqlalchemy.org/)
- [SQLModel Documentation](https://sqlmodel.tiangolo.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Support

For issues or questions:
- Review this guide
- Check Alembic documentation
- Review migration history: `alembic history --verbose`
- Check current state: `alembic current`
