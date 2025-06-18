let display = document.getElementById('display');
let currentInput = '';
let shouldResetDisplay = false;

function appendTodisplay(value) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    
    // Prevent multiple decimal points
    if (value === '.') {
        let parts = currentInput.split(/[\+\-\*\/\%\^]/);
        let lastPart = parts[parts.length - 1];
        if (lastPart.includes('.')) {
            return;
        }
    }
    
    // Prevent multiple operators in a row
    if (['+', '-', '*', '/', '%', '^'].includes(value)) {
        if (currentInput === '' || ['+', '-', '*', '/', '%', '^'].includes(currentInput.slice(-1))) {
            if (currentInput === '') return;
            currentInput = currentInput.slice(0, -1);
        }
    }
    
    currentInput += value;
    display.value = currentInput;
}

function clearDisplay() {
    currentInput = '';
    display.value = '';
    shouldResetDisplay = false;
}

function calculate() {
    try {
        if (currentInput === '') return;
        
        // Replace ^ with ** for JavaScript exponentiation
        let expression = currentInput.replace(/\^/g, '**');
        
        // Use Function constructor for safe evaluation
        let result = Function('"use strict"; return (' + expression + ')')();
        
        // Handle division by zero and other edge cases
        if (!isFinite(result)) {
            throw new Error('Invalid calculation');
        }
        
        // Round to avoid floating point precision issues
        result = Math.round(result * 100000000) / 100000000;
        
        display.value = result;
        currentInput = result.toString();
        shouldResetDisplay = true;
        
    } catch (error) {
        display.value = 'Error';
        currentInput = '';
        shouldResetDisplay = true;
    }
}

// Add keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if ('0123456789.'.includes(key)) {
        appendTodisplay(key);
    } else if ('+-*/%'.includes(key)) {
        appendTodisplay(key);
    } else if (key === '^') {
        appendTodisplay('^');
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearDisplay();
    } else if (key === 'Backspace') {
        if (currentInput.length > 0) {
            currentInput = currentInput.slice(0, -1);
            display.value = currentInput;
        }
    }
});