// DOM Elements
const textInput = document.getElementById('inputText');
const startBtn = document.getElementById('startBtn'); // Renamed/Enabled
const wpmSlider = document.getElementById('wpmSlider');
const wpmDisplay = document.getElementById('wpmDisplay');

// Reader Spans
const leftSpan = document.getElementById('left-part');
const pivotSpan = document.getElementById('pivot-char');
const rightSpan = document.getElementById('right-part');

// State Variables
let wordsArray = [];
let currentIndex = 0;
let isPlaying = false;
let timerId = null; // To track the active timeout

// 1. EVENT LISTENERS
wpmSlider.addEventListener('input', (e) => {
    wpmDisplay.textContent = e.target.value;
    // No need to restart loop; the next cycle will pick up the new speed automatically
});

startBtn.removeAttribute('disabled'); // Enable the button
startBtn.textContent = "Start Reading";

startBtn.addEventListener('click', togglePlay);

// 2. PLAY/PAUSE LOGIC
function togglePlay() {
    if (isPlaying) {
        // PAUSE
        isPlaying = false;
        clearTimeout(timerId); // Stop the pending loop
        startBtn.textContent = "Resume";
        startBtn.style.backgroundColor = "#007bff"; // Blue
    } else {
        // PLAY
        if (wordsArray.length === 0) processInputText();
        
        // If we reached the end, reset
        if (currentIndex >= wordsArray.length) {
            currentIndex = 0;
        }

        isPlaying = true;
        startBtn.textContent = "Pause";
        startBtn.style.backgroundColor = "#dc3545"; // Red for stop
        
        // Kick off the loop
        playLoop();
    }
}

// 3. THE RECURSIVE LOOP (The Engine)
function playLoop() {
    if (!isPlaying) return; // Safety check
    
    if (currentIndex >= wordsArray.length) {
        // End of text reached
        isPlaying = false;
        startBtn.textContent = "Restart";
        startBtn.style.backgroundColor = "#28a745"; // Green for done
        return;
    }

    // A. Render the current word
    const word = wordsArray[currentIndex];
    renderWord(word);
    currentIndex++;

    // B. Calculate Dynamic Speed
    const wpm = parseInt(wpmSlider.value, 10);
    // Base delay in ms (60,000 ms / WPM)
    let delay = 60000 / wpm;

    // OPTIONAL: Add "Pause Weight" for punctuation
    // If word ends in . , ! ? add extra time
    const lastChar = word.slice(-1);
    if (['.', '!', '?'].includes(lastChar)) {
        delay = delay * 2.0; // Double pause for sentences
    } else if ([';', ','].includes(lastChar)) {
        delay = delay * 1.5; // 1.5x pause for commas
    }

    // C. Schedule next loop
    timerId = setTimeout(playLoop, delay);
}

// 4. TEXT PROCESSING PIPELINE
function processInputText() {
    const rawText = textInput.value;
    // Split by spaces, remove empty strings
    wordsArray = rawText.trim().split(/\s+/).filter(w => w.length > 0); 
    console.log("Processed " + wordsArray.length + " words.");
}

// 5. ORP LOGIC
function getPivotIndex(word) {
    const length = word.length;
    let pivot = Math.ceil((length - 1) / 4);
    return pivot;
}

// 6. RENDER
function renderWord(word) {
    const pivotIndex = getPivotIndex(word);

    const leftText = word.slice(0, pivotIndex);
    const pivotChar = word[pivotIndex];
    const rightText = word.slice(pivotIndex + 1);

    leftSpan.textContent = leftText;
    pivotSpan.textContent = pivotChar;
    rightSpan.textContent = rightText;
}

// 7. KEYBOARD SHORTCUTS
document.addEventListener('keydown', (e) => {
    // If user is typing in the textarea, don't trigger shortcuts!
    if (document.activeElement === textInput) return;

    switch(e.code) {
        case 'Space':
            e.preventDefault(); // Stop page scrolling
            togglePlay();
            break;
        
        case 'ArrowLeft':
            e.preventDefault();
            // Rewind 10 words (or to 0 if we are near the start)
            currentIndex = Math.max(0, currentIndex - 10);
            renderWord(wordsArray[currentIndex]); // Show where we landed
            break;
            
        case 'ArrowRight':
            e.preventDefault();
            // Fast forward 10 words
            currentIndex = Math.min(wordsArray.length - 1, currentIndex + 10);
            renderWord(wordsArray[currentIndex]);
            break;
            
        case 'ArrowUp':
            e.preventDefault();
            // Increase Speed by 10
            wpmSlider.value = parseInt(wpmSlider.value) + 10;
            wpmDisplay.textContent = wpmSlider.value;
            break;

        case 'ArrowDown':
            e.preventDefault();
            // Decrease Speed by 10
            wpmSlider.value = parseInt(wpmSlider.value) - 10;
            wpmDisplay.textContent = wpmSlider.value;
            break;
    }
});

// 8. MODAL LOGIC
const helpBtn = document.getElementById('helpBtn');
const helpModal = document.getElementById('helpModal');
const closeModal = document.getElementById('closeModal');

// Open
helpBtn.addEventListener('click', () => {
    helpModal.classList.remove('hidden');
});

// Close (X button)
closeModal.addEventListener('click', () => {
    helpModal.classList.add('hidden');
});

// Close (Click outside box)
window.addEventListener('click', (e) => {
    if (e.target === helpModal) {
        helpModal.classList.add('hidden');
    }
});

// Close (Escape key)
document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && !helpModal.classList.contains('hidden')) {
        helpModal.classList.add('hidden');
    }
});
