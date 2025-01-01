const ElementInstructionOV = document.getElementById(
  "preview_sticker_pack_add_to_element_overlay"
);
const ElementInstruction = document.getElementById(
  "preview_sticker_pack_add_to_element"
);

function toggleElementInstruction() {
  ElementInstructionOV.classList.toggle("hidden");
  ElementInstruction.classList.toggle("hidden");

  ElementInstruction.classList.toggle("flex");
}
