"""add image_url to recipe table

Revision ID: 20260601_0001
Revises: 20260527_0002
Create Date: 2026-06-01

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "20260601_0001"
down_revision: Union[str, Sequence[str], None] = "20260527_0002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("recipe", sa.Column("image_url", sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column("recipe", "image_url")
