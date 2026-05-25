"""remove post comment_count column

Revision ID: 20260525_0001
Revises: 20260519_0001
Create Date: 2026-05-25

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "20260525_0001"
down_revision: Union[str, Sequence[str], None] = "20260519_0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_column("post", "comment_count")


def downgrade() -> None:
    op.add_column(
        "post",
        sa.Column("comment_count", sa.Integer(), nullable=False, server_default="0"),
    )
