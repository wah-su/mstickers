const chokidar = require("chokidar");
const exec = require("child_process");

function onChange() {
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
  });
}

const watcher = chokidar.watch("./src/templates", {
  ignored: (path, stats) =>
    stats?.isFile() && !(path.endsWith(".js") || path.endsWith(".json")),
  // atomic: true,
  awaitWriteFinish: true,
  persistent: true,
});
watcher.on("add", (path) => {
  console.log(`File ${path} has been added, rebuilding...`);
  onChange();
});
watcher.on("change", (path) => {
  console.log(`File ${path} has been changed, rebuilding...`);
  onChange();
});
watcher.on("unlink", (path) => {
  console.log(`File ${path} has been removed, rebuilding...`);
  onChange();
});
