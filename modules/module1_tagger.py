"""
Module 1: Product Categorization & Tagging

Automatically categorizes products and generates SEO tags using AI
with automatic fallback from Gemini to Groq.
"""

import json
from ai_client import generate_content, parse_json_response

CATEGORIES = [
    "Kitchen & Dining", "Personal Care", "Home & Living",
    "Food & Beverages", "Clothing & Accessories", "Office & Stationery",
    "Baby & Kids", "Garden & Outdoor", "Cleaning & Laundry", "Travel & Lifestyle"
]

SUSTAINABILITY_OPTIONS = [
    "plastic-free", "compostable", "biodegradable", "vegan", "recycled",
    "organic", "zero-waste", "handmade", "fair-trade", "locally-sourced"
]


def build_prompt(product_name: str, product_description: str) -> str:
    """Constructs the AI prompt for product categorization."""
    return f"""You are a product categorization expert for an eco-friendly/sustainable products store called Rayeva.

Given the product below, return a structured JSON response.

PRODUCT NAME: {product_name}
PRODUCT DESCRIPTION: {product_description}

AVAILABLE CATEGORIES (pick exactly one):
{json.dumps(CATEGORIES, indent=2)}

AVAILABLE SUSTAINABILITY FILTERS (pick all that apply):
{json.dumps(SUSTAINABILITY_OPTIONS, indent=2)}

INSTRUCTIONS:
1. Pick the best matching primary category from the list above
2. Suggest a sub-category (you can create one that makes sense)
3. Generate 5 to 10 SEO-friendly tags (short keywords people would search)
4. Pick all relevant sustainability filters from the list above
5. Give a confidence score between 0.0 and 1.0

IMPORTANT: Return ONLY valid JSON, no extra text, no markdown, no explanation.

Return this exact format:
{{
  "category": "...",
  "sub_category": "...",
  "seo_tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "sustainability_filters": ["filter1", "filter2"],
  "confidence_score": 0.95
}}"""


def tag_product(product_name: str, product_description: str) -> dict:
    """
    Main function that categorizes and tags a product using AI with fallback.
    
    Returns:
        dict: {
            "success": bool,
            "data": dict (if successful),
            "error": str (if failed),
            "prompt_used": str,
            "raw_response": str,
            "provider": str ("gemini" or "groq")
        }
    """
    prompt = build_prompt(product_name, product_description)
    
    # Call unified AI client (tries Gemini, falls back to Groq)
    ai_response = generate_content(prompt, temperature=0.3, max_tokens=1000, response_format="json")
    
    if not ai_response["success"]:
        return {
            "success": False,
            "error": ai_response["error"],
            "prompt_used": prompt,
            "raw_response": "",
            "provider": ai_response["provider"]
        }
    
    # Parse JSON response
    result = parse_json_response(ai_response["text"])
    
    if result is None:
        return {
            "success": False,
            "error": "AI returned invalid JSON",
            "prompt_used": prompt,
            "raw_response": ai_response["text"],
            "provider": ai_response["provider"]
        }
    
    return {
        "success": True,
        "data": result,
        "prompt_used": prompt,
        "raw_response": ai_response["text"],
        "provider": ai_response["provider"]
    }
