/* footer-dev-yazi — Dev marka yazılı footer (15 Kas 2026, G3 · mcp:webmaker/20261115-202336-i5p2).
   Yer tutucular (koşulsuz): dyzsinif dyzhakkinda dyzsayfa dyziletisim dyzsosyal dyzyazi dyzyil. {{langbar}} motor; @anahtar@ lang.json.
   Veri yoksa ilgili blok HİÇ basılmaz (uydurma yok): hakkında = desing.hakkinda (dil sözlüğü) → setting.description;
   iletişim = desing.tel/eposta/adres → setting.phone/email/address; sosyal = wmSocialBar (desing.social → setting). */
const pick = (v) => {
  if (v == null) return "";
  if (typeof v !== "object") return String(v);
  if (typeof wmPickLang === "function") { try { return wmPickLang(v, json.lang) || ""; } catch (e) { /* alt satır */ } }
  return String(v[json.lang] ?? Object.values(v)[0] ?? "");
};
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const { desing: des = {} } = json;
const setting = webmakerdata?.setting ?? {};
const sayfa = page || {};

/* sayfalar: anasayfa + yayındaki üst düzey sayfalar (maxpages; 0 = sınırsız) */
let maks = parseInt(des.maxpages, 10);
if (!Number.isFinite(maks)) maks = 8;
const ps = Array.isArray(webmakerdata?.pagesetting?.data)
  ? webmakerdata.pagesetting.data.find((it) => it?.modulestatus?.page)
  : null;
const satirlar = ps && Array.isArray(webmakerdata?.[ps.path]?.data) ? webmakerdata[ps.path].data : [];
const sayfalar = [{ ad: "@home@", href: wxLangInternalHref(""), aktif: !sayfa.path }];
for (const r of satirlar) {
  if (maks > 0 && sayfalar.length > maks) break;
  if (!r || r.status !== "play" || (r.category || "") !== "") continue;
  const ad = pick(r.name).trim();
  if (ad) sayfalar.push({ ad: esc(ad), href: wxLangInternalHref(r.pathnext || r.path || ""), aktif: !!sayfa.path && sayfa.path === r.path });
}
const dyzSayfa = sayfalar.map((o) =>
  `<li><a class="modulex-dyz-link" href="${esc(o.href)}"${o.aktif ? ' aria-current="page"' : ""}>${o.ad}<span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_outward</span></a></li>`
).join("");

const hakkinda = pick(des.hakkinda).trim() || pick(setting.description).trim();
const dyzHakkinda = hakkinda ? `<p class="modulex-dyz-hakkinda">${esc(hakkinda)}</p>` : "";

const tel = pick(des.tel).trim() || (typeof setting.phone === "string" ? setting.phone.trim() : "");
const posta = pick(des.eposta).trim() || (typeof setting.email === "string" ? setting.email.trim() : "");
const adres = pick(des.adres).trim() || pick(setting.address).trim();
const iletisim = [
  tel ? `<li><a class="modulex-dyz-link" href="tel:${tel.replace(/[^+\d]/g, "")}"><bdi dir="ltr">${esc(tel)}</bdi></a></li>` : "",
  posta ? `<li><a class="modulex-dyz-link" href="mailto:${esc(posta)}"><bdi dir="ltr">${esc(posta)}</bdi></a></li>` : "",
  adres ? `<li><span>${esc(adres)}</span></li>` : "",
].join("");
const dyzIletisim = iletisim
  ? `<div class="modulex-dyz-kol"><h2 class="modulex-dyz-baslik">@contact-us@</h2><ul class="modulex-dyz-liste">${iletisim}</ul></div>`
  : "";

const sosyalIc = typeof wmSocialBar === "function"
  ? wmSocialBar({ liste: "modulex-dyz-sosyal", oge: "modulex-dyz-sosyal-li", baglanti: "modulex-dyz-sosyal-a", aria: "@follow-us@" })
  : "";
const dyzSosyal = sosyalIc
  ? `<div class="modulex-dyz-kol"><h2 class="modulex-dyz-baslik">@follow-us@</h2>${sosyalIc}</div>`
  : "";

/* dev yazı: desing.yazi (dil sözlüğü) → site adı (motor {{web-name}} çözer) */
const yazi = pick(des.yazi).trim();
const dyzYazi = yazi ? esc(yazi) : "{{web-name}}";

const dyzSinif = [
  String(des.kirp) === "false" || des.kirp === false ? "" : " modulex-dyz--kirp",
  dyzIletisim || dyzSosyal ? "" : " modulex-dyz--sade",
].join("");

html = html
  .replaceAll("{{dyzsinif}}", () => dyzSinif)
  .replaceAll("{{dyzhakkinda}}", () => dyzHakkinda)
  .replaceAll("{{dyzsayfa}}", () => dyzSayfa)
  .replaceAll("{{dyziletisim}}", () => dyzIletisim)
  .replaceAll("{{dyzsosyal}}", () => dyzSosyal)
  .replaceAll("{{dyzyazi}}", () => dyzYazi)
  .replaceAll("{{dyzyil}}", () => String(new Date().getFullYear()));
