from pwdlib import PasswordHash


password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    """평문 비밀번호를 해시하여 반환한다."""
    return password_hash.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    """평문 비밀번호와 해시값을 비교하여 일치 여부를 반환한다."""
    return password_hash.verify(password, hashed_password)
