"""
Module 2: B2B Proposal Generator

Generates customized bulk purchase proposals for corporate clients
with automatic fallback from Gemini to Groq.
"""

import json
from ai_client import generate_content, parse_json_response


def build_prompt(client_name: str, industry: str, budget: float, num_employees: int, preferences: list[str]) -> str:
    """Constructs the AI prompt for B2B proposal generation."""
    prefs_str = ', '.join(preferences) if preferences else 'No specific preferences'
    
    return f"""You are a B2B sales consultant for Rayeva, a sustainable products company.

Generate a bulk purchase proposal for the following corporate client:

CLIENT NAME: {client_name}
INDUSTRY: {industry}
BUDGET: ₹{budget:,.2f} INR
NUMBER OF EMPLOYEES: {num_employees}
SUSTAINABILITY PREFERENCES: {prefs_str}

INSTRUCTIONS:
1. Recommend 5-7 sustainable products that fit this industry and preferences
2. Stay within the budget (aim for 90-100% budget utilization)
3. For each product, include: product_name, category, quantity, unit_price, total_price, sustainability_benefit
4. Keep sustainability_benefit descriptions concise (under 100 characters)
5. Calculate total_cost and budget_utilization_percent
6. Provide a concise impact_summary (under 200 characters)
7. Provide a concise impact_positioning (under 200 characters)

IMPORTANT: Return ONLY valid JSON, no markdown, no extra text. Keep all text fields concise.

Return this exact format:
{{
  "client_name": "{client_name}",
  "industry": "{industry}",
  "recommended_products": [
    {{
      "product_name": "Bamboo Desk Organizer",
      "category": "Office & Stationery",
      "quantity": 50,
      "unit_price": 299.0,
      "total_price": 14950.0,
      "sustainability_benefit": "Biodegradable alternative to plastic organizers"
    }}
  ],
  "total_cost": 48750.0,
  "budget_utilization_percent": 97.5,
  "impact_summary": "Eliminates 15kg plastic waste, supports sustainable manufacturing",
  "impact_positioning": "Green initiative aligning with CSR goals and environmental responsibility"
}}"""


def generate_proposal(client_name: str, industry: str, budget: float, num_employees: int, preferences: list[str]) -> dict:
    """
    Main function that generates a B2B proposal using AI with fallback.
    
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
    prompt = build_prompt(client_name, industry, budget, num_employees, preferences)
    
    # Call unified AI client (tries Gemini, falls back to Groq)
    ai_response = generate_content(prompt, temperature=0.3, max_tokens=4096, response_format="json")
    
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
