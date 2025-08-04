from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class UserSignup(BaseModel):
    username: str
    email: EmailStr
    phone_number: str
    password: str


class UserLogin(BaseModel):
    email: str
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