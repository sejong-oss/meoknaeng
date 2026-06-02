from pwdlib import PasswordHash


# 해싱 정책을 service 계층에 모아 라우터가 pwdlib 세부 구현에 의존하지 않도록 한다.
password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    """회원가입 시 평문 비밀번호를 저장용 해시 문자열로 변환한다."""
    return password_hash.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    """로그인 시 입력 비밀번호와 DB에 저장된 해시 문자열을 비교한다."""
    return password_hash.verify(password, hashed_password)
