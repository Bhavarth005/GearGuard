from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.auth.jwt import SECRET_KEY, ALGORITHM

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {
            "user_id": int(payload["sub"]),
            "role": payload["role"]
        }
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
def require_role(*allowed_roles):
    def checker(user=Depends(get_current_user)):
        if user["role"] not in allowed_roles:
            raise HTTPException(status_code=403, detail="Access denied")
        return user
    return checker
