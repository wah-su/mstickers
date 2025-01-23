const config = require("./config");
const fs = require("fs");
const path = require("path");
const { log, CreateImageURL, CreatePackDescription } = require("./utils");
let ejs = require("ejs");

let PackIndex = null;
let Packs = [];

const isDev = process.env.DEVMODE || false;
log("INFO", `DEV MODE ENABLED: ${isDev}`);

const InpPath = path
  .join(__dirname, "../", config.stickerPacksDir, "./")
  .trim();
const OutPath = path.join(__dirname, "../", config.outDir, "./").trim();
const ParPath = path.join(__dirname, "../", "./").trim();
log("INFO", `Sticker sets directory: ${InpPath}`);
log("INFO", `Output directory: ${OutPath}`);
log("INFO", `Working directory: ${ParPath}`);

const dirents = fs.readdirSync(InpPath, { withFileTypes: true });
const files = dirents
  .filter((dirent) => dirent.isFile())
  .filter(
    (dirent) => dirent.name.endsWith(".json") && dirent.name != "index.json"
  )
  .map((dirent) => dirent.name);
if (files.length == 0) {
  log("error", "No sticker sets found!");
  process.exit(1);
}
log("INFO", `Found: ${files.length} sticker sets`);

PackIndex = {
  homeserver_url: config.homeserverUrl,
  packs: files,
};
fs.writeFileSync(
  config.stickerPacksDir + "/index.json",
  JSON.stringify(PackIndex)
);
log("INFO", `Updated "index.json" in sticker sets directory`, true);

if (OutPath != ParPath) {
  if (!fs.existsSync(OutPath)) fs.mkdirSync(OutPath);
  fs.cpSync(`${ParPath}static`, `${OutPath}static`, { recursive: true });
  log("INFO", `Copied static directory to output directory`);
}

PackIndex.packs.forEach((pack) => {
  const packFile = JSON.parse(fs.readFileSync(`${InpPath}${pack}`));
  const Template = fs.readFileSync(
    path.join(ParPath, "src/templates/Base.ejs")
  );
  const html = ejs.render(
    Template.toString(),
    {
      title: packFile.title,
      description: CreatePackDescription(packFile),
      image: {
        url: CreateImageURL(config.homeserverUrl, packFile.stickers[0].id),
        mimetype: packFile.stickers[0].info.mimetype,
        w: packFile.stickers[0].info.w,
        h: packFile.stickers[0].info.h,
        alt: packFile.stickers[0].info.alt,
      },
      path: config.outDir ? `/${config.outDir}` : "",
      isDev,
      stickerset: packFile,
      page: "stickerset",
      pagePath: `/${packFile.id}/`,
      homeserverUrl: config.homeserverUrl,
      baseUrl: config.baseUrl
    },
    { root: path.join(ParPath, "src/templates") }
  );
  if (!fs.existsSync(`${OutPath}${packFile.id}`)) fs.mkdirSync(`${OutPath}${packFile.id}`);
  fs.writeFileSync(`${OutPath}${packFile.id}/index.html`, html);
  Packs.push({
    id: packFile.id,
    name: packFile.title,
    image: packFile.stickers[0].id,
    author:
      packFile.hasOwnProperty("author") && packFile.author
        ? packFile.author.name
        : null,
    rating: packFile.hasOwnProperty("rating") ? packFile.rating : null,
    stickers: packFile.stickers.length,
  });
  log(
    "INFO",
    `Created preview for sticker set: ${packFile.title} (${packFile.id})`
  );
});

const indexTemplate = fs.readFileSync(
  path.join(ParPath, "src/templates/Base.ejs")
);
const html = ejs.render(
  indexTemplate.toString(),
  {
    title: "TG -> Matrix Stickers Index",
    description: `Available ${PackIndex.packs.length} sticker packs`,
    image: {
      url: "./static/images/sticker.png",
      mimetype: "image/png",
      w: "96",
      h: "96",
      alt: "",
    },
    path: config.outDir ? `/${config.outDir}` : "",
    isDev,
    stickerset: null,
    page: "index",
    pagePath: "/",
    packs: Packs,
    homeserverUrl: config.homeserverUrl,
    baseUrl: config.baseUrl
  },
  { root: path.join(ParPath, "src/templates") }
);
fs.writeFileSync(`${OutPath}index.html`, html);
log("INFO", "Generation complete");
