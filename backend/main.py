from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException, Header, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from datetime import datetime, timedelta
from jose import jwt
import bcrypt

from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base

app = FastAPI(title="FarmLink AI API")

SECRET_KEY = "farmlink-ai-development-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

security = HTTPBearer()

DATABASE_URL = "sqlite:///./farmlink.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)
Base = declarative_base()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    authorization = "Bearer " + credentials.credentials

    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authentication required"
        )

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication format"
        )

    token = authorization.split(" ", 1)[1]

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("user_id")

        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication token"
            )

        return user_id

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

from sqlalchemy import Column, Integer, String

class Produce(Base):
    __tablename__ = "produce"

    id = Column(Integer, primary_key=True, index=True)
    crop = Column(String)
    quantity = Column(String)
    quality = Column(String)
    location = Column(String)
    harvest_date = Column(String)
    expected_price = Column(String)
    user_id = Column(Integer)

class MarketPrice(Base):
    __tablename__ = "market_prices"

    id = Column(Integer, primary_key=True, index=True)
    crop = Column(String)
    location = Column(String)
    market = Column(String)
    price_per_kg = Column(String)
    date = Column(String)

class MandiPrice(Base):
    __tablename__ = "mandi_prices"

    id = Column(Integer, primary_key=True, index=True)
    report_date = Column(String)
    commodity = Column(String)
    market = Column(String)
    variety = Column(String)
    arrivals = Column(String)
    arrival_unit = Column(String)
    min_price = Column(String)
    max_price = Column(String)
    modal_price = Column(String)
    price_unit = Column(String)
    source = Column(String)   

class BuyerInterest(Base):
    __tablename__ = "buyer_interests"

    id = Column(Integer, primary_key=True, index=True)
    buyer_id = Column(Integer)
    farmer_id = Column(Integer)
    produce_id = Column(Integer)
    status = Column(String, default="pending")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String)

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str


class LoginRequest(BaseModel):
    email: str
    password: str

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://farmlink-ai-1-m4bk.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "FarmLink AI backend is running!"
    }

@app.post("/register")
def register_user(user: RegisterRequest):
    db = SessionLocal()

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        db.close()
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    password_hash = bcrypt.hashpw(
        user.password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=password_hash,
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    db.close()

    return {
        "message": "Account created successfully",
        "user_id": new_user.id,
        "name": new_user.name,
        "email": new_user.email,
        "role": new_user.role
    }

@app.post("/login")
def login_user(user: LoginRequest):
    db = SessionLocal()

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not existing_user:
        db.close()
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    password_matches = bcrypt.checkpw(
        user.password.encode("utf-8"),
        existing_user.password_hash.encode("utf-8")
    )

    if not password_matches:
        db.close()
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token_data = {
        "user_id": existing_user.id,
        "role": existing_user.role,
        "exp": datetime.utcnow() + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
    }

    access_token = jwt.encode(
        token_data,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    db.close()

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": existing_user.id,
            "name": existing_user.name,
            "email": existing_user.email,
            "role": existing_user.role
        }
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    } 

@app.post("/produce")
def add_produce(
    produce: dict,
    current_user: int = Depends(get_current_user)
):
    db = SessionLocal()

    new_produce = Produce(
        crop=produce.get("crop", ""),
        quantity=produce.get("quantity", ""),
        quality=produce.get("quality", ""),
        location=produce.get("location", ""),
        harvest_date=produce.get("harvestDate", ""),
        expected_price=produce.get("expectedPrice", ""),
        user_id=current_user
    )

    db.add(new_produce)
    db.commit()
    db.refresh(new_produce)
    db.close()

    return {
        "message": "Produce saved successfully",
        "id": new_produce.id,
        "produce": {
            "crop": new_produce.crop,
            "quantity": new_produce.quantity,
            "quality": new_produce.quality,
            "location": new_produce.location,
            "harvestDate": new_produce.harvest_date,
            "expectedPrice": new_produce.expected_price
        }
    }

@app.get("/produce")
def get_produce():
    db = SessionLocal()

    records = db.query(Produce).all()

    result = []

    for item in records:
        result.append({
            "id": item.id,
            "crop": item.crop,
            "quantity": item.quantity,
            "quality": item.quality,
            "location": item.location,
            "harvest_date": item.harvest_date,
            "expected_price": item.expected_price
        })

    db.close()

    return result   

