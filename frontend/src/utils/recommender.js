// Content-based project recommender, runs entirely in the browser.
//
// Each project becomes a feature set: a TF-IDF vector over its description,
// highlights and type, plus structured signals (developer, stage, price band,
// sector). Project-to-project similarity is a weighted blend of cosine
// similarity on the text vectors and the structured matches. Personal
// recommendations average the similarity to the projects a visitor viewed,
// weighted by how often and how recently they viewed them. Viewing history
// stays in the visitor's own browser (localStorage).
import { projects } from "../data/projects";

const STOP_WORDS = new Set(
  ("a an and are as at be by for from has have in into is it its of on or that the this to with " +
    "your you our we their they can may who which more most than also over such some any all " +
    "project projects gurgaon home homes buyers contact team current details get touch").split(" "),
);

const WEIGHTS = { text: 0.4, stage: 0.15, type: 0.1, developer: 0.1, price: 0.15, sector: 0.1 };
const HISTORY_KEY = "gratia:viewedProjects";
const HALF_LIFE_DAYS = 14;

function tokenize(text) {
  return (text.toLowerCase().match(/[a-z][a-z-]+/g) || []).filter(
    (word) => word.length > 2 && !STOP_WORDS.has(word),
  );
}

// "₹2.85 Cr* onwards" -> 2.85 (crore); "₹95 Lakh" -> 0.95; "Price on request" -> null
export function parsePriceCr(price = "") {
  const match = price.replace(/,/g, "").match(/(\d+(?:\.\d+)?)\s*(cr|crore|l|lac|lakh)/i);
  if (!match) return null;
  const value = Number(match[1]);
  return /^l/i.test(match[2]) ? value / 100 : value;
}

function sectorNumber(location = "") {
  const match = location.match(/sector\s*(\d+)/i);
  return match ? Number(match[1]) : null;
}

function buildModel(items) {
  const docs = items.map((project) =>
    tokenize([project.description, ...(project.highlights || []), project.type].join(" ")),
  );
  const documentFrequency = new Map();
  docs.forEach((tokens) =>
    new Set(tokens).forEach((token) =>
      documentFrequency.set(token, (documentFrequency.get(token) || 0) + 1),
    ),
  );

  const features = items.map((project, index) => {
    const counts = new Map();
    docs[index].forEach((token) => counts.set(token, (counts.get(token) || 0) + 1));
    const vector = new Map();
    let norm = 0;
    counts.forEach((count, token) => {
      const idf = Math.log((1 + items.length) / (1 + documentFrequency.get(token))) + 1;
      const weight = (count / docs[index].length) * idf;
      vector.set(token, weight);
      norm += weight * weight;
    });
    norm = Math.sqrt(norm) || 1;
    vector.forEach((weight, token) => vector.set(token, weight / norm));
    return {
      vector,
      typeTokens: new Set(tokenize(project.type)),
      price: parsePriceCr(project.price),
      sector: sectorNumber(project.location),
    };
  });

  const similarity = items.map((a, i) =>
    items.map((b, j) => (i === j ? null : compare(a, features[i], b, features[j]))),
  );
  return { items, similarity, indexBySlug: new Map(items.map((p, i) => [p.slug, i])) };
}

function cosine(a, b) {
  let dot = 0;
  const [small, large] = a.size < b.size ? [a, b] : [b, a];
  small.forEach((weight, token) => {
    if (large.has(token)) dot += weight * large.get(token);
  });
  return dot;
}

function jaccard(a, b) {
  const union = new Set([...a, ...b]);
  if (!union.size) return 0;
  return [...a].filter((token) => b.has(token)).length / union.size;
}

