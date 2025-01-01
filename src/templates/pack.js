const Head = require("./components/head");
const PackCard = require("./components/packCard");
const PackLinks = require("./components/PackLinks");

function _CreatePackPage(index, pack) {
    return `
<html>

    <head>
        ${Head(index, pack)}
    </head>

    <body class="overflow-x-hidden">

        <div class="fixed inset-0 min-h-screen -z-10 tiledBackground"></div>
        <div class="fixed inset-0 min-h-screen -z-20 bg-gradient-to-b from-gray-900 to-black"></div>

        <div class="container flex flex-col items-center justify-center min-h-screen gap-4 p-4 mx-auto">
            ${PackCard(index, pack)}
            <div class="flex flex-col gap-2 justify-center w-full md:w-[768px]">
                ${PackLinks(pack)}
            </div>

        </div>

        <div class="fixed inset-0 z-10 hidden min-h-screen bg-black opacity-40" id="preview_sticker_pack_add_to_element_overlay"></div>
        <div class="fixed top-8 md:top-32 w-full md:max-w-[768px] left-1/2 -translate-x-1/2 text-white z-20 hidden flex-col gap-4 p-4 rounded-lg shadow-lg bg-stone-900" id="preview_sticker_pack_add_to_element">
            <p>
                Type /devtools in chat. Other -> Explore account data in Element Web (not "room account data", must be the global one), edit the m.widgets account data event to have the following content:
            </p>
            <p class="md:whitespace-pre">
{
    "stickerpicker": {
        "content": {
            "type": "m.stickerpicker",
            "url": "https://matrix.wah.su/stickerpicker/?theme=$theme",
            "name": "Stickerpicker",
            "creatorUserId": "@you:matrix.server.name",
            "data": {}
        },
        "sender": "@you:matrix.server.name",
        "state_key": "stickerpicker",
        "type": "m.widget",
        "id": "stickerpicker"
    }
}
            </p>
            <p>
                If you do not yet have a m.widgets event, simply create it with that content. You can also use the client-server API directly instead of using Element Web.
            <br />
            <br />
                The theme=$theme query parameter will make the widget conform to Element's theme automatically. You can also use light, dark or black instead of $theme to always use a specific theme.
            </p>
            <button class="flex items-center justify-center w-full py-2 text-2xl bg-red-600 rounded-lg" onclick="toggleElementInstruction()">Close</button>
        </div>
        <script src="../static/RenderImages.js"></script>
        <script src="../static/OpenPopUp.js"></script>
    </body>

</html>
    `
}

module.exports = _CreatePackPage