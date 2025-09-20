from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URI = "mongodb+srv://sahil5661:sahil1234@cluster0.ezqeu4d.mongodb.net/"
client = AsyncIOMotorClient(MONGO_URI)

db = client["login"]           
users_collection = db["users"]    