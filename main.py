from fastapi import FastAPI, Depends, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from sqlalchemy.orm import Session
from pydantic import BaseModel
import json

from database import engine, get_db, Base
from models import ProductTag, AILog, B2BProposal, ImpactReport, Order, WhatsAppLog, EscalationLog
from modules.module1_tagger import tag_product
from modules.module2_proposal import generate_proposal
from modules.module3_impact import generate_impact_report
from modules.module4_whatsapp import handle_whatsapp_message

# Create all database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Rayeva AI System",
    description="AI-powered modules for sustainable commerce",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://rayeva-ai-modules.vercel.app",  # Your Vercel URL
        "https://*.vercel.app",  # All Vercel preview URLs
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Request body schema ---
class ProductInput(BaseModel):
    product_name: str
    product_description: str


# --- Module 2: Pydantic request models ---
class ProposalInput(BaseModel):
    client_name: str
    industry: str
    budget: float
    num_employees: int
    preferences: list[str] = []


# --- Module 3: Pydantic request models ---
class ProductInputModule3(BaseModel):
    name: str
    quantity: int
    weight_grams: float
    is_plastic_free: bool
    is_local: bool
    is_organic: bool
    is_compostable: bool


class ImpactReportInput(BaseModel):
    order_id: int
    products: list[ProductInputModule3]


# --- Health check route ---
@app.get("/")
def root():
    return {"message": "Rayeva AI System is running! 🌱"}


# --- Module 1: Tag a product ---
@app.post("/api/categorize-product")
def categorize_product(product: ProductInput, db: Session = Depends(get_db)):
    """
    Send a product name + description, get back AI-generated
    category, tags, and sustainability filters
    """

    # Call our AI tagger
    result = tag_product(product.product_name, product.product_description)

    # Log every AI call to database
    log = AILog(
        module_name="module1_tagger",
        prompt_sent=result.get("prompt_used", ""),
        response_received=result.get("raw_response", ""),
        success=1 if result["success"] else 0
    )
    db.add(log)
    db.commit()

    # If AI failed, return error
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["error"])

    ai_data = result["data"]

    # Save product tags to database
    product_tag = ProductTag(
        product_name=product.product_name,
        product_description=product.product_description,
        category=ai_data.get("category"),
        sub_category=ai_data.get("sub_category"),
        seo_tags=", ".join(ai_data.get("seo_tags", [])),
        sustainability_filters=", ".join(ai_data.get("sustainability_filters", [])),
        confidence_score=ai_data.get("confidence_score"),
        ai_prompt_used=result.get("prompt_used", ""),
        ai_raw_response=result.get("raw_response", "")
    )
    db.add(product_tag)
    db.commit()
    db.refresh(product_tag)

    # Return clean response
    return {
        "message": "Product tagged successfully!",
        "product_id": product_tag.id,
        "product_name": product.product_name,
        "ai_result": ai_data
    }


# --- Get all tagged products ---
@app.get("/api/products")
def get_all_products(db: Session = Depends(get_db)):
    products = db.query(ProductTag).all()
    return {"total": len(products), "products": products}



