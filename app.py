from flask import Flask, render_template, request, jsonify
from generator import generate_handwriting

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    text = data.get('text', '')
    style = data.get('style', 'Student Notes')
    bg_type = data.get('background', 'White Paper')
    font_size = int(data.get('font_size', 32))
    word_spacing = int(data.get('word_spacing', 0))
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400
        
    try:
        img_str = generate_handwriting(text, style, bg_type, font_size, word_spacing)
        return jsonify({'image': img_str})
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
