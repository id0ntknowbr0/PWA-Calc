// Prevent unit converter input from triggering calculator keyboard events

document.addEventListener('DOMContentLoaded', function() {

    var meterInput = document.getElementById('meter-input');

    if (meterInput) {

        meterInput.addEventListener('keydown', function(e) { e.stopPropagation(); });

        meterInput.addEventListener('input', function(e) { e.stopPropagation(); });

    }

});

// --- Meter Converter Logic ---

function convertMeter() {

    var input = parseFloat(document.getElementById('meter-input').value);

    var from = document.getElementById('meter-from').value;

    var to = document.getElementById('meter-to').value;

    if (isNaN(input)) {

        document.getElementById('meter-result').textContent = '';

        return;

    }

    // Convert input to meters first

    var meters = input;

    switch(from) {

        case 'cm': meters = input / 100; break;

        case 'mm': meters = input / 1000; break;

        case 'km': meters = input * 1000; break;

    }

    // Convert meters to target unit

    var result = meters;

    switch(to) {

        case 'cm': result = meters * 100; break;

        case 'mm': result = meters * 1000; break;

        case 'km': result = meters / 1000; break;

    }

    // Format result

    document.getElementById('meter-result').textContent = input + ' ' + from + ' = ' + result + ' ' + to;

}

// --- Scientific Panel Toggle ---

function toggleSciPanel() {

    const sciPanel = document.getElementById('sci-panel');

    const sciArrow = document.getElementById('sci-arrow');

    // Panel is open if right is 0px

    if (sciPanel.style.right === '0px') {

        sciPanel.style.right = '-260px';

        sciArrow.innerHTML = '&#9654;'; // right arrow (closed)

    } else {

        sciPanel.style.right = '0px';

        sciArrow.innerHTML = '&#9664;'; // left arrow (open)

    }

}



// --- Scientific Functions ---

function sciFunc(type) {

    let val = parseFloat(displayInput.value);

    let result = '';

    switch(type) {

        case 'sin':

            if (displayInput.value === '0') displayInput.value = '';

            displayInput.value += 'sin(';

            currentInput = displayInput.value;

            return;

        case 'cos':

            if (displayInput.value === '0') displayInput.value = '';

            displayInput.value += 'cos(';

            currentInput = displayInput.value;

            return;

        case 'tan':

            if (displayInput.value === '0') displayInput.value = '';

            displayInput.value += 'tan(';

            currentInput = displayInput.value;

            return;

        case 'log':

            if (displayInput.value === '0') displayInput.value = '';

            displayInput.value += 'log(';

            currentInput = displayInput.value;

            return;

        case 'ln':

            if (displayInput.value === '0') displayInput.value = '';

            displayInput.value += 'ln(';

            currentInput = displayInput.value;

            return;

        case 'sqrt':

            if (displayInput.value === '0') displayInput.value = '';

            displayInput.value += 'sqrt(';

            currentInput = displayInput.value;

            return;

        case 'exp':

            if (displayInput.value === '0') displayInput.value = '';

            displayInput.value += 'exp(';

            currentInput = displayInput.value;

            return;

        case 'pow10':

            if (displayInput.value === '0') displayInput.value = '';

            displayInput.value += '10^';

            currentInput = displayInput.value;

            return;

        case 'pi': result = Math.PI; break;

        case 'fact':

            if (displayInput.value === '0') displayInput.value = '';

            displayInput.value += 'fact(';

            currentInput = displayInput.value;

            return;

        case 'open':

            displayValue('('); return;

        case 'close':

            displayValue(')'); return;

    }

    if (result === '' || isNaN(result)) result = 'Error';

    displayInput.value = result.toString();

    saveToHistory(type + '(' + val + ')', result.toString());

    shouldResetDisplay = true;

}

// Square function for x² button

function square() {

    let val = parseFloat(displayInput.value);

    if (!isNaN(val)) {

        let result = val * val;

        displayInput.value = result.toString();

        saveToHistory(val + '²', result.toString());

        shouldResetDisplay = true;

    }

}

// --- Calculation History Feature ---

let calcHistory = [];



function saveToHistory(expression, result) {

    calcHistory.push({ expression, result });

    localStorage.setItem('calcHistory', JSON.stringify(calcHistory));

    renderHistory();

}



function renderHistory() {

    const historyList = document.getElementById('history-list');

    if (!historyList) return;

    historyList.innerHTML = '';

    if (calcHistory.length === 0) {

        historyList.innerHTML = '<li style="color:#000;">No history yet.</li>';

        return;

    }

    calcHistory.slice().reverse().forEach(item => {

        const li = document.createElement('li');

        li.textContent = `${item.expression} = ${item.result}`;

        historyList.appendChild(li);

    });

}



function toggleHistory() {

    const panel = document.getElementById('history-panel');

    if (panel) {

        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';

        renderHistory();

    }

}



function clearHistory() {

    calcHistory = [];

    localStorage.removeItem('calcHistory');

    renderHistory();

}



function loadHistory() {

    const stored = localStorage.getItem('calcHistory');

    if (stored) {

        calcHistory = JSON.parse(stored);

    }

}

let displayInput = document.getElementById('placeholder');

let currentInput = '';

let shouldResetDisplay = false;



