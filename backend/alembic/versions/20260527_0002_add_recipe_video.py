"""add recipe_video table

Revision ID: 20260527_0002
Revises: 20260527_0001
Create Date: 2026-05-27

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "20260527_0002"
down_revision: Union[str, Sequence[str], None] = "20260527_0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "recipe_video",
        sa.Column("recipe_id", sa.String(length=36), nullable=False),
        sa.Column("video_id", sa.String(length=20), nullable=False),
        sa.Column("title", sa.Text(), nullable=False),
        sa.Column("thumbnail_url", sa.Text(), nullable=False),
        sa.Column("video_url", sa.Text(), nullable=False),
        sa.ForeignKeyConstraint(["recipe_id"], ["recipe.recipe_id"]),
        sa.PrimaryKeyConstraint("recipe_id", "video_id"),
    )


def downgrade() -> None:
    op.drop_table("recipe_video")
