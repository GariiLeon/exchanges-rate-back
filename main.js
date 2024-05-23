const http = require("http");
const url = require("url");
const { URLSearchParams } = require("url");

const exchangeScrap = require("./exchange-scrap");
const exchangesApi = require("./exhanges");
const exchangesRateScrap = require("./exchange-rate-scrap");

const port = "3737";

// const exchanges = exchangeScrap.getExchanges();

const exchangesRate = exchangesRateScrap.getExchangesRate();

const server = http.createServer(async function (req, res) {
  const _url = url.parse(req.url);
  const todaysDate = new Date().toISOString().split("T")[0];
  switch (_url.pathname) {
    case "/exchanges-scrap": {
      const data =
        todaysDate === exchanges.date
          ? exchanges
          : await exchangeScrap.getExchanges();
      res.writeHead(200, { "Content-type": "application/json" });
      res.end(JSON.stringify(data));
      break;
    }
    case "/exchanges": {
      if (_url.query) {
        let _q = new URLSearchParams(_url.query);
        const exchangeData = await exchangesApi.getExchanges(
          _q.get("source"),
          _q.get("target")
        );
        res.writeHead(200, { "Content-type": "application/json" });
        res.end(JSON.stringify(exchangeData));
        break;
      }
    }
    case "/exchanges-rate": {
      const data =
        todaysDate === exchangesRate.date
          ? exchangesRate
          : await exchangesRateScrap.getExchangesRate();
      res.writeHead(200, { "Content-type": "application/json" });
      res.end(JSON.stringify(data));
      break;
    }
    default: {
      res.writeHead(204, { "Content-type": "application/json" });
      res.end(JSON.stringify({}));
      break;
    }
  }
});

server.listen(port);
