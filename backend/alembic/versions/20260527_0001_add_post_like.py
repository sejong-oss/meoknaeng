"""add post like table

Revision ID: 20260527_0001
Revises: 20260525_0001
Create Date: 2026-05-27

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "20260527_0001"
down_revision: Union[str, Sequence[str], None] = "20260525_0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "post_like",
        sa.Column("user_id", sa.String(length=36), nullable=False),
        sa.Column("post_id", sa.String(length=36), nullable=False),
        sa.Column("liked_at", sa.TIMESTAMP(), nullable=False),
        sa.ForeignKeyConstraint(["post_id"], ["post.post_id"]),
        sa.ForeignKeyConstraint(["user_id"], ["user.user_id"]),
        sa.PrimaryKeyConstraint("user_id", "post_id"),
    )


def downgrade() -> None:
    op.drop_table("post_like")