// Returns { score, reasons } where reasons explain the strongest matches.
function compare(a, fa, b, fb) {
  const parts = {
    text: cosine(fa.vector, fb.vector),
    stage: a.status === b.status ? 1 : 0,
    type: jaccard(fa.typeTokens, fb.typeTokens),
    developer: a.developer === b.developer ? 1 : 0,
    price: fa.price && fb.price ? Math.exp(-Math.abs(Math.log(fa.price / fb.price)) / 0.35) : 0.3,
    sector: fa.sector != null && fb.sector != null ? Math.exp(-Math.abs(fa.sector - fb.sector) / 15) : 0.3,
  };
  const score = Object.entries(WEIGHTS).reduce((sum, [key, weight]) => sum + weight * parts[key], 0);

  const reasons = [];
  if (parts.developer) reasons.push(`Also by ${b.developer}`);
  if (fa.price && fb.price && parts.price > 0.6) reasons.push("Similar budget");
  if (fa.sector != null && fb.sector != null && Math.abs(fa.sector - fb.sector) <= 10) reasons.push("Nearby sector");
  if (parts.stage) reasons.push(b.status);
  if (parts.text > 0.2) reasons.push("Similar features");
  return { score, reasons: reasons.slice(0, 2) };
}

let model;
function getModel() {
  if (!model) model = buildModel(projects);
  return model;
}

/** Projects most similar to the given one: [{ project, score, reasons }]. */
export function similarProjects(slug, limit = 3) {
  const { items, similarity, indexBySlug } = getModel();
  const index = indexBySlug.get(slug);
  if (index == null) return [];
  return items
    .map((project, j) => ({ project, ...(similarity[index][j] || { score: -1, reasons: [] }) }))
    .filter((entry) => entry.project.slug !== slug)
    .sort((x, y) => y.score - x.score)
    .slice(0, limit);
}

function readHistory() {
  try {
    const history = JSON.parse(window.localStorage.getItem(HISTORY_KEY) || "[]");
    return Array.isArray(history) ? history : [];
  } catch {
    return [];
  }
}

/** Remember that the visitor opened a project (kept in their browser only). */
export function recordProjectView(slug) {
  try {
    const history = readHistory().filter((entry) => entry.slug !== slug);
    const previous = readHistory().find((entry) => entry.slug === slug);
    history.unshift({ slug, views: (previous?.views || 0) + 1, at: Date.now() });
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 30)));
  } catch {
    // Storage unavailable (private mode): recommendations fall back to defaults.
  }
}

/**
 * Personal recommendations from the visitor's viewing history.
 * Returns { items: [{ project, score, reasons }], personalised }.
 */
export function recommendForVisitor(limit = 3, excludeSlug) {
  const { items, similarity, indexBySlug } = getModel();
  const now = Date.now();
  const viewed = readHistory()
    .map((entry) => ({
      index: indexBySlug.get(entry.slug),
      weight: (entry.views || 1) * 0.5 ** ((now - (entry.at || now)) / (HALF_LIFE_DAYS * 86_400_000)),
    }))
    .filter((entry) => entry.index != null);

  if (!viewed.length) {
    return { items: items.slice(0, limit).map((project) => ({ project, score: 0, reasons: [] })), personalised: false };
  }

  const viewedSet = new Set(viewed.map((entry) => entry.index));
  const totalWeight = viewed.reduce((sum, entry) => sum + entry.weight, 0);
  const ranked = items
    .map((project, j) => {
      if (project.slug === excludeSlug) return null;
      let score = 0;
      let best = { weight: -1, reasons: [] };
      viewed.forEach((entry) => {
        const pair = entry.index === j ? null : similarity[entry.index][j];
        if (!pair) return;
        score += entry.weight * pair.score;
        if (entry.weight * pair.score > best.weight) best = { weight: entry.weight * pair.score, reasons: pair.reasons };
      });
      // Already-viewed projects drop down the list so new ones surface first.
      score = (score / totalWeight) * (viewedSet.has(j) ? 0.5 : 1);
      return { project, score, reasons: best.reasons };
    })
    .filter(Boolean)
    .sort((x, y) => y.score - x.score);
  return { items: ranked.slice(0, limit), personalised: true };
}
