def generate_chat_response_with_ollama(message: str, timeout: int = 60):
    """
    Sends a general chat message to Ollama and returns the AI's reply as plain text.
    """
    prompt = f"You are ChatCook, a friendly cooking assistant. Answer the user's message conversationally and helpfully.\nUser: {message}\nChatCook:"
    payload = {
        "model": MODEL,
        "prompt": prompt,
        "stream": False,
        "options": {
            "num_predict": 120,
            "temperature": 0.7,
            "top_p": 0.9,
            "top_k": 40
        },
        "keep_alive": "10m"
    }
    try:
        r = requests.post(OLLAMA_URL, json=payload, timeout=timeout)
        r.raise_for_status()
        env = r.json()
        return (env.get("response") or "").strip()
    except Exception as e:
        logging.warning(f"[OLLAMA] ChatCook failed: {e}")
        return "Sorry, ChatCook is unavailable right now."
# ollama_ai.py
import requests, json, re, logging

OLLAMA_URL = "http://127.0.0.1:11434/api/generate"
MODEL = "llama3.2:1b"  # or "mistral:7b-instruct" / "phi3:mini"

JSON_PROMPT = (
    "Return ONLY minified JSON with keys: "
    "name, ingredients (string[]), nutrition (object: calories, protein, fat, carbs, benefits), "
    "instructions (string[]), prep_time, cook_time, difficulty, cuisine.\n"
    "Query: \"{query}\".\n"
    "No prose. If impossible: {{\"error\":\"no_recipe\"}}"
)


def generate_recipe_with_ollama(query: str, timeout: int = 120):  # <-- 120s
    payload = {
        "model": MODEL,
        "prompt": JSON_PROMPT.format(query=query),
        "stream": False,
        "options": {
            "num_predict": 220,   # smaller = faster
            "temperature": 0.1,   # more deterministic JSON
            "top_p": 0.9,
            "top_k": 40
        },
        "keep_alive": "10m"     # keep model in RAM for snappy subsequent calls
    }
    logging.info(f"[OLLAMA] request -> {payload['prompt'][:200]}...")
    r = requests.post(OLLAMA_URL, json=payload, timeout=timeout)
    r.raise_for_status()

    env = r.json()
    text = (env.get("response") or "").strip()

    # Extract JSON if there’s extra text
    m = re.search(r'\{.*\}', text, re.DOTALL)
    if m:
        text = m.group(0)

    try:
        return json.loads(text)
    except Exception as e:
        logging.warning(f"[OLLAMA] JSON parse failed: {e}")
        return {"ai_text": text or "No response from model"}