@app.get("/my-produce")
def get_my_produce(current_user: int = Depends(get_current_user)):
    db = SessionLocal()

    records = db.query(Produce).filter(
        Produce.user_id == current_user
    ).all()

    result = []

    for item in records:
        result.append({
            "id": item.id,
            "crop": item.crop,
            "quantity": item.quantity,
            "quality": item.quality,
            "location": item.location,
            "harvest_date": item.harvest_date,
            "expected_price": item.expected_price
        })

    db.close()

    return result 


@app.post("/interests")
def send_interest(
    interest: dict,
    current_user: int = Depends(get_current_user)
):
    db = SessionLocal()

    produce_id = interest.get("produce_id")

    produce = db.query(Produce).filter(
        Produce.id == produce_id
    ).first()

    if not produce:
        db.close()
        raise HTTPException(
            status_code=404,
            detail="Produce not found"
        )

    new_interest = BuyerInterest(
        buyer_id=current_user,
        farmer_id=produce.user_id,
        produce_id=produce.id,
        status="pending"
    )

    db.add(new_interest)
    db.commit()
    db.refresh(new_interest)
    db.close()

    return {
        "message": "Interest sent successfully",
        "interest_id": new_interest.id,
        "status": new_interest.status
    }

@app.get("/my-interests")
def get_my_interests(current_user: int = Depends(get_current_user)):
    db = SessionLocal()

    interests = db.query(BuyerInterest).filter(
        BuyerInterest.farmer_id == current_user
    ).all()

    result = []

    for interest in interests:
        produce = db.query(Produce).filter(
            Produce.id == interest.produce_id
        ).first()

        buyer = db.query(User).filter(
            User.id == interest.buyer_id
        ).first()

        if produce:
            result.append({
                "id": interest.id,
                "produce_id": interest.produce_id,
                "buyer_id": interest.buyer_id,
                "buyer_name": buyer.name if buyer else "Unknown Buyer",
                "crop": produce.crop,
                "quantity": produce.quantity,
                "location": produce.location,
                "status": interest.status
            })

    db.close()

    return result

@app.post("/market-price")
def add_market_price(data: dict):
    db = SessionLocal()

    new_price = MarketPrice(
        crop=data.get("crop", ""),
        location=data.get("location", ""),
        market=data.get("market", ""),
        price_per_kg=data.get("price_per_kg", ""),
        date=data.get("date", "")
    )

    db.add(new_price)
    db.commit()
    db.refresh(new_price)
    db.close()

    return {
        "message": "Market price saved successfully",
        "id": new_price.id
    }

@app.get("/market-price")
def get_market_prices():
    db = SessionLocal()

    records = db.query(MarketPrice).all()

    result = []

    for item in records:
        result.append({
            "id": item.id,
            "crop": item.crop,
            "location": item.location,
            "market": item.market,
            "price_per_kg": item.price_per_kg,
            "date": item.date
        })

    db.close()

    return result   

@app.get("/predict-price/{crop}")
def predict_price(crop: str):
    db = SessionLocal()

    records = db.query(MandiPrice).filter(
        MandiPrice.commodity.ilike(crop)
    ).all()

    db.close()

    if not records:
        return {
            "message": "No mandi price data found",
            "crop": crop
        }

    modal_prices = []
    min_prices = []
    max_prices = []

    for item in records:
        try:
            modal_prices.append(float(item.modal_price))
            min_prices.append(float(item.min_price))
            max_prices.append(float(item.max_price))
        except (ValueError, TypeError):
            continue

    if not modal_prices:
        return {
            "message": "No valid price data found",
            "crop": crop
        }

    average_modal = sum(modal_prices) / len(modal_prices)
    average_min = sum(min_prices) / len(min_prices)
    average_max = sum(max_prices) / len(max_prices)

    return {
        "crop": crop,
        "average_price": round(average_modal / 100, 2),
        "lower_price": round(average_min / 100, 2),
        "upper_price": round(average_max / 100, 2),
        "confidence": (
    "high" if len(modal_prices) >= 10
    else "medium" if len(modal_prices) >= 5
    else "low"),
        "data_points": len(modal_prices),
        "source": "AGMARKNET"
    }

@app.get("/mandi-prices")
def get_mandi_prices():
    db = SessionLocal()

    records = db.query(MandiPrice).all()

    result = []

    for item in records:
        result.append({
            "id": item.id,
            "report_date": item.report_date,
            "commodity": item.commodity,
            "market": item.market,
            "variety": item.variety,
            "arrivals": item.arrivals,
            "arrival_unit": item.arrival_unit,
            "min_price": item.min_price,
            "max_price": item.max_price,
            "modal_price": item.modal_price,
            "price_unit": item.price_unit,
            "source": item.source
        })

    db.close()

    return result   