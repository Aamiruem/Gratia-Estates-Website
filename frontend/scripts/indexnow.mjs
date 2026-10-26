// Tells IndexNow search engines (Bing, Yandex, Naver, Seznam, Yep; Bing also
// feeds DuckDuckGo, Yahoo and ChatGPT search) about every page in the live
// sitemap. Run after a deploy once the domain points at this site:
//   npm run indexnow
// The key file public/<KEY>.txt proves the site owns the submission.
import { SITE_URL as SITE } from "../site.config.js";
const KEY = "9382e63d4267035f03f3238a06a4a247";

const keyResponse = await fetch(`${SITE}/${KEY}.txt`);
if (!keyResponse.ok || (await keyResponse.text()).trim() !== KEY) {
  console.error(`The key file is not live at ${SITE}/${KEY}.txt yet. Is the domain pointing at the new site?`);
  process.exit(1);
}

const sitemap = await (await fetch(`${SITE}/sitemap.xml`)).text();
const urlList = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
});
// 200 = accepted, 202 = accepted and key validation pending.
console.log(`IndexNow: submitted ${urlList.length} URLs, response HTTP ${response.status}`);
if (response.status >= 300) process.exit(1);
