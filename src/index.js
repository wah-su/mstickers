const config = require("./config");
const fs = require("fs");

const _CreatePackPage = require("./templates/pack");

function GenerateStaticSite() {
    let PackIndex = null

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
        console.log("preview for " + packFile.id + " created");
    })
}

GenerateStaticSite();
module.exports = GenerateStaticSite