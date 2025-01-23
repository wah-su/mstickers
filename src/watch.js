const chokidar = require("chokidar");
const exec = require("child_process");
const express = require("express");
const path = require("path");
const WebSocket = require("ws");
const fs = require("fs");
const config = require("./config");
const { log } = require("./utils");

let triggered = 0;
const delay = 1000;
let SIGINTCount = 0;

const InpPath = path
  .join(__dirname, "../", config.stickerPacksDir, "./")
  .trim();
const OutPath = path.join(__dirname, "../", config.outDir, "./").trim();
const ParPath = path.join(__dirname, "../", "./").trim();
log("INFO", `Sticker sets directory: ${InpPath}`);
log("INFO", `Output directory: ${OutPath}`);
log("INFO", `Working directory: ${ParPath}`);

function onChange(wss) {
  if (triggered != 0 && Date.now() - triggered < delay) {
    log("WARN", `Rebuild was triggered less than a ${delay}ms ago!`, true);
    return;
  }
  triggered = Date.now();

  process.env.DEVMODE = true;
  exec.exec("npm run build", (error, stdout, stderr) => {
    if (error) {
      log("ERROR", error.message);
      return;
    }
    if (stderr) {
      log("ERROR", stderr);
      return;
    }
    log("INFO", stdout);
    if (wss) {
      log("INFO", "Reloading web page...");
      wss.send("RELOAD");
    }
  });
}

function onExit() {
  let folders = null;

  if (fs.existsSync(`${InpPath}/index.json`)) {
    folders = [];
    JSON.parse(fs.readFileSync(`${InpPath}/index.json`))["packs"].map((pack) =>
      folders.push(pack.replace(".json", ""))
    );

    folders.forEach((folder) => {
      if (fs.existsSync(`${OutPath}${folder}`))
        fs.rmdirSync(`${OutPath}${folder}`, { recursive: true });
      log("INFO", `Deleted generated folder: "${folder}"`);
    });
  } else {
    log("WARN", `no "index.json" found, forgot to run build?`);
  }

  if (fs.existsSync(`${OutPath}index.html`)) fs.rmSync(`${OutPath}index.html`);
  log("INFO", `Deleted "index.html" file`);

  if (fs.existsSync(OutPath) && OutPath != ParPath) {
    fs.rmdirSync(`${OutPath}`, { recursive: true });
    log("INFO", `Deleted output folder`);
  }

  process.exit(0);
}

const watcher = chokidar.watch(["./src", "./stickerpacks", "./static"], {
  ignored: (filePath, stats) => filePath.endsWith("index.json"),
  atomic: true,
  awaitWriteFinish: true,
  persistent: true,
});

function startServerWithRebuild() {
  const app = express();
  const folder = path.join(__dirname, "..");
  const wss = new WebSocket.Server({ port: 3001 });

  let WSclient = null;

  wss.on("connection", (ws) => {
    WSclient = ws;
    ws.send("CONNECTED");
  });

  process.on("SIGINT", () => {
    SIGINTCount += 1;
    if (WSclient) {
      async function _closeWS() {
        await WSclient.close();
      }
      _closeWS();
    }
    if (SIGINTCount == 1) {
      log("LOG", "Gracefully shutdown and cleanup...");
      onExit();
    } else if (SIGINTCount >= 3) {
      log("LOG", "Received 3+ SIGINT signals. Force exit...");
      process.exit(0);
    }
  });

  app.use(express.static(folder));
  app.listen(3000, () => {
    log("INFO", `Serving files from folder ${folder}`);
    log("INFO", "Express server is running on port 3000");

    watcher
      .on("add", (path) => {
        log("INFO", `File ${path} has been added, rebuilding...`);
        onChange(WSclient);
      })
      .on("change", (path) => {
        log("INFO", `File ${path} has been changed, rebuilding...`);
        onChange(WSclient);
      })
      .on("unlink", (path) => {
        log("INFO", `File ${path} has been removed, rebuilding...`);
        onChange(WSclient);
      });
  });
}

startServerWithRebuild();
