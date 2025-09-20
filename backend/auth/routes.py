from fastapi import APIRouter, HTTPException
from .utils import hash_password, verify_password, create_access_token
from models.user import UserCreate, UserLogin
from database import users_collection

auth_router = APIRouter(prefix="/auth", tags=["Auth"])

@auth_router.post("/signup")
async def signup(user: UserCreate):
    existing = await users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = hash_password(user.password)
    new_user = {"fullname": user.fullname, "email": user.email, "password": hashed_pw}
    await users_collection.insert_one(new_user)
    return {"message": "User created successfully"}

@auth_router.post("/signin")
async def signin(user: UserLogin):
    existing = await users_collection.find_one({"email": user.email})
    if not existing or not verify_password(user.password, existing["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}