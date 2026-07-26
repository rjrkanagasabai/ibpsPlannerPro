import google.generativeai as genai
import json
import os
import time

# 1. Insert your free API key here
genai.configure(api_key="YOUR_API_KEY")

# Use Gemini 1.5 Flash - it is extremely fast and perfect for JSON generation
model = genai.GenerativeModel('gemini-1.5-flash')

TARGET_FILE = "public/gk_bank_10k.json"
TOTAL_NEEDED = 10000
BATCH_SIZE = 30 # Generate 30 at a time to ensure high quality and prevent timeouts

def load_existing():
    if os.path.exists(TARGET_FILE):
        with open(TARGET_FILE, "r", encoding="utf-8") as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return []
    return []

def save_data(data):
    os.makedirs(os.path.dirname(TARGET_FILE), exist_ok=True)
    with open(TARGET_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def generate_batch():
    prompt = f"""
    Generate {BATCH_SIZE} highly difficult, unique multiple-choice questions for the IBPS Bank PO mains exam.
    Include a mix of:
    - Core Banking Awareness (RBI policies, Basel norms, acts)
    - Static GK (National Parks, Headquarters, Currencies, Dams)
    
    Output strictly as a raw JSON array. DO NOT wrap it in ```json blocks.
    Use exactly this format:
    [
      {{
        "q": "The question text",
        "a": "The exact correct option",
        "opt": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "exp": "A detailed 1-2 sentence explanation of the answer."
      }}
    ]
    """
    
    try:
        response = model.generate_content(prompt)
        # Clean up any potential markdown formatting the AI might add
        raw_text = response.text.strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:-3]
        elif raw_text.startswith("```"):
            raw_text = raw_text[3:-3]
            
        new_questions = json.loads(raw_text)
        return new_questions
    except Exception as e:
        print(f"Error generating batch: {e}")
        return []

if __name__ == "__main__":
    current_data = load_existing()
    print(f"Starting with {len(current_data)} questions.")
    
    while len(current_data) < TOTAL_NEEDED:
        print(f"Generating batch... (Current total: {len(current_data)}/{TOTAL_NEEDED})")
        new_batch = generate_batch()
        
        if new_batch:
            # Assign proper sequential IDs
            start_id = len(current_data) + 1
            for i, q in enumerate(new_batch):
                q["id"] = start_id + i
                
            current_data.extend(new_batch)
            save_data(current_data)
            print(f"Saved {len(new_batch)} new questions.")
        
        # Pause briefly to respect free-tier rate limits
        time.sleep(3)
        
    print("Successfully generated 10,000 questions!")