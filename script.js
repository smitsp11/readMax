// DOM Elements
const textInput = document.getElementById('inputText');
const testBtn = document.getElementById('testBtn');
const wpmSlider = document.getElementById('wpmSlider');
const wpmDisplay = document.getElementById('wpmDisplay');

// Reader Spans
const leftSpan = document.getElementById('left-part');
const pivotSpan = document.getElementById('pivot-char');
const rightSpan = document.getElementById('right-part');

// State Variables
let wordsArray = [];
let currentIndex = 0;

// 1. EVENT LISTENERS
wpmSlider.addEventListener('input', (e) => {
    wpmDisplay.textContent = e.target.value;
});

testBtn.addEventListener('click', () => {
    // If we haven't processed text yet, do it now
    if (wordsArray.length === 0) {
        processInputText();
    }
    
    // Cycle through words one by one
    if (currentIndex < wordsArray.length) {
        renderWord(wordsArray[currentIndex]);
        currentIndex++;
    } else {
        // Reset for testing
        currentIndex = 0;
        renderWord("DONE");
    }
});

// 2. TEXT PROCESSING PIPELINE
function processInputText() {
    const rawText = textInput.value;
    // Split by spaces (regex handles multiple spaces/newlines)
    wordsArray = rawText.trim().split(/\s+/); 
    currentIndex = 0;
    console.log("Processed " + wordsArray.length + " words.");
}

// 3. THE CORE LOGIC (ORP Calculation)
function getPivotIndex(word) {
    const length = word.length;
    // Formula: slightly left of center
    // Length 1 -> Index 0
    // Length 4 -> Index 1
    // Length 10 -> Index 3
    let pivot = Math.ceil((length - 1) / 4);
    
    // Safety check needed? Not really, math holds up, but good to know.
    return pivot;
}

// 4. RENDER ENGINE
function renderWord(word) {
    const pivotIndex = getPivotIndex(word);

    const leftText = word.slice(0, pivotIndex);
    const pivotChar = word[pivotIndex];
    const rightText = word.slice(pivotIndex + 1);

    leftSpan.textContent = leftText;
    pivotSpan.textContent = pivotChar;
    rightSpan.textContent = rightText;
}