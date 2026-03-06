# ai_client.py
"""
Unified AI Client with Automatic Fallback
Tries Gemini first, falls back to Groq if quota exceeded
"""

import os
import json
from typing import Optional, Dict, Any
from dotenv import load_dotenv

load_dotenv()

# Import both SDKs
from google import genai
from groq import Groq

# Initialize clients
gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Configuration
GEMINI_MODEL = "gemini-2.5-flash"
GROQ_MODEL = "llama-3.3-70b-versatile"  # Fast and capable
DEBUG_MODE = os.getenv("DEBUG_MODE", "false").lower() == "true"


def generate_content(
    prompt: str,
    temperature: float = 0.3,
    max_tokens: int = 4096,
    response_format: str = "json"
) -> Dict[str, Any]:
    """
    Generate AI content with automatic fallback from Gemini to Groq.
    
    Args:
        prompt: The prompt to send to the AI
        temperature: Creativity level (0.0-1.0)
        max_tokens: Maximum tokens in response
        response_format: "json" or "text"
        
    Returns:
        dict: {
            "success": bool,
            "text": str (the AI response),
            "provider": str ("gemini" or "groq"),
            "error": str (if failed)
        }
    """
    
    # Try Gemini first
    try:
        if DEBUG_MODE:
            print("🔵 Trying Gemini API...")
        
        response = gemini_client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
            config=genai.types.GenerateContentConfig(
                temperature=temperature,
                max_output_tokens=max_tokens,
                response_mime_type="application/json" if response_format == "json" else None,
            )
        )
        
        if DEBUG_MODE:
            print("✅ Gemini succeeded")
        
        return {
            "success": True,
            "text": response.text.strip(),
            "provider": "gemini",
            "error": None
        }
        
    except Exception as gemini_error:
        error_str = str(gemini_error)
        
        # Check if it's a quota error
                # Check if it's a quota error or expired key
        should_fallback = (
            "429" in error_str or 
            "RESOURCE_EXHAUSTED" in error_str or 
            "quota" in error_str.lower() or
            "400" in error_str or
            "INVALID_ARGUMENT" in error_str or
            "expired" in error_str.lower() or
            "API_KEY_INVALID" in error_str
        )
        
        if should_fallback:
            if DEBUG_MODE:
                print(f"⚠️  Gemini quota exceeded, falling back to Groq...")
            
            # Fallback to Groq
            try:
                response = groq_client.chat.completions.create(
                    model=GROQ_MODEL,
                    messages=[
                        {
                            "role": "system",
                            "content": "You are a helpful AI assistant. Always return valid JSON when requested."
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    temperature=temperature,
                    max_tokens=max_tokens,
                    response_format={"type": "json_object"} if response_format == "json" else None
                )
                
                if DEBUG_MODE:
                    print("✅ Groq succeeded (fallback)")
                
                return {
                    "success": True,
                    "text": response.choices[0].message.content.strip(),
                    "provider": "groq",
                    "error": None
                }
                
            except Exception as groq_error:
                if DEBUG_MODE:
                    print(f"❌ Groq also failed: {groq_error}")
                
                return {
                    "success": False,
                    "text": "",
                    "provider": "none",
                    "error": f"Both providers failed. Gemini: {error_str}, Groq: {str(groq_error)}"
                }
        else:
            # Non-quota error from Gemini
            if DEBUG_MODE:
                print(f"❌ Gemini failed with non-quota error: {gemini_error}")
            
            return {
                "success": False,
                "text": "",
                "provider": "none",
                "error": f"Gemini error: {error_str}"
            }


def parse_json_response(response_text: str) -> Optional[dict]:
    """
    Safely parse JSON response with error handling.
    
    Args:
        response_text: Raw text response from AI
        
    Returns:
        dict or None: Parsed JSON or None if parsing fails
    """
    try:
        return json.loads(response_text)
    except json.JSONDecodeError as e:
        if DEBUG_MODE:
            print(f"❌ JSON parsing failed: {e}")
            print(f"Raw text: {response_text[:200]}...")
        return None
