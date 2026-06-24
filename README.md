# InkFlow AI (Neo Ink Studio)

Transform your typed text into beautiful, realistic handwriting without the heavy usage of machine learning models. Built with a sleek Neo Ink Studio theme featuring a dark glassmorphism UI.

## Features
- **4 Handwriting Styles**: Student Notes, Cursive Elegant, Exam Sheet, Journal Writing
- **4 Paper Backgrounds**: White Paper, Ruled Notebook, Graph Paper, A4 Exam Paper
- **Customization**: Adjust Font Size and Word Spacing to make the handwriting feel natural
- **History**: Automatically saves your last 5 generations locally

## Tech Stack
- **Frontend**: HTML5, Vanilla CSS (Glassmorphism), Vanilla JavaScript
- **Backend**: Python, Flask, Pillow (for rendering)

## Local Setup

1. Install Python 3.8+
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the development server:
   ```bash
   python app.py
   ```
4. Open your browser to `http://127.0.0.1:5000`

## Render Deployment

This project is optimized for deployment on Render.

1. Connect your GitHub repository to Render.
2. Create a new **Web Service**.
3. Set the build command to:
   ```bash
   pip install -r requirements.txt
   ```
4. Set the start command to:
   ```bash
   gunicorn app:app
   ```
5. Deploy!

## Notes on Performance
This application intentionally avoids training or inferencing heavy neural networks (RNN/LSTM/Transformers) to keep resource usage extremely low. It relies on high-quality handwriting fonts and Pillow rendering engine to compose realistic outputs instantly.
"# Written_text_generation" 
