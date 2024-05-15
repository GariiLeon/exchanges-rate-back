const https = require("https");
const { URLSearchParams } = require("url");

let currencyData = {};

const EXCHANGES_SOURCE_API = "https://mcb.mg/webapi/mcb/getforexdata";

function getExchanges(sourceCurrency, targetCurrency, date = null) {
  const exchangeKey = sourceCurrency + "to" + targetCurrency;
  let todaysDate = new Date().toISOString().split("T")[0];
  if (date) {
    return searchChangeWithDate(exchangeKey, date);
  }
  let paramsMap = new Map();
  paramsMap.set("currencyCode", sourceCurrency.toUpperCase());
  paramsMap.set("baseCurrency", targetCurrency.toUpperCase());
  const urlParams = new URLSearchParams(paramsMap);
  let currencyData = "";
  return new Promise((resolve, reject) => {
    https.get(EXCHANGES_SOURCE_API + "?" + urlParams.toString(), (res) => {
      res.on("data", (chunk) => {
        currencyData += chunk;
      });
      res.on("end", () => {
        resolve(JSON.parse(currencyData));
      });
      res.on("error", (err) => reject(err));
    });
  });
}

function searchChangeWithDate(exchangeKey, date) {
  return;
}

exports.getExchanges = getExchanges;
