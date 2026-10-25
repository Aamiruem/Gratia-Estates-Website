// Builds clear, consistently formatted WhatsApp messages for the team.
// WhatsApp renders *text* as bold; each detail gets its own emoji and line.
export const WHATSAPP_NUMBER = "919109776155";

const DIVIDER = "━━━━━━━━━━━━━━━━";

/**
 * @param {string} title   e.g. "🏡 *New Site Visit Request*"
 * @param {Array<Array<[string, string, string]>>} groups  rows of [emoji, label, value];
 *        groups are separated by a blank line, empty values are skipped.
 */
export function formatWhatsAppMessage(title, groups) {
  const blocks = groups
    .map((rows) =>
      rows
        .filter(([, , value]) => value && String(value).trim())
        .map(([emoji, label, value]) => `${emoji} *${label}:* ${String(value).trim()}`)
        .join("\n"),
    )
    .filter(Boolean);
  return [title, DIVIDER, blocks.join("\n\n"), DIVIDER, "Sent from gratiaestates.com 🙏"].join("\n");
}

// Uses api.whatsapp.com directly: the wa.me short link's redirect replaces
// emoji with "�", while this link passes them through to WhatsApp intact.
export function whatsappUrl(text, number = WHATSAPP_NUMBER) {
  return `https://api.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(text)}`;
}

export function openWhatsApp(text, number = WHATSAPP_NUMBER) {
  window.open(whatsappUrl(text, number), "_blank", "noopener,noreferrer");
}
