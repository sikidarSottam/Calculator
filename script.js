const add = (a, b) => a + b;
const sub = (a, b) => a - b;
const mul = (a, b) => a * b;
const div = (a, b) => {
    // Check for division by zero to prevent errors and display a message.
    if (b === 0) {
        return "Error: Div by 0!";
    }
    return a / b;
};

// --- Operation Orchestrator Function ---
// This function takes an operator and two numbers, then calls the appropriate math function.
const calcOp = (operator, val1, val2) => {
    // Convert string inputs to floating-point numbers for calculations.
    val1 = parseFloat(val1);
    val2 = parseFloat(val2);

    switch (operator) {
        case 'add':
            return add(val1, val2);
        case 'sub':
            return sub(val1, val2);
        case 'mul':
            return mul(val1, val2);
        case 'div':
            return div(val1, val2);
        default:
            // Should not happen if operators are correctly handled
            return "Error";
    }
};

// --- DOM Element References ---
const disp = document.getElementById('disp'); // Calculator display
const calcGrid = document.getElementById('calcGrid'); // Calculator grid container for buttons

// --- Calculator State Variables (Concise Names) ---
let n1 = ''; // Stores the first number of an operation
let op = null; // Stores the current operator (e.g., 'add', 'sub')
let n2 = ''; // Stores the second number of an operation (implicitly from display)
let resetDisp = false; // Flag: true if the display should be cleared before the next digit input
let resDisp = false; // Flag: true if a calculation result is currently displayed

// --- Helper Function to Update Display ---
const updateDisp = (value) => {
    // If the value is a number and has many decimal places, round it.
    if (typeof value === 'number' && value.toString().length > 10) {
        disp.textContent = parseFloat(value.toFixed(8)); // Round to 8 decimal places
    } else {
        disp.textContent = value;
    }
};

// --- Function to Clear Calculator State ---
const clearCalc = () => {
    n1 = '';
    op = null;
    n2 = '';
    resetDisp = false;
    resDisp = false;
    updateDisp('0'); // Reset display to '0'
};

// --- Button Configuration Data ---
// This array defines the text, type, value, and specific CSS classes for each button.
const buttonConfig = [
    { text: 'C', type: 'action', value: 'clr', classMod: 'clr-btn' },
    { text: '←', type: 'action', value: 'back' },
    { text: '/', type: 'operator', value: 'div', classMod: 'op-btn' },
    { text: '7', type: 'number', value: '7' },
    { text: '8', type: 'number', value: '8' },
    { text: '9', type: 'number', value: '9' },
    { text: '*', type: 'operator', value: 'mul', classMod: 'op-btn' },
    { text: '4', type: 'number', value: '4' },
    { text: '5', type: 'number', value: '5' },
    { text: '6', type: 'number', value: '6' },
    { text: '-', type: 'operator', value: 'sub', classMod: 'op-btn' },
    { text: '1', type: 'number', value: '1' },
    { text: '2', type: 'number', value: '2' },
    { text: '3', type: 'number', value: '3' },
    { text: '+', type: 'operator', value: 'add', classMod: 'op-btn' },
    { text: '0', type: 'number', value: '0', classMod: 'zero-btn' },
    { text: '.', type: 'action', value: 'dec' },
    { text: '=', type: 'action', value: 'eq', classMod: 'eq-btn' }
];

// --- Dynamic Button Creation ---
// This function iterates through the buttonConfig and creates each button element.
const createButtons = () => {
    buttonConfig.forEach(btnData => {
        const button = document.createElement('button'); // Create a new button element
        button.textContent = btnData.text; // Set the visible text of the button
        button.classList.add('calc-btn'); // Add the base button styling class

        // Add specific styling classes if defined in config
        if (btnData.classMod) {
            button.classList.add(btnData.classMod);
        }

        // Set data attributes based on button type
        if (btnData.type === 'number') {
            button.dataset.num = btnData.value; // For numbers, use data-num
        } else {
            button.dataset.act = btnData.value; // For operators and actions, use data-act
        }

        // Append the newly created button to the calculator grid
        calcGrid.appendChild(button);
    });
};

// --- Event Listener for Button Clicks (Delegation) ---
// Attach a single event listener to the parent calculator grid to handle all button clicks.
// This is more efficient than attaching listeners to each individual button.
calcGrid.addEventListener('click', (e) => {
    // Ensure the clicked element is a button and not the display or grid itself
    if (!e.target.classList.contains('calc-btn')) {
        return;
    }

    const btnText = e.target.textContent;
    const btnAction = e.target.dataset.act; // Action for operators/actions
    const btnNumber = e.target.dataset.num; // Number for digits

    // Determine if it's a number button
    const isNumberBtn = btnNumber !== undefined;

    // --- Handle Number Button Clicks ---
    if (isNumberBtn) {
        if (resetDisp || resDisp) {
            disp.textContent = btnNumber; // Use btnNumber directly
            resetDisp = false;
            resDisp = false;
        } else {
            if (disp.textContent === '0' && btnNumber === '0') {
                return;
            }
            if (disp.textContent === '0' && btnNumber !== '0' && btnNumber !== '.') {
                disp.textContent = btnNumber;
            } else {
                disp.textContent += btnNumber;
            }
        }
    }
    // --- Handle Decimal Button Click ---
    else if (btnAction === 'dec') {
        if (resetDisp || resDisp) {
            disp.textContent = '0.';
            resetDisp = false;
            resDisp = false;
        } else if (!disp.textContent.includes('.')) {
            disp.textContent += '.';
        }
    }
    // --- Handle Clear Button Click ---
    else if (btnAction === 'clr') {
        clearCalc();
    }
    // --- Handle Backspace Button Click ---
    else if (btnAction === 'back') {
        if (disp.textContent.length > 1) {
            disp.textContent = disp.textContent.slice(0, -1);
        } else {
            disp.textContent = '0';
        }
        if (disp.textContent === '0' && resDisp) {
            resDisp = false;
            n1 = '';
            n2 = '';
            op = null;
        }
    }
    // --- Handle Equals Button Click ---
    else if (btnAction === 'eq') {
        if (n1 && op) {
            n2 = disp.textContent;
            let result = calcOp(op, n1, n2);

            if (result === "Error: Div by 0!") {
                updateDisp(result);
                n1 = '';
                n2 = '';
                op = null;
                resetDisp = true;
                resDisp = true;
            } else {
                updateDisp(result);
                n1 = result;
                n2 = '';
                op = null;
                resetDisp = true;
                resDisp = true;
            }
        }
    }
    // --- Handle Operator Button Clicks (+, -, *, /) ---
    else if (['add', 'sub', 'mul', 'div'].includes(btnAction)) {
        if (resDisp) {
            n1 = disp.textContent;
            op = btnAction;
            resetDisp = true;
            resDisp = false;
            return;
        }

        if (n1 && op) {
            n2 = disp.textContent;
            let result = calcOp(op, n1, n2);

            if (result === "Error: Div by 0!") {
                updateDisp(result);
                n1 = '';
                n2 = '';
                op = null;
                resetDisp = true;
                resDisp = true;
            } else {
                updateDisp(result);
                n1 = result;
                op = btnAction;
                resetDisp = true;
            }
        } else {
            n1 = disp.textContent;
            op = btnAction;
            resetDisp = true;
        }
    }
});

// --- Initialization ---
// Call createButtons to generate all calculator buttons when the script loads.
createButtons();
// Clear the calculator state and set initial display to '0'.
clearCalc();