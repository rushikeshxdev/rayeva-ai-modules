"""
Module 4: WhatsApp Chatbot

Handles customer service queries via Twilio WhatsApp webhook
with automatic fallback from Gemini to Groq.
"""

import re
from ai_client import generate_content
from sqlalchemy.orm import Session

# Predefined return policy
RETURN_POLICY = """Our return policy:
- 30-day return window for unused items
- Free return shipping for defective products
- Refunds processed within 5-7 business days
- Contact support@rayeva.com for returns"""


def detect_intent(message_text: str) -> str:
    """Detects the intent of a customer message using AI with fallback."""
    prompt = f"""You are an intent classifier for a customer service chatbot.
Classify this message into exactly one category: order_status, return_policy, refund_escalation, or general.

Message: "{message_text}"

Return only the category name, nothing else."""
    
    ai_response = generate_content(prompt, temperature=0.3, max_tokens=50, response_format="text")
    
    if ai_response["success"]:
        intent = ai_response["text"].strip().lower()
        valid_intents = ["order_status", "return_policy", "refund_escalation", "general"]
        return intent if intent in valid_intents else "general"
    
    return "general"  # Default if AI fails


def handle_order_status(message_text: str, db_session: Session) -> str:
    """Handles order status queries by extracting order number and querying database."""
    from models import Order
    
    # Extract order number using regex
    order_pattern = r'(?:ORD-)?(\d{5})'
    match = re.search(order_pattern, message_text, re.IGNORECASE)
    
    if not match:
        return "I couldn't find an order number in your message. Please provide your order number (e.g., ORD-12345)."
    
    order_number = match.group(0).upper()
    if not order_number.startswith("ORD-"):
        order_number = f"ORD-{order_number}"
    
    # Query database for order
    order = db_session.query(Order).filter(Order.order_number == order_number).first()
    
    if not order:
        return f"Order {order_number} not found. Please check the order number and try again."
    
    # Format response with order details
    status_messages = {
        "pending": "is being processed",
        "shipped": "has been shipped and is on its way",
        "delivered": "has been delivered"
    }
    
    status_text = status_messages.get(order.status, order.status)
    return f"Your order {order.order_number} {status_text}! You ordered {order.quantity}x {order.product_name}. Total: ₹{order.total_amount:,.2f}. Thank you for choosing sustainable products! 🌱"


def handle_refund_escalation(customer_phone: str, message_text: str, db_session: Session) -> str:
    """Handles refund escalation by logging to database."""
    from models import EscalationLog
    
    escalation = EscalationLog(
        customer_phone=customer_phone,
        issue_description=message_text,
        status="pending"
    )
    db_session.add(escalation)
    db_session.commit()
    
    return "We understand your concern. A customer service representative will contact you within 24 hours. Thank you for your patience."


def handle_general_query(message_text: str) -> str:
    """Handles general queries using AI with fallback."""
    prompt = f"""You are a helpful customer service agent for Rayeva, a sustainable products company.
Answer this customer question in a friendly, concise way (2-3 sentences).

Question: "{message_text}"

Focus on sustainability, eco-friendly products, and conscious consumerism."""
    
    ai_response = generate_content(prompt, temperature=0.3, max_tokens=300, response_format="text")
    
    if ai_response["success"]:
        return ai_response["text"].strip()
    
    return "Thank you for your message. Our team will assist you shortly."


def format_twiml(message: str) -> str:
    """Formats a message as TwiML XML for Twilio WhatsApp response."""
    message = message.replace("&", "&").replace("<", "<").replace(">", ">")
    return f'<?xml version="1.0" encoding="UTF-8"?><Response><Message>{message}</Message></Response>'


def handle_whatsapp_message(customer_phone: str, message_text: str, db_session: Session) -> dict:
    """
    Main orchestrator function that processes WhatsApp messages with AI fallback.
    
    Returns:
        dict: {
            "success": bool,
            "intent": str,
            "response_text": str,
            "twiml": str,
            "prompt_used": str,
            "raw_response": str
        }
    """
    try:
        # Detect intent
        intent = detect_intent(message_text)
        
        # Route to appropriate handler
        if intent == "order_status":
            response_text = handle_order_status(message_text, db_session)
        elif intent == "return_policy":
            response_text = RETURN_POLICY.strip()
        elif intent == "refund_escalation":
            response_text = handle_refund_escalation(customer_phone, message_text, db_session)
        else:  # general
            response_text = handle_general_query(message_text)
        
        # Format as TwiML
        twiml = format_twiml(response_text)
        
        return {
            "success": True,
            "intent": intent,
            "response_text": response_text,
            "twiml": twiml,
            "prompt_used": f"Intent detection for: {message_text}",
            "raw_response": response_text
        }
        
    except Exception as e:
        error_message = "We're experiencing technical difficulties. Please try again later or contact support@rayeva.com."
        return {
            "success": False,
            "intent": "error",
            "response_text": error_message,
            "twiml": format_twiml(error_message),
            "prompt_used": "",
            "raw_response": str(e)
        }
