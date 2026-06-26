const display = document.getElementById("display");
const history = document.getElementById("history");
const buttons = document.querySelectorAll(".btn");

let expression = "";

// -------------------------
// Update Display
// -------------------------

function updateDisplay() {
    display.value = expression || "0";
}

// -------------------------
// Check if operator
// -------------------------

function isOperator(char) {
    return ["+", "-", "*", "/", "%"].includes(char);
}

// -------------------------
// Button Clicks
// -------------------------

buttons.forEach(button => {

    button.addEventListener("click", () => {

        const value = button.dataset.value;

        switch (value) {

            case "AC":
                expression = "";
                history.textContent = "";
                updateDisplay();
                break;

            case "DEL":
                expression = expression.slice(0, -1);
                updateDisplay();
                break;

            case "=":
                calculate();
                break;

            default:
                appendValue(value);

        }

    });

});

// -------------------------
// Append Value
// -------------------------

function appendValue(value) {

    const lastChar = expression.slice(-1);

    // Prevent multiple operators
    if (isOperator(value) && isOperator(lastChar)) {

        expression =
            expression.slice(0, -1) + value;

        updateDisplay();
        return;
    }

    // Prevent multiple decimal points
    if (value === ".") {

        const parts = expression.split(/[\+\-\*\/%]/);

        const currentNumber =
            parts[parts.length - 1];

        if (currentNumber.includes(".")) {
            return;
        }
    }

    expression += value;

    updateDisplay();

}

// -------------------------
// Calculate
// -------------------------

function calculate() {

    if (expression === "")
        return;

    try {

        let exp = expression;

        // Convert percentage
        exp = exp.replace(/(\d+(\.\d+)?)%/g, "($1/100)");

        const result = Function(
            '"use strict";return (' + exp + ')'
        )();

        if (!isFinite(result)) {
            throw Error();
        }

        history.textContent =
            expression + " =";

        expression =
            result.toString();

        updateDisplay();

    }

    catch {

        display.value = "Error";

        expression = "";

    }

}

// -------------------------
// Keyboard Support
// -------------------------

document.addEventListener("keydown", e => {

    const key = e.key;

    if (
        /[0-9]/.test(key) ||
        key === "." ||
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/" ||
        key === "%"
    ) {

        appendValue(key);

    }

    else if (key === "Enter") {

        e.preventDefault();
        calculate();

    }

    else if (key === "Backspace") {

        expression =
            expression.slice(0, -1);

        updateDisplay();

    }

    else if (key === "Delete" || key === "Escape") {

        expression = "";
        history.textContent = "";
        updateDisplay();

    }

});

// -------------------------
// Initial Display
// -------------------------

updateDisplay();