const http = require("http");
const url = require("url");
const { URLSearchParams } = require("url");

const exchangeScrap = require("./exchange-scrap");
const exchangesApi = require("./exhanges");

const port = "3737";

const exchanges = exchangeScrap.getExchanges();

const server = http.createServer(async function (req, res) {
  const _url = url.parse(req.url);
  if (_url.pathname == "/exchanges-scrap") {
    const todaysDate = new Date().toISOString().split("T")[0];
    const data =
      todaysDate === exchanges.date
        ? exchanges
        : await exchangeScrap.getExchanges();
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(JSON.stringify(data));
  } else if (_url.pathname == "/exchanges") {
    let _q = new URLSearchParams(_url.query);
    const exchangeData = await exchangesApi.getExchanges(
      _q.get("source"),
      _q.get("target")
    );
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(JSON.stringify(exchangeData));
  } else {
    res.writeHead(204, { "Content-type": "application/json" });
    res.end(JSON.stringify({}));
  }
});

server.listen(port);
