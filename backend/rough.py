from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional, List
import uuid

# Database Configuration
DATABASE_URL = "postgresql://username:password@localhost/ecommerce_db"
# For development, you can use: "postgresql://postgres:password@localhost/ecommerce_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Security Configuration
SECRET_KEY = "your-secret-key-change-in-production-123456789"  # Change this in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# FastAPI App
app = FastAPI(
    title="E-commerce Dashboard API",
    description="Backend API for E-commerce Dashboard with user authentication and business metrics",
    version="1.0.0"
)

# CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    phone_number = Column(String(20), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    dashboard = relationship("Dashboard", back_populates="user", uselist=False)
    withdrawals = relationship("Withdrawal", back_populates="user")

class Dashboard(Base):
    __tablename__ = "dashboards"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    balance = Column(Float, default=0.0)
    products_sold = Column(Integer, default=0)
    profit = Column(Float, default=0.0)
    total_revenue = Column(Float, default=0.0)
    total_orders = Column(Integer, default=0)
    total_sales = Column(Float, default=0.0)
    profit_forecast = Column(Float, default=0.0)
    shop_followers = Column(Integer, default=0)
    shop_rating = Column(Float, default=0.0)
    credit_score = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    user = relationship("User", back_populates="dashboard")

class Withdrawal(Base):
    __tablename__ = "withdrawals"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    method = Column(String(20), nullable=False)  # easypaisa, jazzcash
    phone_number = Column(String(20), nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String(5), default="PKR")
    status = Column(String(20), default="pending")  # pending, completed, failed, cancelled
    transaction_id = Column(String(50), unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    processed_at = Column(DateTime, nullable=True)
    
    # Relationship
    user = relationship("User", back_populates="withdrawals")

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic Models for API
class UserSignup(BaseModel):
    username: str
    email: EmailStr
    phone_number: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    expires_in: int

class UserInfo(BaseModel):
    id: int
    username: str
    email: str
    phone_number: str
    created_at: datetime

class DashboardData(BaseModel):
    balance: float
    products_sold: int
    profit: float
    total_revenue: float
    total_orders: int
    total_sales: float
    profit_forecast: float
    shop_followers: int
    shop_rating: float
    credit_score: int
    updated_at: datetime

class WithdrawalRequest(BaseModel):
    method: str  # easypaisa or jazzcash
    phone_number: str
    amount: float
    currency: str = "PKR"

class WithdrawalResponse(BaseModel):
    id: int
    method: str
    phone_number: str
    amount: float
    currency: str
    status: str
    transaction_id: str
    created_at: datetime

class APIResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None

# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Utility Functions
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def authenticate_user(db: Session, username: str, password: str):
    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(password, user.hashed_password):
        return False
    return user

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security), 
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(credentials.token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

def generate_transaction_id():
    return f"TXN{datetime.now().strftime('%Y%m%d%H%M%S')}{str(uuid.uuid4())[:8].upper()}"

# API Routes

@app.get("/")
async def root():
    return {
        "message": "E-commerce Dashboard API",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "signup": "/auth/signup",
            "login": "/auth/login",
            "dashboard": "/dashboard",
            "withdraw": "/withdraw"
        }
    }

