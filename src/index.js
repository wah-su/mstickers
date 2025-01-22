const config = require("./config");
const fs = require("fs");

const _CreatePackPage = require("./templates/pack");
const _CreatePacksIndex = require("./templates/index");

let PackIndex = null
let Packs = [];

const isDev = process.env.DEVMODE || false

const dirents = fs.readdirSync(config.stickerPacksDir, { withFileTypes: true });
const files = dirents
                .filter(dirent => dirent.isFile())
                .filter(dirent => (dirent.name.endsWith(".json") && dirent.name != "index.json"))
                .map(dirent => dirent.name);
if (files.length == 0) {
    console.error("[ERROR] NO Sticker Packs Found!");
    process.exit(1);
}
console.log("[INFO] Found " + files.length + " sticker packs");

PackIndex = {
    homeserver_url: config.homeserverUrl,
    packs: files
}
fs.writeFileSync(config.stickerPacksDir + "/index.json", JSON.stringify(PackIndex));

if (!fs.existsSync(config.outDir)) fs.mkdirSync(config.outDir);

PackIndex.packs.forEach((pack) => {
    const packFile = JSON.parse(fs.readFileSync(config.stickerPacksDir + "/" + pack));
    if (!fs.existsSync(config.outDir + "/" + packFile.id)) fs.mkdirSync(config.outDir + "/" + packFile.id);
    fs.writeFileSync(config.outDir + "/" + packFile.id + "/index.html", _CreatePackPage(PackIndex, packFile, isDev));
    Packs.push({
        id: packFile.id,
        name: packFile.title,
        image: packFile.stickers[0].id,
        author: (packFile.hasOwnProperty("author") && packFile.author) ? packFile.author.name : null,
        rating: packFile.hasOwnProperty("rating") ? packFile.rating : null,
        stickers: packFile.stickers.length
    })
    console.log("preview for " + packFile.id + " created");
})
fs.writeFileSync(config.outDir + "/index.html", _CreatePacksIndex(PackIndex, Packs, isDev));
console.log("Generation complete");
