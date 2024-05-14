const https = require("https");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

const url_to_scrap = "https://mcb.mg";

async function getExchanges() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url_to_scrap);
  const exchangesHtml = await page.content();
  const $ = cheerio.load(exchangesHtml);
  const tableElements = $("div#indicativeRates").find("tr");

  let exchanges = [];

  tableElements.each(function () {
    const $tds = $(this).find("td");
    const tdsText = [];
    $tds.each(function () {
      tdsText.push($(this).text());
    });

    if (tdsText.length > 0) {
      const data = {
        libelle: tdsText[0],
        buy: tdsText[1],
        sell: tdsText[2],
      };
      exchanges.push(data);
    }
  });

  let date = $("div#indicativeRates > p#rate-date > small").text();
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

exports.getExchanges = getExchanges;
