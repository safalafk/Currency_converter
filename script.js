const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const fromAmount = document.getElementById("fromAmount");
const toAmount = document.getElementById("toAmount");
const resultBox = document.getElementById("resultBox");
const swapBtn = document.getElementById("swapBtn");
const fromFlag = document.getElementById("fromFlag");
const toFlag = document.getElementById("toFlag");

// Currency to country mapping for flags
const currencyCountry = {
    USD: "us",
    EUR: "eu",
    GBP: "gb",
    JPY: "jp",
    AUD: "au",
    CAD: "ca",
    CHF: "ch",
    CNY: "cn",
    INR: "in",
    NZD: "nz"
};

// Load currencies
async function loadCurrencies() {
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    const data = await res.json();
    const currencies = Object.keys(data.rates);

    currencies.forEach(cur => {
        let opt1 = new Option(`${cur}`, cur);
        let opt2 = new Option(`${cur}`, cur);
        fromCurrency.add(opt1);
        toCurrency.add(opt2);
    });

    fromCurrency.value = "USD";
    toCurrency.value = "EUR";
    updateFlag(fromFlag, fromCurrency.value);
    updateFlag(toFlag, toCurrency.value);
}

// Update flag
function updateFlag(imgElement, currency) {
    const countryCode = currencyCountry[currency] || currency.slice(0, 2).toLowerCase();
    imgElement.src = `https://flagcdn.com/w20/${countryCode}.png`;
}

// Convert currency
async function convertCurrency() {
    const from = fromCurrency.value;
    const to = toCurrency.value;
    const amount = parseFloat(fromAmount.value);

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount");
        return;
    }

    const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
    const data = await res.json();
    const rate = data.rates[to];
    const converted = (amount * rate).toFixed(3);

    toAmount.value = converted;
    resultBox.style.display = "block";
    resultBox.innerHTML = `${to} ${converted}<br><small>${amount} ${from} = ${converted} ${to}</small>`;
}

// Swap currencies
swapBtn.addEventListener("click", () => {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    updateFlag(fromFlag, fromCurrency.value);
    updateFlag(toFlag, toCurrency.value);
    convertCurrency();
});

// Change flag when currency changes
fromCurrency.addEventListener("change", () => updateFlag(fromFlag, fromCurrency.value));
toCurrency.addEventListener("change", () => updateFlag(toFlag, toCurrency.value));

document.getElementById("convertBtn").addEventListener("click", convertCurrency);

loadCurrencies();