// Function to display values on the calculator screen

function displayValue(value) {

    if (shouldResetDisplay) {

        displayInput.value = '';

        shouldResetDisplay = false;

    }

    if (displayInput.value === '0') {

        displayInput.value = value;

    } else {

        displayInput.value += value;

    }

    currentInput = displayInput.value;

    localStorage.setItem('calcInput', displayInput.value);

}



// Alternative function name to match your HTML onclick attributes

function display(value) {

    displayValue(value);

}



// Clear all function

function clr() {

    displayInput.value = '0';

    currentInput = '';

    localStorage.setItem('calcInput', displayInput.value);

}



// Delete last character function

function dlt() {

    if (displayInput.value.length > 1) {

        displayInput.value = displayInput.value.slice(0, -1);

    } else {

        displayInput.value = '0';

    }

    currentInput = displayInput.value;

    localStorage.setItem('calcInput', displayInput.value);

}



// Calculate function

function calculate() {

    try {

        let expression = displayInput.value;

        localStorage.setItem('calcInput', displayInput.value);

        // Replace display symbols with JavaScript operators

        expression = expression.replace(/×/g, '*');

        expression = expression.replace(/÷/g, '/');

        // Handle percentage

        expression = expression.replace(/(\d+)%/g, '($1/100)');

        // Handle 10^x

        expression = expression.replace(/10\^([\d.]+)/g, 'Math.pow(10,$1)');

        // Handle exp(x)

        expression = expression.replace(/exp\(([^)]+)\)/g, 'Math.exp($1)');

        // Handle sqrt(x)

        expression = expression.replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)');

        // Handle log(x)

        expression = expression.replace(/log\(([^)]+)\)/g, 'Math.log10($1)');

        // Handle ln(x)

        expression = expression.replace(/ln\(([^)]+)\)/g, 'Math.log($1)');

        // Handle sin(x), cos(x), tan(x) in degrees

        expression = expression.replace(/sin\(([^)]+)\)/g, 'Math.sin(($1)*Math.PI/180)');

        expression = expression.replace(/cos\(([^)]+)\)/g, 'Math.cos(($1)*Math.PI/180)');

        expression = expression.replace(/tan\(([^)]+)\)/g, 'Math.tan(($1)*Math.PI/180)');

        // Handle fact(x)

        expression = expression.replace(/fact\(([^)]+)\)/g, function(_, n) {

            n = parseFloat(n);

            if (isNaN(n) || n < 0 || !Number.isInteger(n)) return 'NaN';

            let f = 1;

            for (let i = 2; i <= n; i++) f *= i;

            return f;

        });

        // Evaluate the expression

        let result = eval(expression);

        // Handle division by zero

        if (!isFinite(result)) {

            displayInput.value = 'Error';

            shouldResetDisplay = true;

            return;

        }

        // Format the result

        let resultStr;

        if (result % 1 === 0) {

            resultStr = result.toString();

        } else {

            resultStr = parseFloat(result.toFixed(8)).toString();

        }

        displayInput.value = resultStr;

        saveToHistory(expression, resultStr);

        shouldResetDisplay = true;

    } catch (error) {

        displayInput.value = 'Error';

        shouldResetDisplay = true;

    }

}



// Keyboard support

document.addEventListener('keydown', function(event) {

    const key = event.key;

    

    // Numbers

    if (key >= '0' && key <= '9') {

        displayValue(key);

    }

    

    // Operators

    switch(key) {

        case '+':

            displayValue('+');

            break;

        case '-':

            displayValue('-');

            break;

        case '*':

            displayValue('*');

            break;

        case '/':

            event.preventDefault(); // Prevent browser search

            displayValue('/');

            break;

        case '%':

            displayValue('%');

            break;

        case '.':

            displayValue('.');

            break;

        case 'Enter':

        case '=':

            event.preventDefault();

            calculate();

            break;

        case 'Escape':

        case 'c':

        case 'C':

            clr();

            break;

        case 'Backspace':

            dlt();

            break;

    }

});

// Initialize display

window.onload = function() {

    // Restore input value from localStorage if available

    const savedInput = localStorage.getItem('calcInput');

    displayInput.value = savedInput !== null ? savedInput : '0';

    // Prevent non-numeric and invalid input in the calculator input field

    displayInput.addEventListener('input', function(e) {

        // Allow only numbers, operators, and dot

        let valid = this.value.replace(/[^0-9+\-*/%.]/g, '');

        if (this.value !== valid) {

            this.value = valid;

        }

        localStorage.setItem('calcInput', this.value);

    });

    // Save input on button presses as well

    ['click', 'keyup'].forEach(evt => displayInput.addEventListener(evt, function() {

        localStorage.setItem('calcInput', displayInput.value);

    }));

    // Ensure scientific panel is closed by default

    var sciPanel = document.getElementById('sci-panel');

    var sciArrow = document.getElementById('sci-arrow');

    if (sciPanel) {

        sciPanel.style.right = '-260px';

        if (sciArrow) sciArrow.innerHTML = '&#9654;'; // right arrow (closed)

    }

    loadHistory();

    renderHistory();

}
// In script.js, add this at the end to unregister
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for (let registration of registrations) {
            registration.unregister();
        }
    });
}