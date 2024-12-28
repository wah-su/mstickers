const packPreview = document.getElementById("preview_sticker_pack");
const packName = document.getElementById("preview_sticker_pack_name");
const packAuthor_by = document.getElementById("preview_sticker_pack_author_by");
const packAuthor = document.getElementById("preview_sticker_pack_author");
const packImage = document.getElementById("preview_sticker_pack_image");
const packLinkTG = document.getElementById("preview_sticker_pack_add_tg");
const packLinkFC = document.getElementById("preview_sticker_pack_add_fc");
const packLinkCI = document.getElementById("preview_sticker_pack_add_ci");
const ElementInstructionOV = document.getElementById("preview_sticker_pack_add_to_element_overlay");
const ElementInstruction = document.getElementById("preview_sticker_pack_add_to_element");

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
    packName.innerHTML = "no sticker pack provided";
  } else if (!index) {
    packName.innerHTML = "no index.json found";
  } else {
    loadPack(pack_id);
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

  const _image_id = data.stickers[0].id;
  const _image_path = `${_image_id.slice(0, 2)}/${_image_id.slice(
    2,
    4
  )}/${_image_id.slice(4)}`;

  packImage.src = `${index.homeserver_url}/__thumbnail/${_image_path}`;

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
}

function toggleElementInstruction() {
  ElementInstructionOV.classList.toggle("hidden");
  ElementInstruction.classList.toggle("hidden");

  ElementInstruction.classList.toggle("flex");
}

loadIndex();
