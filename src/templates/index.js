const { CreateImageURL, InjectWSConnection } = require("../utils");

function _PackLink(index, pack) {

    let packRating = "";

    if (pack.rating) {
        if (pack.rating.toLowerCase() === "safe") {
            packRating = `<span class="text-green-400">S</span>`;
        } else if (pack.rating.toLowerCase() === "questionable") {
            packRating = `<span class="text-yellow-500">Q</span>`;
        } else if (pack.rating.toLowerCase() === "explicit") {
            packRating = `<span class="text-red-500">E</span>`;
        }
    }

    return `
<a class="bg-stone-800 text-zinc-100 p-4 rounded-lg w-full flex flex-row gap-2" href="./${pack.id}/">

    <div class="w-24 h-24 flex justify-center items-center">

        <div role="status" data-spinner-id="${pack.image}">
            <svg
                aria-hidden="true"
                class="inline w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
                />
                <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
                />
            </svg>
            <span class="sr-only">Loading...</span>
        </div>
        <img
            src="${CreateImageURL(index, pack.image)}"
            alt=""
            class="object-contain w-24 h-24 hidden"
            data-image-id="${pack.image}"
        />
    </div>

    <div class="flex flex-col gap-1 justify-center">
        <p class="text-bold text-2xl">${pack.name}</p>
        ${pack.author ? `<p class="text-xl">${pack.author}</p>` : ""}
        <p class="text-xl">${pack.stickers} stickers ${pack.rating ? "| " + packRating : ""}</p>
    </div>

</a>
`
}

function _CreatePacksIndex(index, packs, isDev) {

    let packLinks = [];
    packs.forEach((packLink) => packLinks.push(_PackLink(index, packLink)));

    return `
        <div class="container flex flex-col items-center justify-center min-h-screen gap-4 p-4 mx-auto">
            <div class="gap-2 [grid-template-columns:100%] md:[grid-template-columns:repeat(auto-fill,minmax(380px,500px))] justify-center items-center grid w-full">
                ${packLinks.join("\n")}
            </div>
        </div>

        <script src="../static/RenderImages.js"></script>
`
}

module.exports = _CreatePacksIndex