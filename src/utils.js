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

function InjectWSConnection() {
  return `
  <!-- The following was injected by watch.js script, because we are in a dev mode -->
  <script src="/src/hotreload.js"></script>
  <!-- Dev mode: Enabled -->
  `;
}

function log(level = "INFO" | "ERROR" | "WARN" | "LOG", message, connected = false) {
  const date = new Date;
  const time = date.toLocaleTimeString()
  if (connected) {
    message = `↳${message}`
  }
  switch (level.toUpperCase()) {
    case "INFO":
      console.info(`${time}:${level} - ${message}`);
      break;
    case "ERROR":
      console.error(`${time}:${level} - ${message}`);
      break;
    case "WARN":
      console.warn(`${time}:${level} - ${message}`);
      break;
    default:
      console.log(`${time}:LOG - ${message}`);
      break;
  }
}

module.exports = {
  CreateImageURL,
  CreatePackDescription,
  InjectWSConnection,
  log,
};