# --- Module 2: B2B Proposal Generator ---
@app.post("/api/generate-proposal")
def create_proposal(proposal: ProposalInput, db: Session = Depends(get_db)):
    """
    Generate a B2B bulk purchase proposal for corporate clients.
    
    Args:
        proposal: ProposalInput with client details and preferences
        db: Database session
        
    Returns:
        dict: Proposal ID and generated proposal data
        
    Raises:
        HTTPException: On AI processing errors or database errors
    """
    try:
        # Call module function
        result = generate_proposal(
            proposal.client_name,
            proposal.industry,
            proposal.budget,
            proposal.num_employees,
            proposal.preferences
        )
        
        # Log AI call
        log = AILog(
            module_name="module2_proposal",
            prompt_sent=result.get("prompt_used", ""),
            response_received=result.get("raw_response", ""),
            success=1 if result["success"] else 0
        )
        db.add(log)
        db.commit()
        
        # Check for errors
        if not result["success"]:
            raise HTTPException(status_code=500, detail=result["error"])
        
        # Save to database - convert preferences list to comma-separated string
        proposal_record = B2BProposal(
            client_name=proposal.client_name,
            industry=proposal.industry,
            budget=proposal.budget,
            num_employees=proposal.num_employees,
            preferences=", ".join(proposal.preferences) if proposal.preferences else "",
            recommended_products=json.dumps(result["data"].get("recommended_products", [])),
            impact_summary=result["data"].get("impact_summary", ""),
            total_cost=result["data"].get("total_cost", 0.0),
            budget_utilization_percent=result["data"].get("budget_utilization_percent", 0.0),
            impact_positioning=result["data"].get("impact_positioning", ""),
            ai_prompt_used=result["prompt_used"],
            ai_raw_response=result["raw_response"]
        )
        db.add(proposal_record)
        db.commit()
        db.refresh(proposal_record)
        
        return {
            "message": "Proposal generated successfully",
            "proposal_id": proposal_record.id,
            "data": result["data"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/proposals")
def get_proposals(db: Session = Depends(get_db)):
    """
    Retrieve all B2B proposals from the database.
    
    Args:
        db: Database session
        
    Returns:
        dict: Total count and list of proposals
    """
    proposals = db.query(B2BProposal).all()
    return {"total": len(proposals), "proposals": proposals}


# --- Module 3: Environmental Impact Report Generator ---
@app.post("/api/generate-impact-report")
def create_impact_report(report: ImpactReportInput, db: Session = Depends(get_db)):
    """
    Generate an environmental impact report for a customer order.
    
    Args:
        report: ImpactReportInput with order ID and product details
        db: Database session
        
    Returns:
        dict: Report ID and generated impact data
        
    Raises:
        HTTPException: On AI processing errors or database errors
    """
    try:
        # Convert Pydantic models to dicts
        products_list = [p.dict() for p in report.products]
        
        # Call module function
        result = generate_impact_report(report.order_id, products_list)
        
        # Log AI call
        log = AILog(
            module_name="module3_impact",
            prompt_sent=result.get("prompt_used", ""),
            response_received=result.get("raw_response", ""),
            success=1 if result["success"] else 0
        )
        db.add(log)
        db.commit()
        
        # Check for errors
        if not result["success"]:
            raise HTTPException(status_code=500, detail=result["error"])
        
        # Save to database
        product_names = ", ".join([p["name"] for p in products_list])
        impact_record = ImpactReport(
            order_id=report.order_id,
            product_names=product_names,
            plastic_saved_grams=result["data"].get("plastic_saved_grams", 0.0),
            carbon_avoided_kg=result["data"].get("carbon_avoided_kg", 0.0),
            local_sourcing_percent=result["data"].get("local_sourcing_percent", 0.0),
            impact_statement=result["data"].get("impact_statement", ""),
            ai_prompt_used=result["prompt_used"],
            ai_raw_response=result["raw_response"]
        )
        db.add(impact_record)
        db.commit()
        db.refresh(impact_record)
        
        return {
            "message": "Impact report generated successfully",
            "report_id": impact_record.id,
            "data": result["data"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/impact-reports")
def get_impact_reports(db: Session = Depends(get_db)):
    """
    Retrieve all environmental impact reports from the database.
    
    Args:
        db: Database session
        
    Returns:
        dict: Total count and list of impact reports
    """
    reports = db.query(ImpactReport).all()
    return {"total": len(reports), "reports": reports}


# --- Module 4: WhatsApp Chatbot ---
@app.post("/api/whatsapp/webhook")
def whatsapp_webhook(
    From: str = Form(...),
    Body: str = Form(...),
    db: Session = Depends(get_db)
):
    """
    Handle incoming WhatsApp messages from Twilio webhook.
    
    Args:
        From: Customer's phone number (E.164 format)
        Body: Message text from customer
        db: Database session
        
    Returns:
        Response: TwiML XML response for Twilio
    """
    try:
        # Call module function
        result = handle_whatsapp_message(From, Body, db)
        
        # Log AI call (if AI was used)
        if result.get("prompt_used"):
            log = AILog(
                module_name="module4_whatsapp",
                prompt_sent=result.get("prompt_used", ""),
                response_received=result.get("raw_response", ""),
                success=1 if result["success"] else 0
            )
            db.add(log)
            db.commit()
        
        # Log WhatsApp interaction
        whatsapp_log = WhatsAppLog(
            customer_phone=From,
            message_received=Body,
            intent_detected=result.get("intent", ""),
            response_sent=result.get("response_text", "")
        )
        db.add(whatsapp_log)
        db.commit()
        
        # Return TwiML XML response
        return Response(content=result["twiml"], media_type="application/xml")
        
    except Exception as e:
        # Return error TwiML on failure
        error_twiml = '<?xml version="1.0" encoding="UTF-8"?><Response><Message>We\'re experiencing technical difficulties. Please try again later.</Message></Response>'
        return Response(content=error_twiml, media_type="application/xml")


@app.get("/api/whatsapp/logs")
def get_whatsapp_logs(db: Session = Depends(get_db)):
    """
    Retrieve recent WhatsApp conversation logs.
    
    Args:
        db: Database session
        
    Returns:
        dict: Total count and list of recent WhatsApp logs (last 50)
    """
    logs = db.query(WhatsAppLog).order_by(WhatsAppLog.created_at.desc()).limit(50).all()
    return {"total": len(logs), "logs": logs}


@app.get("/api/escalations")
def get_escalations(db: Session = Depends(get_db)):
    """
    Retrieve all customer escalation records.
    
    Args:
        db: Database session
        
    Returns:
        dict: Total count and list of escalation logs
    """
    escalations = db.query(EscalationLog).order_by(EscalationLog.created_at.desc()).all()
    return {"total": len(escalations), "escalations": escalations}