# Authentication Routes
@app.post("/auth/signup", response_model=APIResponse)
async def signup(user_data: UserSignup, db: Session = Depends(get_db)):
    # Check if username or email already exists
    existing_user = db.query(User).filter(
        (User.username == user_data.username) | (User.email == user_data.email)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username or email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        username=user_data.username,
        email=user_data.email,
        phone_number=user_data.phone_number,
        hashed_password=hashed_password
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create dashboard for the new user
    dashboard = Dashboard(user_id=db_user.id)
    db.add(dashboard)
    db.commit()
    
    return APIResponse(
        success=True,
        message="User registered successfully",
        data={"user_id": db_user.id, "username": db_user.username}
    )

@app.post("/auth/login", response_model=Token)
async def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, login_data.username, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, 
        expires_delta=access_token_expires
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

# User Profile Route
@app.get("/auth/me", response_model=UserInfo)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return UserInfo(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        phone_number=current_user.phone_number,
        created_at=current_user.created_at
    )

# Dashboard Routes
@app.get("/dashboard", response_model=DashboardData)
async def get_dashboard(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    dashboard = db.query(Dashboard).filter(Dashboard.user_id == current_user.id).first()
    
    if not dashboard:
        # Create dashboard if it doesn't exist
        dashboard = Dashboard(user_id=current_user.id)
        db.add(dashboard)
        db.commit()
        db.refresh(dashboard)
    
    return DashboardData(
        balance=dashboard.balance,
        products_sold=dashboard.products_sold,
        profit=dashboard.profit,
        total_revenue=dashboard.total_revenue,
        total_orders=dashboard.total_orders,
        total_sales=dashboard.total_sales,
        profit_forecast=dashboard.profit_forecast,
        shop_followers=dashboard.shop_followers,
        shop_rating=dashboard.shop_rating,
        credit_score=dashboard.credit_score,
        updated_at=dashboard.updated_at
    )

@app.put("/dashboard/update", response_model=APIResponse)
async def update_dashboard(
    balance: Optional[float] = None,
    products_sold: Optional[int] = None,
    profit: Optional[float] = None,
    total_revenue: Optional[float] = None,
    total_orders: Optional[int] = None,
    total_sales: Optional[float] = None,
    profit_forecast: Optional[float] = None,
    shop_followers: Optional[int] = None,
    shop_rating: Optional[float] = None,
    credit_score: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    dashboard = db.query(Dashboard).filter(Dashboard.user_id == current_user.id).first()
    
    if not dashboard:
        dashboard = Dashboard(user_id=current_user.id)
        db.add(dashboard)
    
    # Update only provided fields
    if balance is not None:
        dashboard.balance = balance
    if products_sold is not None:
        dashboard.products_sold = products_sold
    if profit is not None:
        dashboard.profit = profit
    if total_revenue is not None:
        dashboard.total_revenue = total_revenue
    if total_orders is not None:
        dashboard.total_orders = total_orders
    if total_sales is not None:
        dashboard.total_sales = total_sales
    if profit_forecast is not None:
        dashboard.profit_forecast = profit_forecast
    if shop_followers is not None:
        dashboard.shop_followers = shop_followers
    if shop_rating is not None:
        dashboard.shop_rating = max(0.0, min(5.0, shop_rating))  # Ensure rating is between 0-5
    if credit_score is not None:
        dashboard.credit_score = max(0, min(850, credit_score))  # Ensure credit score is between 0-850
    
    dashboard.updated_at = datetime.utcnow()
    db.commit()
    
    return APIResponse(
        success=True,
        message="Dashboard updated successfully"
    )

# Withdrawal Routes
@app.post("/withdraw", response_model=WithdrawalResponse)
async def create_withdrawal(
    withdrawal_data: WithdrawalRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Validate withdrawal method
    if withdrawal_data.method.lower() not in ["easypaisa", "jazzcash"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid withdrawal method. Use 'easypaisa' or 'jazzcash'"
        )
    
    # Validate amount
    if withdrawal_data.amount <= 0:
        raise HTTPException(
            status_code=400,
            detail="Withdrawal amount must be greater than 0"
        )
    
    # Check user balance
    dashboard = db.query(Dashboard).filter(Dashboard.user_id == current_user.id).first()
    if not dashboard or dashboard.balance < withdrawal_data.amount:
        raise HTTPException(
            status_code=400,
            detail="Insufficient balance for withdrawal"
        )
    
    # Create withdrawal record
    transaction_id = generate_transaction_id()
    withdrawal = Withdrawal(
        user_id=current_user.id,
        method=withdrawal_data.method.lower(),
        phone_number=withdrawal_data.phone_number,
        amount=withdrawal_data.amount,
        currency=withdrawal_data.currency.upper(),
        transaction_id=transaction_id
    )
    
    db.add(withdrawal)
    
    # Update user balance
    dashboard.balance -= withdrawal_data.amount
    dashboard.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(withdrawal)
    
    return WithdrawalResponse(
        id=withdrawal.id,
        method=withdrawal.method,
        phone_number=withdrawal.phone_number,
        amount=withdrawal.amount,
        currency=withdrawal.currency,
        status=withdrawal.status,
        transaction_id=withdrawal.transaction_id,
        created_at=withdrawal.created_at
    )

@app.get("/withdraw/history", response_model=List[WithdrawalResponse])
async def get_withdrawal_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    withdrawals = db.query(Withdrawal).filter(
        Withdrawal.user_id == current_user.id
    ).order_by(Withdrawal.created_at.desc()).all()
    
    return [
        WithdrawalResponse(
            id=w.id,
            method=w.method,
            phone_number=w.phone_number,
            amount=w.amount,
            currency=w.currency,
            status=w.status,
            transaction_id=w.transaction_id,
            created_at=w.created_at
        ) for w in withdrawals
    ]

@app.get("/withdraw/{withdrawal_id}", response_model=WithdrawalResponse)
async def get_withdrawal_details(
    withdrawal_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    withdrawal = db.query(Withdrawal).filter(
        Withdrawal.id == withdrawal_id,
        Withdrawal.user_id == current_user.id
    ).first()
    
    if not withdrawal:
        raise HTTPException(status_code=404, detail="Withdrawal not found")
    
    return WithdrawalResponse(
        id=withdrawal.id,
        method=withdrawal.method,
        phone_number=withdrawal.phone_number,
        amount=withdrawal.amount,
        currency=withdrawal.currency,
        status=withdrawal.status,
        transaction_id=withdrawal.transaction_id,
        created_at=withdrawal.created_at
    )

# Health Check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)