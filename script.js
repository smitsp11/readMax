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