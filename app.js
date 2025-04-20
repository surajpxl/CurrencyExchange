const BASE_URL =
  "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }
  const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}/${toCurr.value.toLowerCase()}.json`;
  let response = await fetch(URL);
  let data = await response.json();
  let rate = data[toCurr.value.toLowerCase()];

  let finalAmount = amtVal * rate;
  msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});

document.querySelector("button").addEventListener("click", function (event) {
  event.preventDefault(); // Prevent form submission

  const fromCurrency = document.querySelector('select[name="from"]').value;
  const toCurrency = document.querySelector('select[name="to"]').value;
  const amount = document.querySelector('.amount input').value;

  if (!fromCurrency || !toCurrency || isNaN(amount) || amount <= 0) {
    alert("Please enter valid input values.");
    return;
  }

  // Fetch exchange rate from an API
  fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch exchange rate.");
      }
      return response.json();
    })
    .then((data) => {
      const exchangeRate = data.rates[toCurrency];
      if (!exchangeRate) {
        alert("Exchange rate not available for the selected currencies.");
        return;
      }
      const convertedAmount = (amount * exchangeRate).toFixed(2);
      document.querySelector(".msg").textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
    })
    .catch((error) => {
      console.error(error);
      alert("An error occurred while fetching the exchange rate.");
    });
});