"""create initial schema

Revision ID: 20260519_0001
Revises:
Create Date: 2026-05-19 16:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "20260519_0001"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "user",
        sa.Column("user_id", sa.String(length=36), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password", sa.String(length=255), nullable=False),
        sa.Column("nickname", sa.String(length=50), nullable=False),
        sa.Column("created_at", sa.TIMESTAMP(), nullable=False),
        sa.PrimaryKeyConstraint("user_id"),
        sa.UniqueConstraint("email"),
        sa.UniqueConstraint("nickname"),
    )
    op.create_table(
        "recipe",
        sa.Column("recipe_id", sa.String(length=36), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("category", sa.Text(), nullable=True),
        sa.Column("cook_time", sa.Integer(), nullable=True),
        sa.Column("difficulty", sa.String(length=20), nullable=True),
        sa.Column("servings", sa.Integer(), nullable=True),
        sa.Column("created_by", sa.String(length=36), nullable=True),
        sa.Column("created_at", sa.TIMESTAMP(), nullable=False),
        sa.ForeignKeyConstraint(["created_by"], ["user.user_id"]),
        sa.PrimaryKeyConstraint("recipe_id"),
    )
    op.create_table(
        "user_ingredient",
        sa.Column("user_id", sa.String(length=36), nullable=False),
        sa.Column("ingredient_name", sa.String(length=50), nullable=False),
        sa.Column("created_at", sa.TIMESTAMP(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["user.user_id"]),
        sa.PrimaryKeyConstraint("user_id", "ingredient_name"),
    )
    op.create_table(
        "recipe_ingredient",
        sa.Column("ingredient_id", sa.String(length=36), nullable=False),
        sa.Column("recipe_id", sa.String(length=36), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("amount", sa.Text(), nullable=False),
        sa.ForeignKeyConstraint(["recipe_id"], ["recipe.recipe_id"]),
        sa.PrimaryKeyConstraint("ingredient_id"),
    )
    op.create_table(
        "recipe_step",
        sa.Column("step_id", sa.String(length=36), nullable=False),
        sa.Column("recipe_id", sa.String(length=36), nullable=False),
        sa.Column("order", sa.Integer(), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(["recipe_id"], ["recipe.recipe_id"]),
        sa.PrimaryKeyConstraint("step_id"),
        sa.UniqueConstraint("recipe_id", "order"),
    )
    op.create_table(
        "recipe_save",
        sa.Column("user_id", sa.String(length=36), nullable=False),
        sa.Column("recipe_id", sa.String(length=36), nullable=False),
        sa.Column("saved_at", sa.TIMESTAMP(), nullable=False),
        sa.ForeignKeyConstraint(["recipe_id"], ["recipe.recipe_id"]),
        sa.ForeignKeyConstraint(["user_id"], ["user.user_id"]),
        sa.PrimaryKeyConstraint("user_id", "recipe_id"),
    )
    op.create_table(
        "post",
        sa.Column("post_id", sa.String(length=36), nullable=False),
        sa.Column("author_id", sa.String(length=36), nullable=False),
        sa.Column("source_recipe_id", sa.String(length=36), nullable=True),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("tip", sa.String(length=200), nullable=True),
        sa.Column("cook_time", sa.Integer(), nullable=True),
        sa.Column("category", sa.Text(), nullable=True),
        sa.Column("difficulty", sa.String(length=20), nullable=True),
        sa.Column("comment_count", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.TIMESTAMP(), nullable=False),
        sa.Column("updated_at", sa.TIMESTAMP(), nullable=False),
        sa.ForeignKeyConstraint(["author_id"], ["user.user_id"]),
        sa.ForeignKeyConstraint(["source_recipe_id"], ["recipe.recipe_id"]),
        sa.PrimaryKeyConstraint("post_id"),
    )
    op.create_table(
        "comment",
        sa.Column("comment_id", sa.String(length=36), nullable=False),
        sa.Column("post_id", sa.String(length=36), nullable=False),
        sa.Column("author_id", sa.String(length=36), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("created_at", sa.TIMESTAMP(), nullable=False),
        sa.ForeignKeyConstraint(["author_id"], ["user.user_id"]),
        sa.ForeignKeyConstraint(["post_id"], ["post.post_id"]),
        sa.PrimaryKeyConstraint("comment_id"),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table("comment")
    op.drop_table("post")
    op.drop_table("recipe_save")
    op.drop_table("recipe_step")
    op.drop_table("recipe_ingredient")
    op.drop_table("user_ingredient")
    op.drop_table("recipe")
    op.drop_table("user")
