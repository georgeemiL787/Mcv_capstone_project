import google.generativeai as genai
API_KEY = "AIzaSyBC6d1mLaorwCDsG6ipDaD5vvS5OnyTVwY"
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash")
chat = model.start_chat()
while True:
    user_input = input("You: ")
    if user_input.lower() == "exit":
        print("Exiting chat.")
        break
    response = chat.send_message(user_input)
    print("AI:", response.text)