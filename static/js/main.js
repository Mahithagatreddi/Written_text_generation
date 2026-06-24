document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('generate-form');
    const textInput = document.getElementById('text-input');
    const charCount = document.getElementById('count');
    const fontSizeSlider = document.getElementById('font-size');
    const fontSizeVal = document.getElementById('font-size-val');
    const wordSpacingSlider = document.getElementById('word-spacing');
    const wordSpacingVal = document.getElementById('word-spacing-val');
    
    const styleSelect = document.getElementById('style-select');
    const bgSelect = document.getElementById('bg-select');
    
    const generateBtn = document.getElementById('generate-btn');
    const btnText = generateBtn.querySelector('.btn-text');
    const loader = generateBtn.querySelector('.loader');
    
    const previewImg = document.getElementById('preview-img');
    const previewPlaceholder = document.getElementById('preview-placeholder');
    const downloadBtn = document.getElementById('download-btn');
    
    const historyContainer = document.getElementById('history-container');
    const historyGrid = document.getElementById('history-grid');

    // Load History on startup
    loadHistory();

    const sampleTexts = [
        "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet, making it perfect for demonstrating handwriting styles!",
        "Dear Diary,\n\nToday was an absolutely wonderful day. I walked through the park and saw the most vibrant autumn leaves. I can't wait to see what tomorrow brings.",
        "Biology Notes: Chapter 4\n- Mitochondria is the powerhouse of the cell.\n- Photosynthesis requires sunlight, water, and carbon dioxide.\n- Remember to study for the upcoming quiz on Friday!",
        "To whoever finds this letter,\n\nI have hidden the treasure exactly where we discussed. Look beneath the old oak tree when the moon is full.\n\nYours truly.",
        "Recipe for Chocolate Chip Cookies:\n1. Preheat oven to 350°F (175°C).\n2. Cream together butter, white sugar, and brown sugar.\n3. Bake for 10-12 minutes.",
        "To be, or not to be, that is the question:\nWhether 'tis nobler in the mind to suffer\nThe slings and arrows of outrageous fortune,\nOr to take arms against a sea of troubles...",
        "Packing List for Hawaii Vacation:\n[ ] Sunscreen\n[ ] Swimsuit\n[ ] Sunglasses\n[ ] Flip flops\n[ ] Good book",
        "Random thoughts:\nWhy do we call it a building if it's already built? Why do we drive on parkways and park on driveways? The world is full of mysteries."
    ];

    const loadSampleBtn = document.getElementById('load-sample-btn');
    if (loadSampleBtn) {
        loadSampleBtn.addEventListener('click', () => {
            const randomSample = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
            textInput.value = randomSample;
            charCount.textContent = textInput.value.length;
        });
    }

    // Character counter
    textInput.addEventListener('input', () => {
        charCount.textContent = textInput.value.length;
    });

    // Slider value updates
    fontSizeSlider.addEventListener('input', () => {
        fontSizeVal.textContent = fontSizeSlider.value;
    });

    wordSpacingSlider.addEventListener('input', () => {
        wordSpacingVal.textContent = wordSpacingSlider.value;
    });

    // Form Submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const text = textInput.value.trim();
        if (!text) return;

        const payload = {
            text: text,
            style: styleSelect.value,
            background: bgSelect.value,
            font_size: fontSizeSlider.value,
            word_spacing: wordSpacingSlider.value
        };

        // Loading state
        btnText.classList.add('hidden');
        loader.classList.remove('hidden');
        generateBtn.disabled = true;

        try {
            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok && data.image) {
                const imgSrc = `data:image/png;base64,${data.image}`;
                
                // Show preview
                previewImg.src = imgSrc;
                previewImg.classList.remove('hidden');
                previewPlaceholder.classList.add('hidden');
                
                // Enable download
                downloadBtn.classList.remove('hidden');
                downloadBtn.disabled = false;
                downloadBtn.onclick = () => downloadImage(imgSrc);

                // Save to history
                saveToHistory(imgSrc, payload.style, payload.background);
            } else {
                alert('Error: ' + (data.error || 'Failed to generate handwriting.'));
            }
        } catch (error) {
            console.error('Generation Error:', error);
            alert('An error occurred while generating the image.');
        } finally {
            // Restore state
            btnText.classList.remove('hidden');
            loader.classList.add('hidden');
            generateBtn.disabled = false;
        }
    });

    function downloadImage(dataUrl) {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `inkflow_${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function saveToHistory(imgSrc, style, bg) {
        let history = JSON.parse(localStorage.getItem('inkflow_history') || '[]');
        
        // Add new item to start
        history.unshift({
            imgSrc,
            style,
            bg,
            date: new Date().toLocaleDateString()
        });

        // Keep only last 5
        if (history.length > 5) {
            history = history.slice(0, 5);
        }

        localStorage.setItem('inkflow_history', JSON.stringify(history));
        renderHistory(history);
    }

    function loadHistory() {
        const history = JSON.parse(localStorage.getItem('inkflow_history') || '[]');
        if (history.length > 0) {
            renderHistory(history);
        }
    }

    function renderHistory(history) {
        historyContainer.classList.remove('hidden');
        historyGrid.innerHTML = '';

        history.forEach(item => {
            const div = document.createElement('div');
            div.className = 'history-item';
            div.innerHTML = `
                <img src="${item.imgSrc}" alt="History item" loading="lazy">
                <div class="history-info">
                    <strong>${item.style}</strong><br>
                    ${item.bg}<br>
                    <small>${item.date}</small>
                </div>
            `;
            
            // Allow clicking history to load it into preview
            div.addEventListener('click', () => {
                previewImg.src = item.imgSrc;
                previewImg.classList.remove('hidden');
                previewPlaceholder.classList.add('hidden');
                downloadBtn.classList.remove('hidden');
                downloadBtn.disabled = false;
                downloadBtn.onclick = () => downloadImage(item.imgSrc);
            });
            
            historyGrid.appendChild(div);
        });
    }
});
