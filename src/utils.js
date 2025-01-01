function CreateImageURL(index, id) {
  return `${index.homeserver_url}${id.slice(0, 2)}/${id.slice(2, 4)}/${id.slice(
    4
  )}`;
}

function CreatePackDescription(pack) {
  let description = [];

  description.push(`${pack.stickers.length} stickers`);

  if (pack.hasOwnProperty("rating") && pack.rating) {
    switch (pack.rating.toLowerCase()) {
      case "safe":
        description.push("rating: safe");
        break;
      case "questionable":
        description.push("rating: questionable");
        break;
      case "explicit":
        description.push("rating: explicit");
        break;
      default:
        break;
    }
  }

  if (pack.hasOwnProperty("author") && pack.author) {
    let author_string = `author: ${pack.author.name}`;
    if (pack.author.url) {
      author_string += ` (${pack.author.url})`;
    }
    description.push(author_string);
  }

  return description.join(" | ");
}

module.exports = {CreateImageURL, CreatePackDescription};
