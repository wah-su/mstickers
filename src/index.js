const config = require("./config");
const fs = require("fs");

const _CreatePackPage = require("./templates/pack");
const _CreatePacksIndex = require("./templates/index");

function GenerateStaticSite() {
    let PackIndex = null
    let Packs = [];

    try {
        PackIndex = JSON.parse(fs.readFileSync(config.stickerPacksDir + "/index.json"));
    } catch (e) {
        console.error("No index.json found!");
        process.exit(1);
    }

    if (!fs.existsSync(config.outDir)) fs.mkdirSync(config.outDir);

    PackIndex.packs.forEach((pack) => {
        const packFile = JSON.parse(fs.readFileSync(config.stickerPacksDir + "/" + pack));
        if (!fs.existsSync(config.outDir + "/" + packFile.id)) fs.mkdirSync(config.outDir + "/" + packFile.id);
        fs.writeFileSync(config.outDir + "/" + packFile.id + "/index.html", _CreatePackPage(PackIndex, packFile));
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
    fs.writeFileSync(config.outDir + "/index.html", _CreatePacksIndex(PackIndex, Packs));
    console.log("Generation complete");

}

GenerateStaticSite();
module.exports = GenerateStaticSite