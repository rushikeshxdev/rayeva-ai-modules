"""
Seed script to populate the database with test Order data.

This script creates 5 dummy Order records with realistic data for testing
the WhatsApp bot order status queries. The script is idempotent - it can be
run multiple times without creating duplicate records.

Usage:
    python seed_data.py
"""

import sys
import os
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import Order


def main():
    """
    Main function to seed the database with 5 dummy Order records.
    
    Creates orders with realistic data including:
    - Order numbers in format ORD-XXXXX
    - Indian customer names
    - Phone numbers in E.164 format (+91...)
    - Various order statuses (pending, shipped, delivered)
    - Sustainable product names fitting Rayeva's brand
    - Realistic quantities and amounts
    
    The function checks for existing orders before inserting to prevent duplicates.
    """
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    # Get database session
    db = SessionLocal()
    
    try:
        # Define 5 dummy orders with realistic data
        dummy_orders = [
            {
                "order_number": "ORD-12345",
                "customer_name": "Priya Sharma",
                "customer_phone": "+919876543210",
                "status": "delivered",
                "total_amount": 1299.00,
                "product_name": "Bamboo Toothbrush Set (Pack of 4)",
                "quantity": 2
            },
            {
                "order_number": "ORD-12346",
                "customer_name": "Rajesh Kumar",
                "customer_phone": "+919876543211",
                "status": "shipped",
                "total_amount": 2499.00,
                "product_name": "Organic Cotton Tote Bag",
                "quantity": 5
            },
            {
                "order_number": "ORD-12347",
                "customer_name": "Ananya Patel",
                "customer_phone": "+919876543212",
                "status": "pending",
                "total_amount": 899.00,
                "product_name": "Reusable Stainless Steel Water Bottle",
                "quantity": 1
            },
            {
                "order_number": "ORD-12348",
                "customer_name": "Vikram Singh",
                "customer_phone": "+919876543213",
                "status": "delivered",
                "total_amount": 3599.00,
                "product_name": "Eco-Friendly Jute Yoga Mat",
                "quantity": 3
            },
            {
                "order_number": "ORD-12349",
                "customer_name": "Meera Reddy",
                "customer_phone": "+919876543214",
                "status": "shipped",
                "total_amount": 1799.00,
                "product_name": "Biodegradable Bamboo Cutlery Set",
                "quantity": 4
            }
        ]
        
        # Insert orders, checking for duplicates
        for order_data in dummy_orders:
            # Check if order already exists
            existing = db.query(Order).filter(
                Order.order_number == order_data["order_number"]
            ).first()
            
            if existing:
                print(f"⏭️  Skipping {order_data['order_number']} - already exists")
            else:
                # Create new order
                new_order = Order(**order_data)
                db.add(new_order)
                db.commit()
                print(f"✅ Created order {order_data['order_number']} for {order_data['customer_name']}")
        
        print("\n🎉 Seed script completed successfully!")
        
    except Exception as e:
        print(f"❌ Error seeding database: {str(e)}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    main()
