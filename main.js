const http = require("http");

const port = "3737";

const url_to_scrap = "https://mcb.mg";

const server = http.createServer(function (req, res) {
  res.writeHead(200, { "Content-type": "application/json" });
  res.end(JSON.stringify({ res: "ok" }));
});

server.listen(port);
