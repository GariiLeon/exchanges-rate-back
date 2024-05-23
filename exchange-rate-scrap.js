const https = require("https");
const cheerio = require("cheerio");

const URL_EXCHANGE_RATE_SOURCE_HTML =
  "https://mcb.mg/webapi/mcb/getforexRate?c=MGA";

function getExchangeRateData() {
  let currencyData = "";
  return new Promise((resolve, reject) => {
    https.get(URL_EXCHANGE_RATE_SOURCE_HTML, (res) => {
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

async function getExchangesRate() {
  const html = await getExchangeRateData();
  if (!html.Html) return null;
  const $ = cheerio.load(html.Html);
  const tableElements = $("table").find("tr");

  let exchanges = {};

  tableElements.each(function () {
    const $tds = $(this).find("td");
    const tdsText = [];
    $tds.each(function () {
      tdsText.push($(this).text());
    });

    if (tdsText.length > 0) {
      const libelle = tdsText[0];
      const data = {
        libelle,
        buy: tdsText[1],
        sell: tdsText[2],
      };
      exchanges[libelle.toLowerCase()] = data;
    }
  });

  let date = $("p#rate-date > small").text();
  date = await formatFrenchDate(date);
  return {
    date,
    exchanges,
  };
}

function formatFrenchDate(date) {
  const dateParts = date.split("/");
  if (dateParts.length !== 3) {
    return new Date().toISOString.split("T")[0];
  }

  const day = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1;
  const year = parseInt(dateParts[2], 10);

  const newDateObject = new Date(year, month, day, 12);
  return newDateObject.toISOString().split("T")[0];
}

exports.getExchangesRate = getExchangesRate;
