from fastapi import FastAPI
from auth.routes import auth_router

app = FastAPI(title="Elevate - Auth API")

app.include_router(auth_router)

@app.get("/")
def root():
    return {"message": "Auth API running"}