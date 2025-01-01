const {CreateImageURL, CreatePackDescription} = require("../../utils");

function _CreateHead(index, pack) {
    return `
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${pack.title}</title>
<link rel="icon" type="${pack.stickers[0].info.mimetype}" href="${CreateImageURL(index, pack.stickers[0].id)}" />
<meta property="og:title" content="${pack.title}" />
<meta property="og:description" content="${CreatePackDescription(pack)}" />
<meta property="og:type" content="website" />
<meta property="og:image" content="${CreateImageURL(index, pack.stickers[0].id)}" />
<meta property="og:image:type" content="${pack.stickers[0].info.mimetype}" />
<meta property="og:image:width" content="${pack.stickers[0].info.w}" />
<meta property="og:image:height" content="${pack.stickers[0].info.h}" />
<meta property="og:image:alt" content="${pack.stickers[0].body}" />
<link href="../static/tailwind.css" rel="stylesheet">
`}

module.exports = _CreateHead