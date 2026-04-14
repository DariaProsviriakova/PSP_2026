window.onload = function () {
    let prefix = '';
    let currentNumber = '';
    let justCalculated = false;

    const outputElement = document.getElementById("result");
    const calculatorElement = document.querySelector('.calculator');
    const resultElement = document.getElementById("result");

    const digitButtons = document.querySelectorAll('[id ^= "btn_digit_"]');

    function getDisplay() {
        return prefix + currentNumber || '0';
    }

    function updateDisplay() {
        outputElement.innerHTML = getDisplay();
    }

    function showResult(value) {
        const str = value.toString();
        if (str.length > 6) {
            outputElement.innerHTML = parseFloat(str).toExponential(6);
        } else {
            outputElement.innerHTML = str || '0';
        }
    }

    function evaluateExpression(expr) {
        if (!/^[0-9+\-x*\/\^\.]+$/.test(expr)) return null;
        try {
            const safeExpr = expr.replace(/x/g, '*').replace(/\^/g, '**');
            const result = Function('"use strict"; return (' + safeExpr + ')')();
            if (!isFinite(result)) return null;
            return result;
        } catch (e) {
            return null;
        }
    }

    function onDigitButtonClicked(digit) {
        if (justCalculated) {
            prefix = '';
            currentNumber = '';
            justCalculated = false;
        }

        if (digit === '.') {
            if (!currentNumber.includes('.')) {
                currentNumber = currentNumber === '' ? '0.' : currentNumber + '.';
            }
        } else {
            currentNumber += digit;
        }
        updateDisplay();
    }

    function onOperatorClicked(op) {
        if (justCalculated) {
            justCalculated = false;
        }

        if (prefix === '' && currentNumber === '') return;

        if (currentNumber === '') {
            prefix = prefix.slice(0, -1) + op;
        } else {
            prefix = prefix + currentNumber + op;
            currentNumber = '';
        }
        updateDisplay();
    }

    function handleUnaryOperation(operation) {
        let currentValue = parseFloat(currentNumber || '0');
        let result;

        if (operation === 'sqrt') {
            if (currentValue < 0) return;
            result = Math.sqrt(currentValue);
        } else if (operation === 'square') {
            result = currentValue * currentValue;
        } else if (operation === 'factorial') {
            if (currentValue < 0 || !Number.isInteger(currentValue) || currentValue > 10) return;
            let fact = 1;
            for (let i = 2; i <= currentValue; i++) fact *= i;
            result = fact;
        } else if (operation === 'sign') {
            result = currentValue * -1;
        } else if (operation === 'percent') {
            result = currentValue / 100;
        }

        currentNumber = result.toString();
        showResult(currentNumber);
    }

    digitButtons.forEach(button => {
        button.onclick = function () {
            onDigitButtonClicked(button.innerHTML);
        }
    });

    const dotButton = document.getElementById("btn_digit_dot");
    if (dotButton) {
        dotButton.onclick = function () {
            onDigitButtonClicked('.');
        }
    }

    const plusButton = document.getElementById("btn_op_plus");
    if (plusButton) plusButton.onclick = () => onOperatorClicked('+');

    const minusButton = document.getElementById("btn_op_minus");
    if (minusButton) minusButton.onclick = () => onOperatorClicked('-');

    const multButton = document.getElementById("btn_op_mult");
    if (multButton) multButton.onclick = () => onOperatorClicked('x');

    const divButton = document.getElementById("btn_op_div");
    if (divButton) divButton.onclick = () => onOperatorClicked('/');

    const powerButton = document.getElementById("btn_op_power");
    if (powerButton) powerButton.onclick = () => onOperatorClicked('^');

    const equalButton = document.getElementById("btn_op_equal");
    if (equalButton) {
        equalButton.onclick = function () {
            if (prefix === '' || currentNumber === '') return;

            const fullExpr = prefix + currentNumber;
            const result = evaluateExpression(fullExpr);
            if (result !== null) {
                prefix = '';
                currentNumber = result.toString();
                justCalculated = true;
                showResult(currentNumber);
            }
        }
    }

    const clearButton = document.getElementById("btn_op_clear");
    if (clearButton) {
        clearButton.onclick = function () {
            prefix = '';
            currentNumber = '';
            justCalculated = false;
            outputElement.innerHTML = '0';
        }
    }

    const backspaceButton = document.getElementById("btn_op_backspace");
    if (backspaceButton) {
        backspaceButton.onclick = function () {
            if (justCalculated) return;
            if (currentNumber !== '') {
                currentNumber = currentNumber.slice(0, -1);
            } else if (prefix !== '') {
                prefix = prefix.slice(0, -1);
            }
            updateDisplay();
        }
    }

    const signButton = document.getElementById("btn_op_sign");
    if (signButton) {
        signButton.onclick = function () {
            if (currentNumber !== '') handleUnaryOperation('sign');
        }
    }

    const percentButton = document.getElementById("btn_op_percent");
    if (percentButton) {
        percentButton.onclick = function () {
            if (currentNumber !== '') handleUnaryOperation('percent');
        }
    }

    const sqrtButton = document.getElementById("btn_op_sqrt");
    if (sqrtButton) {
        sqrtButton.onclick = function () {
            if (currentNumber !== '') handleUnaryOperation('sqrt');
        }
    }

    const squareButton = document.getElementById("btn_op_square");
    if (squareButton) {
        squareButton.onclick = function () {
            if (currentNumber !== '') handleUnaryOperation('square');
        }
    }

    const factorialButton = document.getElementById("btn_op_factorial");
    if (factorialButton) {
        factorialButton.onclick = function () {
            if (currentNumber !== '') handleUnaryOperation('factorial');
        }
    }

    const tripleZeroButton = document.getElementById("btn_op_triple_zero");
    if (tripleZeroButton) {
        tripleZeroButton.onclick = function () {
            if (justCalculated) {
                prefix = '';
                currentNumber = '';
                justCalculated = false;
            }
            currentNumber += '000';
            updateDisplay();
        }
    }

    const changeBgButton = document.getElementById("btn_change_bg_color");
    if (changeBgButton && calculatorElement) {
        const bgColors = ['white', 'black', 'purple'];
        let bgColorIndex = 0;
        changeBgButton.onclick = function () {
            bgColorIndex = (bgColorIndex + 1) % bgColors.length;
            calculatorElement.style.backgroundColor = bgColors[bgColorIndex];
        }
    }

    const changeResultButton = document.getElementById("btn_change_result_color");
    if (changeResultButton && resultElement) {
        const resultColors = ['white', 'black', 'purple'];
        const textColors = ['black', 'pink', 'white'];
        let resultColorIndex = 0;
        changeResultButton.onclick = function () {
            resultColorIndex = (resultColorIndex + 1) % resultColors.length;
            resultElement.style.backgroundColor = resultColors[resultColorIndex];
            resultElement.style.color = textColors[resultColorIndex];
        }
    }

    document.addEventListener('keydown', function (event) {
        const key = event.key;

        if (key >= '0' && key <= '9') onDigitButtonClicked(key);
        if (key === '.') onDigitButtonClicked('.');

        if (key === '+') plusButton?.click();
        if (key === '-') minusButton?.click();
        if (key === '*') multButton?.click();
        if (key === '/') divButton?.click();
        if (key === '^') powerButton?.click();

        if (key === 'Enter' || key === '=') equalButton?.click();
        if (key === 'Escape') clearButton?.click();
        if (key === 'Backspace') backspaceButton?.click();
    });

    console.log("Калькулятор успешно загружен!");
};

