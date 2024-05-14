const http = require("http");
const exchangeScrap = require("./exchange-scrap");

const port = "3737";

const exchanges = exchangeScrap.getExchanges();

const server = http.createServer(async function (req, res) {
  const url = req.url;
  if (url == "/exchanges") {
    const todaysDate = new Date().toISOString().split("T")[0];
    const data =
      todaysDate === exchanges.date
        ? exchanges
        : await exchangeScrap.getExchanges();
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(JSON.stringify(data));
  } else {
    res.writeHead(204, { "Content-type": "application/json" });
    res.end(JSON.stringify({}));
  }
});

server.listen(port);
