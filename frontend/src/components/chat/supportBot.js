// Instant, rule-based support answers built from the site's own data.
// Every fact comes from data/projects.js or the contact details below, so the
// bot never invents prices or claims. Unknown questions hand off to WhatsApp.
import { projects } from "../../data/projects";

export const CONTACT = {
  phone: "+91 91097 76155",
  tel: "+919109776155",
  whatsapp: "919109776155",
  email: "purwarmanish@gmail.com",
  office: "Iworkk Coworking Office Space, 90 IDC, Gurgaon, Haryana",
};

export const whatsappLink = (text) =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;

const STAGES = [
  { status: "Ready to Move", words: ["ready to move", "ready-to-move", "ready", "possession", "move in", "completed"] },
  { status: "Launched", words: ["launched", "new launch", "newly launched"] },
  { status: "Under Development", words: ["under construction", "under development", "construction"] },
  { status: "Pre-Launch / New Launch", words: ["pre-launch", "prelaunch", "pre launch", "upcoming", "early"] },
];

// "₹2.85 Cr* onwards" -> 2.85 (crore); "Price on request" -> null
export function priceInCrore(price) {
  const match = /([\d.]+)\s*Cr/i.exec(price || "");
  return match ? Number(match[1]) : null;
}

// Reads budgets like "2 cr", "under 3 crore", "1.5cr", "80 lakh", "between 2 and 4 cr".
export function parseBudget(text) {
  const numbers = [...text.matchAll(/(\d+(?:\.\d+)?)\s*(cr|crore|crores|l|lac|lakh|lakhs)?\b/g)]
    .filter((m) => m[2] || /budget|under|below|within|upto|up to|max|around|between/.test(text))
    .map((m) => {
      const value = Number(m[1]);
      return /^l/.test(m[2] || "") ? value / 100 : value;
    })
    .filter((v) => v > 0 && v < 200);
  if (!numbers.length) return null;
  if (numbers.length >= 2) return { min: Math.min(...numbers), max: Math.max(...numbers) };
  const value = numbers[0];
  if (/above|over|more than|minimum|min|\+/.test(text)) return { min: value, max: Infinity };
  if (/around|about|approx/.test(text)) return { min: value * 0.8, max: value * 1.2 };
  return { min: 0, max: value };
}

function projectLine(p) {
  return {
    text: `${p.name} by ${p.developer} · ${p.location} · ${p.status} · ${p.price}`,
    to: `/projects/${p.slug}`,
  };
}

function listReply(intro, list, empty) {
  if (!list.length) return { text: empty, actions: defaultActions() };
  return {
    text: intro,
    links: list.map(projectLine),
    actions: [
      { label: "Book a site visit", href: whatsappLink(`Hello Gratia Estates, I'd like a site visit for: ${list.map((p) => p.name).join(", ")}.`) },
      { label: "View all projects", to: "/projects" },
    ],
  };
}

function defaultActions(question) {
  return [
    {
      label: "Ask on WhatsApp",
      href: whatsappLink(
        question
          ? `Hello Gratia Estates, I have a question: ${question}`
          : "Hello Gratia Estates, I'd like help with a Gurgaon property.",
      ),
    },
    { label: `Call ${CONTACT.phone}`, href: `tel:${CONTACT.tel}` },
  ];
}

const has = (text, words) => words.some((w) => text.includes(w));
// Name fragments too common to identify a project on their own.
const GENERIC = ["city", "north", "valley"];
// Developer first words too generic to match alone (use the full name).
const GENERIC_DEVELOPER_WORDS = ["central"];

export const QUICK_REPLIES = [
  "Show ready-to-move projects",
  "Projects under 3 Cr",
  "Book a site visit",
  "DLF projects",
  "What should I check before booking?",
  "Contact details",
];

export const GREETING = {
  text: `Hi! I'm the Gratia Estates assistant. Ask me about our ${projects.length} Gurgaon projects, prices, sectors, developers, site visits or buying checks.`,
};

