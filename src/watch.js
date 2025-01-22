const chokidar = require("chokidar");
const exec = require("child_process");
const express = require('express');
const path = require('path');
const WebSocket = require('ws');
const fs = require("fs");
const config = require("./config");

let triggered = 0
const delay = 1000
let SIGINTCount = 0

function onChange(wss) {
  if (triggered != 0 && Date.now() - triggered < delay) {
    console.log(` ↳[WARN] Rebuild was triggered less than a ${delay}ms ago!`)
    return
  }
  triggered = Date.now()

  process.env.DEVMODE = true
  exec.exec("npm run build", (error, stdout, stderr) => {
    if (error) {
      console.error(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    if (wss) {
      console.log('Reloading web page...');
      wss.send("RELOAD")
    }
  });
}

function onExit() {
  let folders = null

  if (fs.existsSync(config.stickerPacksDir + "/index.json")) {
    folders = []
    JSON.parse(fs.readFileSync(config.stickerPacksDir + "/index.json"))["packs"].map((pack) => folders.push(pack.replace(".json", "")))

    folders.forEach(
      (folder) => {
        if (fs.existsSync(config.outDir + "/" + folder) ) fs.rmdirSync(config.outDir + "/" + folder, {recursive: true})
        console.log(`Deleted generated folder: "${folder}"`)
      }
    )
  } else {
    console.log("no index.json found, forgot to run build?")
  }

  if (fs.existsSync(config.outDir + "/index.html")) fs.rmSync(config.outDir + "/index.html")
  console.log(`Deleted "index.html" file`)

  process.exit(0)
}

const watcher = chokidar.watch(["./src/templates", "./stickerpacks"], {
  ignored: (filePath, stats) =>
    (stats?.isFile() && !(filePath.endsWith(".js") || filePath.endsWith(".json"))) || filePath.endsWith("index.json"),
  atomic: true,
  awaitWriteFinish: true,
  persistent: true,
});

function startServerWithRebuild() {
  const app = express();
  const folder = path.join(__dirname, '..')
  const wss = new WebSocket.Server({ port: 3001 });

  let WSclient = null

  wss.on('connection', (ws) => {
    WSclient = ws
    ws.send("CONNECTED")
  });

  process.on("SIGINT", () => {
    SIGINTCount += 1
    if (WSclient) {
      async function _closeWS() {
        await WSclient.close()
      }
      _closeWS()
    }
    if (SIGINTCount == 1) {
      console.log("Gracefully shutdown and cleanup...")
      onExit()
    } else if (SIGINTCount >= 3) {
      console.log("Received 3+ SIGINT signals. Force exit...")
      process.exit(0)
    }
  })

  app.use(express.static(folder));
  app.listen(3000, () => {
    console.log(`[INFO] Serving files from folder ${folder}`)
    console.log('[INFO] Express server is running on port 3000');

    watcher
      .on('add', (path) => {
        console.log(`[INFO] File ${path} has been added, rebuilding...`);
        onChange(WSclient);
      })
      .on('change', (path) => {
        console.log(`[INFO] File ${path} has been changed, rebuilding...`);
        onChange(WSclient);
      })
      .on('unlink', (path) => {
        console.log(`[INFO] File ${path} has been removed, rebuilding...`);
        onChange(WSclient);
      });
  });
}

startServerWithRebuild();
