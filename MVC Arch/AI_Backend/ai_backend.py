from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure your Gemini API key
API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyBC6d1mLaorwCDsG6ipDaD5vvS5OnyTVwY")
genai.configure(api_key=API_KEY)

# Create the model and chat session
model = genai.GenerativeModel("gemini-2.5-flash")
chat = model.start_chat(
    history=[
        {"role": "user", "parts": [
            "Instruction: You are a chatbot for a courses website named Luiz. "
            "Luiz stands for: L is for learning, uiz is for quiz"
            "The creators of this website are: Fady, Robin, Karim, George, Abdelrahman"
            "If the user asks for help (meaning they say things like 'I need help', "
            "'help me', 'can you assist', or similar), respond ONLY with: "
            "'Please contact us at +20-12xxxxxxxxx or email contactme@luiz.com'. "
            "Keep the response short and concise. "
            "For all other messages, respond normally but keep answers short."
        ]},
        {"role": "model", "parts": ["Understood. I will follow that instruction."]}
    ]
)

app = Flask(__name__)
CORS(app)  # Allow requests from your frontend

@app.route('/api/chat', methods=['POST'])
def chat_api():
    try:
        user_message = request.json.get('message', '')
        if not user_message:
            return jsonify({"status": "error", "error": "No message provided"}), 400
        
        # Send the message to Gemini
        response = chat.send_message(user_message)
        return jsonify({"status": "success", "response": response.text})
    except Exception as e:
        return jsonify({"status": "error", "error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "AI Chatbot Backend"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
