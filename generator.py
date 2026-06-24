import io
import base64
from PIL import Image, ImageDraw, ImageFont

FONTS = {
    'Student Notes': 'fonts/Caveat-Regular.ttf',
    'Cursive Elegant': 'fonts/DancingScript-Regular.ttf',
    'Exam Sheet': 'fonts/IndieFlower-Regular.ttf',
    'Journal Writing': 'fonts/ShadowsIntoLight-Regular.ttf',
    'Vintage Script': 'fonts/Satisfy-Regular.ttf',
    'Casual Marker': 'fonts/Kalam-Regular.ttf',
    'Architect Draft': 'fonts/ArchitectsDaughter-Regular.ttf',
    'Neat Print': 'fonts/PatrickHand-Regular.ttf'
}

def generate_background(bg_type, width, height):
    img = Image.new('RGB', (width, height), color='#FFFFFF')
    draw = ImageDraw.Draw(img)
    
    if bg_type == 'Ruled Notebook':
        # Draw horizontal lines
        line_color = '#94A3B8'
        for y in range(80, height, 40):
            draw.line([(0, y), (width, y)], fill=line_color, width=1)
        # Draw vertical margin
        margin_color = '#EF4444'
        draw.line([(80, 0), (80, height)], fill=margin_color, width=2)
        
    elif bg_type == 'Graph Paper':
        line_color = '#CBD5E1'
        grid_size = 20
        for y in range(0, height, grid_size):
            draw.line([(0, y), (width, y)], fill=line_color, width=1)
        for x in range(0, width, grid_size):
            draw.line([(x, 0), (x, height)], fill=line_color, width=1)
            
    elif bg_type == 'A4 Exam Paper':
        # Similar to ruled but with a top header and wider margin
        line_color = '#64748B'
        # Header line
        draw.line([(0, 100), (width, 100)], fill='#1E293B', width=3)
        # Ruled lines
        for y in range(140, height, 40):
            draw.line([(0, y), (width, y)], fill=line_color, width=1)
        # Margin
        margin_color = '#64748B'
        draw.line([(60, 0), (60, height)], fill=margin_color, width=2)
        
    return img

def generate_handwriting(text, style, bg_type, font_size, word_spacing):
    # Set default size
    width = 800
    # Estimate height based on text length to avoid cutting off
    words = text.split()
    estimated_lines = max((len(words) * (font_size / 2)) // (width - 150), 1)
    line_spacing = 40 if bg_type in ['Ruled Notebook', 'A4 Exam Paper'] else font_size + 15
    height = int(max(1000, 200 + estimated_lines * line_spacing * 2))
    
    font_path = FONTS.get(style, FONTS['Student Notes'])
    try:
        font = ImageFont.truetype(font_path, font_size)
    except IOError:
        font = ImageFont.load_default()
        
    img = generate_background(bg_type, width, height)
    draw = ImageDraw.Draw(img)
    
    text_color = '#0F172A'
    
    margin_left = 100
    margin_top = 80
    if bg_type == 'A4 Exam Paper':
        margin_top = 140
    elif bg_type == 'Graph Paper':
        margin_top = 60
        
    x, y = margin_left, margin_top
    
    # Calculate word spacing factor
    try:
        # getbbox returns (left, top, right, bottom)
        space_width = font.getbbox(' ')[2] + word_spacing
    except AttributeError:
        # fallback for older PIL versions
        space_width = font.getsize(' ')[0] + word_spacing

    # Newlines should be respected
    paragraphs = text.split('\n')
    
    for paragraph in paragraphs:
        if not paragraph.strip():
            y += line_spacing
            x = margin_left
            continue
            
        words = paragraph.split(' ')
        for word in words:
            if not word:
                x += space_width
                continue
                
            try:
                word_width = font.getbbox(word)[2]
            except AttributeError:
                word_width = font.getsize(word)[0]
                
            if x + word_width > width - 40:
                # new line
                x = margin_left
                y += line_spacing
                
            # Render word
            # For ruled paper, align baseline slightly above the line
            y_offset = -int(font_size * 0.2) if bg_type in ['Ruled Notebook', 'A4 Exam Paper'] else 0
            draw.text((x, y + y_offset), word, font=font, fill=text_color)
            x += word_width + space_width
            
        # paragraph break
        x = margin_left
        y += line_spacing
        
    # Crop height to content
    final_height = min(y + 100, height)
    img_cropped = img.crop((0, 0, width, final_height))
    
    buffered = io.BytesIO()
    img_cropped.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    return img_str
