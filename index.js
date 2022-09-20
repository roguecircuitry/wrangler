import { createServer } from "https";
import { existsSync, mkdirSync, readFileSync } from "fs";
import { MessageType } from "./api/api.js";
import { NodeAPIImpl } from "./api/node.js";
import { parse as parseQueryUrl } from "querystring";
import serveHandler from "serve-handler";
import { dirname, join as pathJoin } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

import { NodeGlobals } from "./nodeglobals.js";
NodeGlobals.__dirname = __dirname;
NodeGlobals.imagedbDir = pathJoin(__dirname, "imagedb");
NodeGlobals.clientDir = pathJoin(__dirname, "client");

function ensureDir(fpath) {
  if (!existsSync(fpath)) {
    mkdirSync(fpath, {
      recursive: true
    });
  }
} //make sure the image database directory exists


ensureDir(NodeGlobals.imagedbDir);
var HTTPStatusCode;

(function (HTTPStatusCode) {
  HTTPStatusCode[HTTPStatusCode["INVALID"] = 400] = "INVALID";
  HTTPStatusCode[HTTPStatusCode["NOT_FOUND"] = 404] = "NOT_FOUND";
  HTTPStatusCode[HTTPStatusCode["OK"] = 200] = "OK";
})(HTTPStatusCode || (HTTPStatusCode = {}));

function respondJson(res, httpCode, msg) {
  res.writeHead(httpCode, {
    "Content-type": "application/json"
  });
  res.end(JSON.stringify(msg));
}

function processApiRequest(req, res) {
  let httpCode = 200;
  let msg;
  let rmsg;
  req.on("data", chunk => {
    try {
      msg = JSON.parse(chunk);

      try {
        rmsg = NodeAPIImpl.handleMessage(msg);
      } catch (ex) {
        rmsg = NodeAPIImpl.createResponse(msg, {
          type: MessageType.ERROR_INVALID,
          description: "received invalid json"
        });
        httpCode = 400;
      }
    } catch (ex) {
      rmsg = NodeAPIImpl.createResponse(msg, {
        type: MessageType.ERROR_INVALID,
        description: "received invalid json"
      });
      httpCode = 400;
    }

    respondJson(res, httpCode, rmsg);
    return;
  }).on("error", err => {
    rmsg = NodeAPIImpl.handleError(msg, err);
    respondJson(res, httpCode, rmsg);
    return;
  }).on("end", () => {
    respondJson(res, 200, {
      type: MessageType.ACK,
      content: undefined,
      id: "0",
      index: 0
    });
  });
}

const connectionTimeoutMillis = 1000;

async function main() {
  console.log("Wrangler");
  let server = createServer({
    key: readFileSync("./ssl.key.pem"),
    cert: readFileSync("./ssl.cert.pem")
  }, async (req, res) => {
    let query = parseQueryUrl(req.url);
    console.log(req.url);

    if (req.url === "/api") {
      processApiRequest(req, res);
    } else {
      serveHandler(req, res, {
        directoryListing: false,
        rewrites: [{
          "source": "",
          "destination": "/test.txt"
        }],
        public: NodeGlobals.clientDir
      });
    } //slow loris attack mitigation, nothing should take longer than 1s, gtfo


    let closed = false;
    res.on("close", () => {
      closed = true;
    });
    setTimeout(() => {
      if (!closed) {
        //random delay just to mess with l33t h8x0rz
        setTimeout(() => {
          respondJson(res, 404, {
            description: `connection took longer than allowed`
          });
          console.warn(`connection took longer than ${connectionTimeoutMillis}, terminating`);
        }, Math.floor(Math.random() * 1000));
      }
    }, connectionTimeoutMillis);
  });
  server.listen(10209);
}

main();