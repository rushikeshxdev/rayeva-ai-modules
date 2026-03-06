"""
Module 3: Environmental Impact Report Generator

Calculates environmental impact metrics with AI-generated statements
and automatic fallback from Gemini to Groq.
"""

from ai_client import generate_content


def calculate_plastic_saved(products: list[dict]) -> float:
    """Calculate plastic saved in grams for plastic-free products."""
    return sum(
        product["weight_grams"] * product["quantity"] * 0.8
        for product in products
        if product.get("is_plastic_free", False)
    )


def calculate_carbon_avoided(products: list[dict]) -> float:
    """Calculate carbon avoided in kilograms for local/organic products."""
    return sum(
        product["weight_grams"] * product["quantity"] * 0.002
        for product in products
        if product.get("is_local", False) or product.get("is_organic", False)
    )


def calculate_local_sourcing(products: list[dict]) -> float:
    """Calculate percentage of products that are locally sourced."""
    if not products:
        return 0.0
    local_count = sum(1 for p in products if p.get("is_local", False))
    return (local_count / len(products)) * 100


def build_impact_prompt(plastic_saved_grams: float, carbon_avoided_kg: float, local_sourcing_percent: float) -> str:
    """Constructs the AI prompt for generating human-readable impact statement."""
    return f"""You are an environmental impact communicator for Rayeva, a sustainable products company.

Generate an encouraging, human-readable impact statement based on these metrics:

PLASTIC SAVED: {plastic_saved_grams:.1f} grams
CARBON AVOIDED: {carbon_avoided_kg:.2f} kg CO2
LOCAL SOURCING: {local_sourcing_percent:.1f}%

INSTRUCTIONS:
1. Write 2-3 sentences that are warm, positive, and motivating
2. Include relatable comparisons (e.g., "equivalent to planting X trees", "like driving Y fewer miles")
3. Make the customer feel good about their sustainable choice
4. Be specific and use the actual numbers provided

IMPORTANT: Return ONLY the impact statement text, no JSON, no extra formatting.

Example: "Amazing work! Your order saved 450g of plastic waste and avoided 2.3kg of CO2 emissions - that's like planting 3 trees! With 60% of your products locally sourced, you're supporting your community while protecting the planet."
"""


def generate_impact_report(order_id: int, products: list[dict]) -> dict:
    """
    Main function that generates an environmental impact report with AI fallback.
    
    Returns:
        dict: {
            "success": bool,
            "data": dict with metrics and impact_statement,
            "error": str (if failed),
            "prompt_used": str,
            "raw_response": str,
            "provider": str ("gemini" or "groq")
        }
    """
    try:
        # Validate products list
        if not products:
            return {
                "success": True,
                "data": {
                    "plastic_saved_grams": 0.0,
                    "carbon_avoided_kg": 0.0,
                    "local_sourcing_percent": 0.0,
                    "impact_statement": "No products in this order to calculate impact."
                },
                "prompt_used": "",
                "raw_response": "",
                "provider": "none"
            }
        
        # Calculate metrics using Python logic (deterministic)
        plastic_saved_grams = calculate_plastic_saved(products)
        carbon_avoided_kg = calculate_carbon_avoided(products)
        local_sourcing_percent = calculate_local_sourcing(products)
        
        # Build prompt for AI-generated impact statement
        prompt = build_impact_prompt(plastic_saved_grams, carbon_avoided_kg, local_sourcing_percent)
        
        # Call unified AI client (tries Gemini, falls back to Groq)
        ai_response = generate_content(prompt, temperature=0.7, max_tokens=500, response_format="text")
        
        if ai_response["success"]:
            impact_statement = ai_response["text"].strip()
        else:
            # Fallback to generic statement if both AI providers fail
            impact_statement = f"Your order saved {plastic_saved_grams:.1f}g of plastic and avoided {carbon_avoided_kg:.2f}kg of CO2 emissions. Thank you for choosing sustainable products!"
        
        return {
            "success": True,
            "data": {
                "plastic_saved_grams": plastic_saved_grams,
                "carbon_avoided_kg": carbon_avoided_kg,
                "local_sourcing_percent": local_sourcing_percent,
                "impact_statement": impact_statement
            },
            "prompt_used": prompt,
            "raw_response": ai_response.get("text", ""),
            "provider": ai_response.get("provider", "none")
        }
        
    except Exception as e:
        # If calculation fails, return error
        return {
            "success": False,
            "error": f"Processing error: {str(e)}",
            "prompt_used": "",
            "raw_response": "",
            "provider": "none"
        }
