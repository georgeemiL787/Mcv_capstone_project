# AI Chatbot Backend

This is the Python backend service for the LuIZ Learning Assistant chatbot.

## Setup

1. **Install Python Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Environment Variables:**
   Create a `.env` file in the AI_Backend directory:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   FLASK_ENV=development
   FLASK_DEBUG=True
   ```

3. **Get Gemini API Key:**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to your `.env` file

## Running the Service

```bash
python ai_backend.py
```

The service will run on `http://localhost:5000`

## API Endpoints

- `POST /api/chat` - Send a message to the AI chatbot
- `GET /health` - Health check endpoint

## Integration

The frontend JavaScript will automatically connect to this backend service when the chatbot is used. Make sure the backend is running before testing the chatbot functionality.

## Features

- Google Gemini AI integration
- CORS enabled for frontend communication
- Environment variable configuration
- Health check endpoint
- Error handling and fallback responses
