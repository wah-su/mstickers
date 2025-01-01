function PackLinks(pack) {
    return `
        <a class="bg-[#2f7ca3] gap-2 items-center w-full px-8 py-4 rounded-lg flex hover:scale-105 transition-transform" href="https://t.me/addstickers/${pack.id}">
            <img src="../static/images/telegram.png" alt="" class="object-contain w-10" />
            <p class="text-2xl text-slate-50">Telegram</p>
        </a>
        <button class="bg-[#259d7b] gap-2 items-center w-full px-8 py-4 rounded-lg flex hover:scale-105 transition-transform" onclick="toggleElementInstruction()">
            <img src="../static/images/element.png" alt="" class="object-contain w-10" />
            <p class="text-2xl text-slate-50">Element</p>
        </button>
        ${(pack.hasOwnProperty("room_id") && pack.room_id) ? (
        `
        <a class="bg-[#282443] gap-2 items-center w-full px-8 py-4 rounded-lg flex hover:scale-105 transition-transform" href="https://matrix.to/#/${pack.room_id}">
            <img src="../static/images/fluffychat.png" alt="" class="object-contain w-10" />
            <p class="text-2xl text-slate-50">FluffyChat</p>
        </a>
        <a class="bg-[#373737] gap-2 items-center w-full px-8 py-4 rounded-lg flex hover:scale-105 transition-transform" href="https://matrix.to/#/${pack.room_id}">
            <img src="../static/images/cinny.png" alt="" class="object-contain w-10" />
            <p class="text-2xl text-slate-50">Cinny</p>
        </a>
        `
        )
        : ""}
`}

module.exports = PackLinks