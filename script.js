function appendToDisplay(value) {
    document.getElementById("display").value += value;
}

function clearDisplay() {
    document.getElementById("display").value = "";
}

function deleteLast() {
    let display = document.getElementById("display");
    display.value = display.value.slice(0, -1);
}

function calculate() {
    try {
        let expression = document.getElementById("display").value;
        let originalExpression = expression;

        // Handle exponentiation
        expression = expression.replace(/\^/g, "**");

        // Handle square root
        expression = expression.replace(/√(\d+)/g, "Math.sqrt($1)");

        // Handle factorial
        expression = expression.replace(/(\d+)!/g, (match, num) => factorial(parseInt(num)));

        // Handle trigonometric functions (degrees → radians)
        expression = expression.replace(/sin\((.*?)\)/g, "Math.sin(($1) * Math.PI / 180)");
        expression = expression.replace(/cos\((.*?)\)/g, "Math.cos(($1) * Math.PI / 180)");
        expression = expression.replace(/tan\((.*?)\)/g, "Math.tan(($1) * Math.PI / 180)");

        let result = eval(expression);
        document.getElementById("display").value = result;
        addToHistory(originalExpression + " = " + result);
    } catch (e) {
        alert("Invalid Input");
    }
}

function factorial(n) {
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
}

function addToHistory(entry) {
    let historyList = document.getElementById("history-list");
    let newEntry = document.createElement("li");
    newEntry.textContent = entry;
    newEntry.onclick = function () {
        document.getElementById("display").value = entry.split(" = ")[0];
    };
    historyList.appendChild(newEntry);
    saveHistory();
}

function saveHistory() {
    let history = [];
    document.querySelectorAll("#history-list li").forEach((item) => {
        history.push(item.textContent);
    });
    localStorage.setItem("calcHistory", JSON.stringify(history));
}

function clearHistory() {
    document.getElementById("history-list").innerHTML = "";
    localStorage.removeItem("calcHistory");
}

window.onload = function () {
    let savedHistory = JSON.parse(localStorage.getItem("calcHistory"));
    if (savedHistory) {
        savedHistory.forEach((item) => {
            addToHistory(item);
        });
    }

    let savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }
};

document.getElementById("theme-btn").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    let mode = document.body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("theme", mode);
});