export function answer(rawQuestion) {
  const question = rawQuestion.trim();
  const text = ` ${question.toLowerCase().replace(/[?!.,]/g, " ")} `.replace(/\s+/g, " ");

  if (!question) return GREETING;

  // 1. Greetings / thanks
  if (/^ (hi|hii+|hello|hey|namaste|good (morning|afternoon|evening)) $/.test(text)) {
    return { text: "Hello! How can I help with your Gurgaon property search today?", quick: QUICK_REPLIES };
  }
  if (has(text, [" thank", " thanks", " thx", "great", " ok ", " okay "]) && text.length < 30) {
    return { text: "You're welcome! Anything else I can help you with?", quick: QUICK_REPLIES };
  }

  // 2. A specific project by name
  const named = projects.filter((p) => {
    const name = p.name.toLowerCase();
    const core = name.replace(/^(dlf|sobha|godrej|m3m|sg)\s*-?\s*/, "");
    return (
      text.includes(` ${name}`) ||
      (core.length >= 5 && !GENERIC.includes(core) && text.includes(core))
    );
  });
  if (named.length === 1) {
    const p = named[0];
    return {
      text: `${p.name} by ${p.developer} is in ${p.location}. Status: ${p.status}. Starting price: ${p.price}. Highlights: ${p.highlights.join(", ")}.`,
      links: [{ text: `Open ${p.name} details`, to: `/projects/${p.slug}` }],
      actions: [
        { label: "Book a site visit", href: whatsappLink(`Hello Gratia Estates, I'd like a site visit for ${p.name} (${p.location}).`) },
        { label: "Get latest price", href: whatsappLink(`Hello Gratia Estates, please share the latest price and availability for ${p.name}.`) },
      ],
    };
  }
  if (named.length > 1) return listReply("I found these matching projects:", named);

  // 3. Contact, office, email, hours
  if (has(text, ["contact", "phone", "number", "call", "mobile", "email", "mail", "office", "address", "where are you", "location of office", "visit office", "timing", "hours", "open"])
    && !has(text, ["site visit", "project"])) {
    return {
      text: `You can reach Gratia Estates on ${CONTACT.phone} (call or WhatsApp) or email ${CONTACT.email}. Office: ${CONTACT.office}.`,
      actions: [
        { label: "WhatsApp us", href: whatsappLink("Hello Gratia Estates, I'd like to speak to an advisor.") },
        { label: "Call now", href: `tel:${CONTACT.tel}` },
        { label: "Contact page", to: "/contact" },
      ],
    };
  }

  // 4a. Buying checks (before "book", which also matches site visits)
  if (has(text, ["rera", "hrera", "approval", "document", "papers", "legal", "check before", "verify", "due diligence", "safe", "fraud"])) {
    return {
      text: "Before booking, verify the project's HRERA registration, approvals and land title, the developer's track record, carpet area, the total cost including charges and taxes, the payment plan and the possession timeline. Read the builder-buyer agreement before paying a booking amount.",
      links: [{ text: "Read our buying guide", to: "/blog/gurgaon-real-estate-market-guide" }],
      actions: defaultActions(question),
    };
  }
  // 4c. Comparing stages (before the stage filter below)
  if (has(text, ["pre-launch or", "which is better", "which one is better", "ready or", "under construction or", "difference between", " vs ", "versus"])) {
    return {
      text: "Pre-launch and new launches can offer early pricing and flexible payment plans but take longer to deliver. Ready-to-move homes let you see the finished product and move in sooner. Compare possession dates, developer track record and total cost before deciding.",
      links: [{ text: "Pre-launch vs launched: full guide", to: "/blog/pre-launch-vs-launched-projects" }],
      actions: defaultActions(question),
    };
  }
  // 4b. Site visit / meeting / callback
  if (has(text, ["site visit", "visit", "book", "appointment", "meet", "callback", "call back", "schedule", "tour"])) {
    return {
      text: "Happy to arrange a site visit. Share the project and a convenient day on WhatsApp and our team will confirm the details.",
      actions: [
        { label: "Book on WhatsApp", href: whatsappLink("Hello Gratia Estates, I'd like to book a site visit. Preferred project and day: ") },
        { label: `Call ${CONTACT.phone}`, href: `tel:${CONTACT.tel}` },
      ],
    };
  }

  // 5. Developer
  const developers = [...new Set(projects.map((p) => p.developer))];
  const developer = developers.find((d) => {
    const full = d.toLowerCase();
    const key = full.split(" ")[0];
    return text.includes(full) || (!GENERIC_DEVELOPER_WORDS.includes(key) && text.includes(` ${key}`));
  });

  // 6. Sector / area
  const sector = /sector\s*-?\s*(\d{1,3})/.exec(text)?.[1];
  const area = ["sohna", "dwarka", "golf course", "spr", "new gurgaon"].find((a) => text.includes(a));

  // 7. Stage
  const stage = STAGES.find((s) => has(text, s.words));

  // 8. Budget
  const budget = parseBudget(text);

  if (developer || sector || area || stage || budget) {
    let list = projects;
    const parts = [];
    if (developer) {
      list = list.filter((p) => p.developer === developer);
      parts.push(`by ${developer}`);
    }
    if (sector) {
      list = list.filter((p) => new RegExp(`sector\\s*${sector}\\b`, "i").test(p.location));
      parts.push(`in Sector ${sector}`);
    }
    if (area && !sector) {
      const areaSectors = { sohna: /sohna/i };
      list = areaSectors[area] ? list.filter((p) => areaSectors[area].test(p.location)) : list;
      parts.push(`near ${area.replace(/\b\w/g, (c) => c.toUpperCase())}`);
    }
    if (stage) {
      list = list.filter((p) => p.status === stage.status);
      parts.push(`that {be} ${stage.status.toLowerCase()}`);
    }
    if (budget) {
      list = list.filter((p) => {
        const price = priceInCrore(p.price);
        return price !== null && price >= budget.min && price <= budget.max;
      });
      parts.push(
        budget.max === Infinity
          ? `from ₹${budget.min} Cr`
          : budget.min > 0
            ? `between ₹${budget.min.toFixed(2).replace(/\.?0+$/, "")} Cr and ₹${budget.max.toFixed(2).replace(/\.?0+$/, "")} Cr`
            : `up to ₹${budget.max} Cr`,
      );
    }
    const label = parts.join(" ").replace("{be}", list.length === 1 ? "is" : "are");
    return listReply(
      `Here ${list.length === 1 ? "is 1 project" : `are ${list.length} projects`} ${label}:`,
      list,
      `I don't have a listed project ${label} right now. Our advisors track more options than are on the website, so share your requirement and we'll suggest suitable ones.`,
    );
  }

  // 9. Buying knowledge
  if (has(text, ["emi", "loan", "interest rate", "bank", "finance", "mortgage"])) {
    return {
      text: "Our buying guide has a home-loan EMI calculator. For example, a ₹1 Cr loan at 8.5% for 20 years is about ₹86,782 a month. Actual rates depend on your bank and profile.",
      links: [{ text: "Open the EMI calculator", to: "/blog/gurgaon-real-estate-market-guide" }],
      actions: defaultActions(question),
    };
  }
  if (has(text, ["price", "cost", "rate", "how much", "cheapest", "lowest", "affordable", "expensive", "luxury"])) {
    const priced = projects
      .filter((p) => priceInCrore(p.price) !== null)
      .sort((a, b) => priceInCrore(a.price) - priceInCrore(b.price));
    const list = has(text, ["expensive", "luxury", "highest"]) ? [...priced].reverse().slice(0, 3) : priced.slice(0, 3);
    return listReply(
      `Our listed projects start from ${priced[0].price}. ${has(text, ["expensive", "luxury", "highest"]) ? "The premium options are:" : "The most affordable options are:"}`,
      list,
    );
  }
  if (has(text, ["video", "walkthrough", "youtube"])) {
    return { text: "You can watch project introductions and walkthroughs on our Videos page.", links: [{ text: "Watch videos", to: "/videos" }] };
  }
  if (has(text, ["all projects", "list", "show projects", "projects", "properties", "options", "flats", "apartments", "homes"])) {
    return listReply(`We currently list ${projects.length} Gurgaon projects:`, projects);
  }
  if (has(text, ["about", "who are you", "gratia", "company", "experience"])) {
    return {
      text: "Gratia Estates is a Gurgaon-focused real estate advisory. We help buyers compare new-launch, under-construction and ready-to-move projects, and coordinate site visits with one advisor from shortlist to decision.",
      links: [{ text: "About us", to: "/about" }],
    };
  }

  // 10. Anything else: honest handoff to a person.
  return {
    text: "I'm not sure about that one, and I'd rather not guess. An advisor can answer it directly; tap below and your question will be sent on WhatsApp.",
    actions: defaultActions(question),
    quick: QUICK_REPLIES.slice(0, 3),
  };
}
