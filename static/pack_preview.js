const packPreview = document.getElementById("preview_sticker_pack");
const packName = document.getElementById("preview_sticker_pack_name");
const packAuthor_by = document.getElementById("preview_sticker_pack_author_by");
const packAuthor = document.getElementById("preview_sticker_pack_author");
const packImage = document.getElementById("preview_sticker_pack_image");
const packStickersC = document.getElementById(
  "preview_sticker_pack_stickers_container"
);
const packStickersCount = document.getElementById(
  "preview_sticker_pack_stickers_count"
);
const packStickers = document.getElementById("preview_sticker_pack_stickers");
const packLinkTG = document.getElementById("preview_sticker_pack_add_tg");
const packLinkFC = document.getElementById("preview_sticker_pack_add_fc");
const packLinkCI = document.getElementById("preview_sticker_pack_add_ci");
const ElementInstructionOV = document.getElementById(
  "preview_sticker_pack_add_to_element_overlay"
);
const ElementInstruction = document.getElementById(
  "preview_sticker_pack_add_to_element"
);

const stickerpacksIndexContainer =
  document.getElementById("stickerpacks_index");

let index = null;
const searchParams = new URLSearchParams(window.location.search);
const pack_id = searchParams.get("id");

async function loadIndex() {
  index = await fetch(`${window.location.origin}/stickerpacks/index.json`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("not found");
      }
      return res.json();
    })
    .then((json) => {
      return json;
    })
    .catch((e) => {
      console.error(e);
      return null;
    });

  if (!pack_id) {
    loadStickerpacks();
  } else if (!index) {
    stickerpacksIndexContainer.classList.remove("hidden");
    stickerpacksIndexContainer.innerHTML = "no index.json found";
  } else {
    loadPack(pack_id);
  }
}

function imageIsLoaded(img_id, img_placeholder) {
  const __img = document.getElementById(img_id);
  const __img_placeholder = document.getElementById(img_placeholder);
  if (__img.complete) {
    __img_placeholder.classList.add("hidden");
    __img.classList.remove("hidden");
  }
}

async function loadStickerpacks() {
  stickerpacksIndexContainer.classList.remove("hidden");
  stickerpacksIndexContainer.classList.add("grid");
  for (let i = 0; i < index.packs.length; i++) {
    const data = await fetch(
      `${window.location.origin}/stickerpacks/${index.packs[i]}`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("not found");
        }
        return res.json();
      })
      .then((json) => {
        return json;
      })
      .catch((e) => {
        console.error(e);
        return null;
      });
    if (!data) {
      continue;
    }
    const _tmp_id = data.stickers[0].id;
    stickerpacksIndexContainer.innerHTML += `
    <a href="index.html?id=${index.packs[i].split(".json")[0]}">
      <div class="flex gap-4 items-center bg-stone-800 text-slate-200 p-4 rounded-lg">
            <img src="${getStickerImage(data.stickers[0].id)}" alt="${
      data.stickers[0].body
    }" class="hidden object-contain w-24" id="${_tmp_id}"/>
      <img src="static/images/sticker.png" alt="${
        data.stickers[0].body
      }" class="object-contain w-24" id="${_tmp_id}-placeholder"/>
            <div>
              <p class="text-2xl">${data.title}</p>
              ${
                data.hasOwnProperty("author") && data.author.name
                  ? `<p class="text-xl">${data.author.name}</p>`
                  : ""
              }
            </div>
        </div>
    </a>
      `;
    const __img = document.getElementById(_tmp_id);
    __img.addEventListener("load", () => {
      imageIsLoaded(_tmp_id, `${_tmp_id}-placeholder`);
      __img.removeEventListener("load", this);
    });
  }
}

async function loadPack(pack) {
  const data = await fetch(
    `${window.location.origin}/stickerpacks/${pack}.json`
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error("not found");
      }
      return res.json();
    })
    .then((json) => {
      return json;
    })
    .catch((e) => {
      console.error(e);
      return null;
    });
  packPreview.classList.remove("hidden");
  packPreview.classList.add("flex");
  if (!data) {
    packName.innerHTML = "sticker pack not found";
    return;
  }
  updatePackInfo(data);
}

function getStickerImage(stickerID) {
  const _image_path = `${stickerID.slice(0, 2)}/${stickerID.slice(
    2,
    4
  )}/${stickerID.slice(4)}`;

  return `${index.homeserver_url}/__thumbnail/${_image_path}`;
}

function updatePackInfo(data) {
  packName.innerHTML = data.title;

  if (data.hasOwnProperty("author") && data.author) {
    packAuthor_by.classList.remove("hidden");
    packAuthor.classList.remove("hidden");
    packAuthor.innerHTML = data.author.name;

    if (data.author.url) {
      packAuthor.href = data.author.url;
    }
  }

  packImage.src = getStickerImage(data.stickers[0].id);

  if (data.hasOwnProperty("rating") && data.rating) {
    switch (data.rating.toLowerCase()) {
      case "safe":
        document
          .getElementById("preview_sticker_pack_rating_safe")
          .classList.remove("hidden");
        break;
      case "questionable":
        document
          .getElementById("preview_sticker_pack_rating_ques")
          .classList.remove("hidden");
        break;
      case "explicit":
        document
          .getElementById("preview_sticker_pack_rating_expl")
          .classList.remove("hidden");
        break;
      default:
        break;
    }
  }

  packLinkTG.href = `https://t.me/addstickers/${data.id}`;
  packLinkTG.classList.remove("hidden");
  packLinkTG.classList.add("flex");

  if (data.hasOwnProperty("room_id") && data.room_id) {
    packLinkFC.href = `https://matrix.to/#/${data.room_id}`;
    packLinkCI.href = `https://matrix.to/#/${data.room_id}`;
    packLinkFC.classList.remove("hidden");
    packLinkFC.classList.add("flex");
    packLinkCI.classList.remove("hidden");
    packLinkCI.classList.add("flex");
  }

  packStickersC.classList.remove("hidden");
  packStickersCount.innerHTML = `(${data.stickers.length})`;
  for (let i = 0; i < data.stickers.length; i++) {
    const sticker = data.stickers[i];
    const stickerImage = document.createElement("img");
    const stickerImagePlaceholder = document.createElement("img");
    stickerImagePlaceholder.src = `static/images/sticker.png`;
    stickerImagePlaceholder.id = `${sticker.id}-placeholder`;
    stickerImagePlaceholder.alt = sticker.body;
    stickerImagePlaceholder.classList.add("object-contain", "md:w-20", "w-24");
    packStickers.appendChild(stickerImagePlaceholder);
    stickerImage.src = getStickerImage(sticker.id);
    stickerImage.id = sticker.id;
    stickerImage.alt = sticker.body;
    stickerImage.classList.add("object-contain", "md:w-20", "w-24", "hidden");
    packStickers.appendChild(stickerImage);

    stickerImage.addEventListener("load", () => {
      imageIsLoaded(sticker.id, `${sticker.id}-placeholder`);
      stickerImage.removeEventListener("load", this);
    });
  }
}

function toggleElementInstruction() {
  ElementInstructionOV.classList.toggle("hidden");
  ElementInstruction.classList.toggle("hidden");

  ElementInstruction.classList.toggle("flex");
}

loadIndex();
