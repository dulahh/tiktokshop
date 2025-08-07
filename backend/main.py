from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional, List
from utils.pydantic import UserSignup, UserLogin, APIResponse, Token, UserInfo, DashboardData, WithdrawalRequest, WithdrawalResponse, OrderResponse
from utils.util import get_db, get_current_user, create_access_token, authenticate_user, generate_transaction_id, get_password_hash
from models.model import User, Dashboard, Withdrawal, Order
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables from .env file

app = FastAPI()

secret_key = os.getenv("SECRET_KEY")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
            "withdraw": "/withdraw",
            "order": "/order"
        }
    }

# Authentication Routes
@app.post("/auth/signup", response_model=APIResponse)
async def signup(user_data: UserSignup, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(
        (User.username == user_data.username) | (User.email == user_data.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username or email already registered"
        )

    # Store password as plain text — for testing only
    db_user = User(
        username=user_data.username,
        email=user_data.email,
        phone_number=user_data.phone_number,
        hashed_password=user_data.password  # <-- Not hashed!
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Create dashboard entry
    dashboard = Dashboard(user_id=db_user.id)
    db.add(dashboard)
    db.commit()

    return APIResponse(
        success=True,
        message="User registered (with plain password)",
        data={"user_id": db_user.id, "username": db_user.username}
    )

@app.post("/auth/login", response_model=Token)
async def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()

    # Compare plain password directly (only for testing!)
    if not user or user.hashed_password != login_data.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=1440)
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires
    )

    return Token(
        access_token=access_token,
        token_type="bearer",
        expires_in=1440 * 60
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

@app.get("/order", response_model=List[OrderResponse])
@app.get("/orders", response_model=List[OrderResponse])
def get_my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Order).filter(Order.user_id == current_user.id).all()