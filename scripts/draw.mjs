const PALETTE = {
  藏青: "#1e3558",
  燕麦: "#e4d3bc",
  燕麦色: "#e4d3bc",
  卡其: "#c4a36a",
  浅卡其: "#d7c4a0",
  橄榄绿: "#5e6a45",
  橄榄: "#5e6a45",
  酒红: "#7c3140",
  奶白: "#f4efe4",
  米白: "#f3eadc",
  驼: "#b08a62",
  驼色: "#b08a62",
  黑: "#1c1c1c",
  白: "#f7f7f4",
  靛蓝: "#31486f",
  牛仔蓝: "#35557e",
  棕: "#6b4b32",
  深棕: "#4a3226",
  炭灰: "#3e4348",
  灰: "#8d8880",
  亮黄: "#f0d430",
  荧光黄绿: "#d4ee4a",
  灰绿: "#8ea396",
};

const FONT =
  "PingFang SC, Hiragino Sans GB, Microsoft YaHei, Noto Sans SC, WenQuanYi Micro Hei, sans-serif";

export function colorOf(name) {
  return PALETTE[name] || "#b7a48c";
}

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [0, 1, 2].map((i) => parseInt(h.slice(i * 2, i * 2 + 2), 16));
}

function rgbToHex([r, g, b]) {
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

function mix(a, b, t) {
  const pa = hexToRgb(a);
  const pb = hexToRgb(b);
  return rgbToHex(pa.map((v, i) => Math.round(v + (pb[i] - v) * t)));
}

export function tones(name) {
  const base = colorOf(name);
  return {
    base,
    dark: mix(base, "#1a140f", 0.32),
    light: mix(base, "#fffaf3", 0.42),
    line: mix(base, "#140f0c", 0.62),
  };
}

function shadow(y = 236) {
  return `<ellipse cx="100" cy="${y}" rx="68" ry="8" fill="#2a2118" opacity="0.1"/>`;
}

export const GARMENT_TYPES = [
  "overcoat",
  "blazer",
  "jacket",
  "rider",
  "denim-jacket",
  "field-jacket",
  "down-jacket",
  "vest",
  "sweater-vest",
  "shirt",
  "flannel",
  "turtleneck",
  "crewneck",
  "hoodie",
  "tee",
  "fleece",
  "trousers",
  "jeans",
  "chinos",
  "sweatpants",
  "chelsea",
  "sneaker",
  "oxford",
  "boot",
  "loafer",
  "tie",
];

export function garment(type, colorName, id = "g") {
  const t = tones(colorName);
  const draw = GARMENTS[type];
  if (!draw) throw new Error(`未知单品类型：${type}`);
  return `<g id="${id}">${shadow()}${draw(t, id)}</g>`;
}

const GARMENTS = {
  overcoat: (t) => `
    <path d="M48 74c-18 26-22 86-8 140 4 12 18 8 20-8L74 102z" fill="${t.dark}"/>
    <path d="M152 74c18 26 22 86 8 140-4 12-18 8-20-8L126 102z" fill="${t.dark}"/>
    <path d="M72 58c16-20 40-20 56 0l24 176c-6 14-98 14-104 0z" fill="${t.base}" stroke="${t.line}" stroke-width="2"/>
    <path d="M100 66 L74 132 L98 118 Z" fill="${t.dark}"/>
    <path d="M100 66 L126 132 L102 118 Z" fill="${t.light}"/>
    <path d="M86 60c8 14 20 14 28 0" fill="none" stroke="${t.line}" stroke-width="2"/>
    <circle cx="100" cy="150" r="3" fill="${t.line}"/>
    <circle cx="100" cy="174" r="3" fill="${t.line}"/>
    <circle cx="100" cy="198" r="3" fill="${t.line}"/>
    <path d="M78 162h22v26H78z" fill="${t.dark}" opacity=".55"/>
    <path d="M100 162h22v26H100z" fill="${t.dark}" opacity=".45"/>
    <path d="M58 168c6 8 10 6 12-2" fill="none" stroke="${t.line}" stroke-width="2"/>
    <path d="M142 168c-6 8-10 6-12-2" fill="none" stroke="${t.line}" stroke-width="2"/>
  `,
  blazer: (t) => `
    <path d="M46 78c-10 24-12 70-2 112 4 8 14 6 16-4L72 108z" fill="${t.dark}"/>
    <path d="M154 78c10 24 12 70 2 112-4 8-14 6-16-4L128 108z" fill="${t.dark}"/>
    <path d="M70 64c14-16 46-16 60 0l16 150H54z" fill="${t.base}" stroke="${t.line}" stroke-width="2"/>
    <path d="M100 70 L78 124 L98 112 Z" fill="${t.dark}"/>
    <path d="M100 70 L122 124 L102 112 Z" fill="${t.light}"/>
    <circle cx="100" cy="146" r="2.8" fill="${t.line}"/>
    <circle cx="100" cy="168" r="2.8" fill="${t.line}"/>
    <path d="M76 150h18v16H76z" fill="${t.dark}" opacity=".4"/>
    <path d="M106 150h18v16h-18z" fill="${t.dark}" opacity=".4"/>
    <path d="M78 196h44" stroke="${t.line}" stroke-width="2"/>
  `,
  jacket: (t) => `
    <path d="M50 80c-12 22-14 64-4 104 4 8 14 6 14-4l12-70z" fill="${t.dark}"/>
    <path d="M150 80c12 22 14 64 4 104-4 8-14 6-14-4l-12-70z" fill="${t.dark}"/>
    <path d="M68 66h64l16 140H52z" fill="${t.base}" stroke="${t.line}" stroke-width="2"/>
    <path d="M90 66h20v18H90z" fill="${t.dark}"/>
    <path d="M100 84 v110" stroke="${t.line}" stroke-width="2"/>
    <circle cx="108" cy="110" r="2.4" fill="${t.line}"/>
    <circle cx="108" cy="132" r="2.4" fill="${t.line}"/>
    <path d="M74 124h22v16H74z" fill="${t.dark}" opacity=".4"/>
    <path d="M112 124h20v16h-20z" fill="${t.dark}" opacity=".35"/>
    <path d="M64 188h72" stroke="${t.line}" stroke-width="3"/>
  `,
  rider: (t) => `
    <path d="M48 82c-14 20-16 60-4 100 5 8 14 4 14-6l10-64z" fill="${t.dark}"/>
    <path d="M152 82c14 20 16 60 4 100-5 8-14 4-14-6l-10-64z" fill="${t.dark}"/>
    <path d="M66 64c12-8 56-8 68 0l18 142H48z" fill="${t.base}" stroke="${t.line}" stroke-width="2"/>
    <path d="M78 70 L100 108 L70 96 Z" fill="${t.light}"/>
    <path d="M122 70 L100 108 L130 96 Z" fill="${t.dark}"/>
    <path d="M104 96 q16 28 8 90" fill="none" stroke="${t.line}" stroke-width="2"/>
    <path d="M70 150h24" stroke="${t.line}" stroke-width="2"/>
    <path d="M118 158h22" stroke="${t.line}" stroke-width="2"/>
    <path d="M62 190h76" stroke="${t.line}" stroke-width="3"/>
  `,
  "denim-jacket": (t) => `
    <path d="M48 86c-12 18-10 58 0 92 4 8 14 4 14-6l8-58z" fill="${t.dark}"/>
    <path d="M152 86c12 18 10 58 0 92-4 8-14 4-14-6l-8-58z" fill="${t.dark}"/>
    <path d="M66 70h68l14 128H52z" fill="${t.base}" stroke="${t.line}" stroke-width="2"/>
    <path d="M66 92h68" stroke="${mix(t.base, "#e6c28a", 0.55)}" stroke-width="2"/>
    <path d="M86 70 v22 M114 70 v22" stroke="${t.line}" stroke-width="2"/>
    <path d="M74 118h22v18H74z" fill="${t.dark}" opacity=".45"/>
    <path d="M104 118h22v18h-22z" fill="${t.dark}" opacity=".45"/>
    <circle cx="100" cy="150" r="2.5" fill="#d7b07a"/>
    <circle cx="100" cy="170" r="2.5" fill="#d7b07a"/>
    <path d="M60 186h80" stroke="${t.line}" stroke-width="3"/>
  `,
  "field-jacket": (t) => `
    <path d="M46 78c-14 24-14 78-2 124 4 8 16 6 16-6L74 104z" fill="${t.dark}"/>
    <path d="M154 78c14 24 14 78 2 124-4 8-16 6-16-6L126 104z" fill="${t.dark}"/>
    <path d="M70 62h60l20 164H50z" fill="${t.base}" stroke="${t.line}" stroke-width="2"/>
    <path d="M86 62h28v16H86z" fill="${t.dark}"/>
    <path d="M74 108h22v20H74z" fill="${t.dark}" opacity=".4"/>
    <path d="M104 108h22v20h-22z" fill="${t.dark}" opacity=".4"/>
    <path d="M74 160h22v24H74z" fill="${t.dark}" opacity=".45"/>
    <path d="M104 160h22v24h-22z" fill="${t.dark}" opacity=".45"/>
    <path d="M100 78 v130" stroke="${t.line}" stroke-width="2"/>
  `,
  "down-jacket": (t) => `
    <path d="M44 80c-16 30-16 90 0 140 5 8 16 4 16-8L74 108z" fill="${t.dark}"/>
    <path d="M156 80c16 30 16 90 0 140-5 8-16 4-16-8L126 108z" fill="${t.dark}"/>
    <path d="M70 66h60c22 8 24 150 16 164H54c-8-14-6-156 16-164z" fill="${t.base}" stroke="${t.line}" stroke-width="2"/>
    <path d="M58 100h84M56 126h88M56 152h88M58 178h84M64 204h72" stroke="${t.line}" stroke-width="1.6" opacity=".7"/>
    <path d="M88 66h24v16H88z" fill="${t.dark}"/>
    <path d="M100 82 v24" stroke="${t.line}" stroke-width="2"/>
  `,
  vest: (t) => `
    <path d="M74 70c10-16 42-16 52 0l14 150H60z" fill="${t.base}" stroke="${t.line}" stroke-width="2"/>
    <path d="M92 70h16v14H92z" fill="${t.dark}"/>
    <path d="M78 100h44M76 124h48M76 148h48M78 172h44M82 196h36" stroke="${t.line}" stroke-width="1.6" opacity=".75"/>
    <path d="M100 84 v100" stroke="${t.line}" stroke-width="2"/>
  `,
  "sweater-vest": (t) => `
    <path d="M72 86c12-24 44-24 56 0l10 132c-8 16-68 16-76 0z" fill="${t.base}" stroke="${t.line}" stroke-width="2"/>
    <path d="M90 86 L100 112 L110 86" fill="${t.dark}"/>
    <path d="M78 200h44" stroke="${t.line}" stroke-width="4"/>
    <path d="M74 96c8 8 8 20 0 28M126 96c-8 8-8 20 0 28" fill="none" stroke="${t.line}" stroke-width="2"/>
  `,
  shirt: (t, id) => shirt(t, id, false),
  flannel: (t, id) => shirt(t, id, true),
  turtleneck: (t) => knit(t, "turtleneck"),
  crewneck: (t) => knit(t, "crew"),
  hoodie: (t) => `
    <path d="M48 96c-14 24-12 78 0 120 4 8 14 6 16-4l8-78z" fill="${t.dark}"/>
    <path d="M152 96c14 24 12 78 0 120-4 8-14 6-16-4l-8-78z" fill="${t.dark}"/>
    <path d="M66 78c12 40 56 40 68 0l14 140H52z" fill="${t.base}" stroke="${t.line}" stroke-width="2"/>
    <path d="M78 70c8 28 36 28 44 0 4 18-8 36-22 36S74 88 78 70z" fill="${t.dark}"/>
    <path d="M96 102c8 16 0 20 8 28" fill="none" stroke="${t.line}" stroke-width="2"/>
    <path d="M70 206h60" stroke="${t.line}" stroke-width="4"/>
    <path d="M86 150h10M108 156h12" stroke="${t.light}" stroke-width="2" opacity=".7"/>
  `,
  tee: (t) => `
    <path d="M52 86c-8 16-6 40 2 58 4 4 12 2 12-6l8-32 8 130h36l8-130 8 32c0 8 8 10 12 6 8-18 10-42 2-58-10-8-24-16-48-16s-38 8-48 16z" fill="${t.base}" stroke="${t.line}" stroke-width="2"/>
    <path d="M86 74c8 12 20 12 28 0" fill="${t.dark}"/>
    <path d="M72 214h56" stroke="${t.line}" stroke-width="3"/>
  `,
  fleece: (t) => `
    <path d="M50 92c-12 22-10 70 2 108 4 8 14 4 14-6l8-70z" fill="${t.dark}"/>
    <path d="M150 92c12 22 10 70-2 108-4 8-14 4-14-6l-8-70z" fill="${t.dark}"/>
    <path d="M68 74h64l14 140H54z" fill="${t.base}" stroke="${t.line}" stroke-width="2"/>
    <path d="M86 74c8 16 20 16 28 0" fill="${t.dark}"/>
    <path d="M100 96 v36" stroke="${t.line}" stroke-width="2"/>
    <path d="M62 188h76" stroke="${t.line}" stroke-width="4"/>
    <path d="M74 120h8M96 128h10M118 118h8M80 150h12" stroke="${t.light}" stroke-width="2" opacity=".8"/>
  `,
  trousers: (t) => pants(t, "tailored"),
  chinos: (t) => pants(t, "chino"),
  jeans: (t) => pants(t, "jeans"),
  sweatpants: (t) => pants(t, "sweat"),
  chelsea: (t) => shoeChelsea(t),
  sneaker: (t) => shoeSneaker(t),
  oxford: (t) => shoeOxford(t),
  boot: (t) => shoeBoot(t),
  loafer: (t) => shoeLoafer(t),
  tie: (t) => `
    <path d="M86 48h28l8 36-22 10-22-10z" fill="${t.dark}"/>
    <path d="M92 84l8 120 8-120" fill="${t.base}" stroke="${t.line}" stroke-width="2"/>
    <path d="M90 176l10 28 10-28" fill="${t.dark}"/>
  `,
};

function shirt(t, id, checked) {
  const body = `M64 78c8-18 64-18 72 0l12 140H52z`;
  return `
    <path d="M48 96c-10 18-8 50 2 74 4 6 12 4 12-4l10-48z" fill="${t.dark}"/>
    <path d="M152 96c10 18 8 50-2 74-4 6-12 4-12-4l-10-48z" fill="${t.dark}"/>
    <path d="${body}" fill="${t.base}" stroke="${t.line}" stroke-width="2"/>
    ${
      checked
        ? `<g clip-path="url(#${id}clip)" stroke="${t.line}" stroke-width="1.4" opacity=".35">
            ${Array.from({ length: 8 }, (_, i) => `<path d="M60 ${100 + i * 14}h80"/>`).join("")}
            ${Array.from({ length: 5 }, (_, i) => `<path d="M${72 + i * 16} 90v120"/>`).join("")}
          </g>
          <clipPath id="${id}clip"><path d="${body}"/></clipPath>`
        : ""
    }
    <path d="M78 74c8 10 14 22 22 22s14-12 22-22c-8 16-14 20-22 20s-14-4-22-20z" fill="${t.light}" stroke="${t.line}" stroke-width="1.6"/>
    <path d="M100 96 v96" stroke="${t.line}" stroke-width="1.6"/>
    <circle cx="100" cy="112" r="2" fill="${t.line}"/>
    <circle cx="100" cy="132" r="2" fill="${t.line}"/>
    <circle cx="100" cy="152" r="2" fill="${t.line}"/>
    <path d="M78 168h18v16H78z" fill="${t.dark}" opacity=".25"/>
  `;
}

function knit(t, kind) {
  const collar =
    kind === "turtleneck"
      ? `<path d="M84 62h32v28c-6 10-26 10-32 0z" fill="${t.dark}" stroke="${t.line}" stroke-width="2"/>
         <path d="M88 70h24" stroke="${t.light}" stroke-width="2"/>`
      : `<path d="M82 70c8 16 28 16 36 0v16H82z" fill="${t.dark}"/>`;
  return `
    <path d="M46 92c-12 22-8 78 4 116 4 6 14 4 14-6l10-78z" fill="${t.dark}"/>
    <path d="M154 92c12 22 8 78-4 116-4 6-14 4-14-6l-10-78z" fill="${t.dark}"/>
    <path d="M66 74c12-8 56-8 68 0l12 142H54z" fill="${t.base}" stroke="${t.line}" stroke-width="2"/>
    ${collar}
    <path d="M62 200h76" stroke="${t.line}" stroke-width="5"/>
    <path d="M52 176c8 4 8 4 0 8M148 176c-8 4-8 4 0 8" stroke="${t.line}" stroke-width="2" fill="none"/>
    <path d="M78 120c8 6 8 10 0 16M110 130c10 4 8 12 0 16" stroke="${t.light}" stroke-width="2" fill="none" opacity=".75"/>
  `;
}

function pants(t, kind) {
  const wide = kind === "sweat" ? 8 : kind === "chino" ? 0 : kind === "jeans" ? 2 : 0;
  const cuff =
    kind === "sweat"
      ? `<path d="M62 214h30M108 214h30" stroke="${t.line}" stroke-width="4"/>`
      : `<path d="M64 220h28M108 220h28" stroke="${t.light}" stroke-width="2" opacity=".7"/>`;
  const jeans =
    kind === "jeans"
      ? `<path d="M74 78h18v16H74z" fill="${t.dark}" opacity=".45"/>
         <path d="M78 82h12M80 86h8" stroke="#e2c48a" stroke-width="1.2"/>
         <path d="M86 70 v150" stroke="#d7b07a" stroke-width="1.2" opacity=".8"/>
         <path d="M118 70 v150" stroke="#d7b07a" stroke-width="1.2" opacity=".8"/>`
      : "";
  return `
    <path d="M62 46h76v16H62z" fill="${t.dark}"/>
    <path d="M66 62 L${58 - wide} 230 h34 L100 78 L${108 + wide} 230 h34 L134 62z" fill="${t.base}" stroke="${t.line}" stroke-width="2"/>
    <path d="M84 78 v140M116 78 v140" stroke="${t.light}" stroke-width="1.4" opacity=".65"/>
    ${cuff}
    ${jeans}
    <path d="M92 52h6v8h-6z" fill="${t.line}"/>
  `;
}

function shoeChelsea(t) {
  return `
    <path d="M36 150h78c20 0 36 10 52 18 10 6 20 8 28 8 8 0 14 8 10 16H46c-16 0-26-10-26-24 0-10 6-18 16-18z" fill="${t.base}" stroke="${t.line}" stroke-width="2"/>
    <path d="M36 168h34v20H48c-10 0-12-8-12-14z" fill="${t.dark}"/>
    <path d="M78 154v28" stroke="${t.line}" stroke-width="6" opacity=".35"/>
    <path d="M46 192h128" stroke="${t.line}" stroke-width="4" stroke-linecap="round"/>
  `;
}

function shoeSneaker(t) {
  return `
    <path d="M34 156c28-8 46-28 70-28 22 0 40 8 62 16 8 3 16 12 16 22v10H48c-16 0-24-10-14-20z" fill="${t.base}" stroke="${t.line}" stroke-width="2"/>
    <path d="M48 146c18-16 40-22 58-14" fill="none" stroke="${t.line}" stroke-width="2"/>
    <path d="M70 150c16 6 20 16 8 24" fill="none" stroke="${t.light}" stroke-width="3"/>
    <path d="M40 186h132c4 8-2 12-10 12H52c-12 0-16-6-12-12z" fill="${t.dark}"/>
  `;
}

function shoeOxford(t) {
  return `
    <path d="M40 158h70c18 0 34 6 52 14 12 6 22 6 28 12 4 6 0 14-10 14H52c-14 0-22-8-18-18 2-6 4-14 6-22z" fill="${t.base}" stroke="${t.line}" stroke-width="2"/>
    <path d="M78 150c10 14 18 18 28 18" fill="none" stroke="${t.line}" stroke-width="2"/>
    <path d="M86 162h10M100 166h10M112 170h8" stroke="${t.light}" stroke-width="1.6"/>
    <path d="M46 190h124" stroke="${t.line}" stroke-width="4" stroke-linecap="round"/>
    <path d="M40 176h22v14H48z" fill="${t.dark}"/>
  `;
}

function shoeBoot(t) {
  return `
    <path d="M48 118h46c8 18 10 36 8 52h62c10 0 16 8 12 16H50c-16 0-24-12-20-28 4-16 10-28 18-40z" fill="${t.base}" stroke="${t.line}" stroke-width="2"/>
    <path d="M62 132v46M74 128v50" stroke="${t.light}" stroke-width="2"/>
    <path d="M46 186h128" stroke="${t.line}" stroke-width="5" stroke-linecap="round"/>
    <path d="M44 196h18v8H48z" fill="${t.dark}"/>
  `;
}

function shoeLoafer(t) {
  return `
    <path d="M40 162h82c16 0 30 8 48 14 10 4 18 8 22 14H50c-14 0-20-8-16-16 2-6 4-12 6-12z" fill="${t.base}" stroke="${t.line}" stroke-width="2"/>
    <path d="M96 158c10 8 22 10 32 6" fill="none" stroke="${t.line}" stroke-width="3"/>
    <path d="M108 164v10" stroke="${t.dark}" stroke-width="2"/>
    <path d="M46 190h122" stroke="${t.line}" stroke-width="4" stroke-linecap="round"/>
  `;
}

function esc(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function renderBoard(items, options = {}) {
  const cols = items.length === 1 ? 1 : 2;
  const rows = Math.ceil(items.length / cols);
  const cellW = 330;
  const cellH = 390;
  const pad = 28;
  const width = cols * cellW + pad * 2;
  const height = rows * cellH + pad * 2;
  const parts = [];
  items.forEach((item, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const inLast = row === rows - 1;
    const lastCount = items.length - (rows - 1) * cols;
    const rowCols = inLast ? lastCount : cols;
    const rowWidth = rowCols * cellW;
    const rowX = (width - rowWidth) / 2;
    const x = rowX + col * cellW;
    const y = pad + row * cellH;
    const scale = 1.15;
    const gx = x + (cellW - 200 * scale) / 2;
    const gy = y + 12;
    parts.push(
      `<g transform="translate(${gx} ${gy}) scale(${scale})">${garment(item.type, item.color, `p${index}`)}</g>`
    );
    const cx = x + cellW / 2;
    parts.push(
      `<text x="${cx}" y="${y + cellH - 48}" text-anchor="middle" font-size="26" fill="#1c1915" font-family="${FONT}">${esc(item.color)} · ${esc(item.name)}</text>`
    );
    parts.push(
      `<text x="${cx}" y="${y + cellH - 18}" text-anchor="middle" font-size="18" fill="#6e665c" font-family="${FONT}">${esc(item.fit)}</text>`
    );
  });
  for (const callout of options.callouts || []) {
    parts.push(
      `<g font-family="${FONT}">
        <line x1="${callout.x1}" y1="${callout.y1}" x2="${callout.x2}" y2="${callout.y2}" stroke="#7c3140" stroke-width="2"/>
        <circle cx="${callout.x1}" cy="${callout.y1}" r="4" fill="#7c3140"/>
        <text x="${callout.x2 + (callout.align === "end" ? -8 : 8)}" y="${callout.y2 + 6}" text-anchor="${callout.align || "start"}" font-size="22" fill="#7c3140">${esc(callout.text)}</text>
      </g>`
    );
  }
  const title = options.title || items.map((item) => item.name).join("、");
  return svgDoc(
    width,
    height,
    `<title>${esc(title)}</title>
     <rect width="${width}" height="${height}" fill="#f3ecdf"/>
     <rect x="10" y="10" width="${width - 20}" height="${height - 20}" rx="18" fill="#fbf7f1" stroke="#e4d8c8"/>
     ${parts.join("\n")}`
  );
}

function svgDoc(width, height, body) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img">
${body}
</svg>
`;
}

function faceAt(x, y, shirt, label, verdict) {
  const t = tones(shirt);
  const bad = verdict === "慎用";
  const verdictColor = bad ? "#7c3140" : "#3f5134";
  return `
  <g transform="translate(${x} ${y})" font-family="${FONT}">
    <rect x="0" y="18" width="560" height="132" rx="16" fill="#fffdf8" stroke="#e4d8c8"/>
    <path d="M36 78h120v52H36z" fill="${t.base}"/>
    <path d="M70 78c10 16 36 16 46 0v18H70z" fill="${t.dark}"/>
    <ellipse cx="96" cy="70" rx="30" ry="34" fill="#e0b07c" stroke="#8a5a32" stroke-width="2"/>
    <path d="M70 52c6-16 46-18 54 0 2 8-10 12-27 12s-29-4-27-12z" fill="#3a2c24"/>
    <circle cx="84" cy="72" r="2" fill="#3a2c24"/>
    <circle cx="108" cy="72" r="2" fill="#3a2c24"/>
    <path d="M88 86c6 4 14 4 18 0" fill="none" stroke="#8a5a32" stroke-width="1.5"/>
    <text x="190" y="78" font-size="32" fill="#1c1915">${esc(label)}</text>
    <text x="190" y="118" font-size="24" fill="${verdictColor}">${esc(verdict)}${bad ? " · 靠近脸会显脏" : " · 脸色比较干净"}</text>
  </g>`;
}

export function paletteSvg() {
  const rows = [
    ["藏青", "藏青", "推荐"],
    ["燕麦", "燕麦", "推荐"],
    ["卡其", "卡其", "推荐"],
    ["橄榄绿", "橄榄绿", "推荐"],
    ["酒红", "酒红", "推荐"],
    ["奶白", "奶白", "推荐"],
    ["亮黄", "亮黄", "慎用"],
    ["荧光黄绿", "荧光黄绿", "慎用"],
    ["灰绿", "发灰的绿", "慎用"],
  ];
  const body = rows.map((row, i) => faceAt(36, 86 + i * 150, row[0], row[1], row[2])).join("");
  return svgDoc(
    680,
    150 + rows.length * 150,
    `<title>偏黄肤色的颜色对照</title>
     <rect width="680" height="${150 + rows.length * 150}" fill="#f3ecdf"/>
     <text x="36" y="52" font-size="28" fill="#6e665c" font-family="${FONT}">同一张脸，只换衣服的颜色。肤色示意为偏黄暖调。</text>
     ${body}`
  );
}

function croquis(x, y, scale, clothes) {
  const skin = "#e0b07c";
  const hair = "#342820";
  const line = "#3a2a22";
  return `
  <g transform="translate(${x} ${y}) scale(${scale})" stroke-linejoin="round">
    <ellipse cx="0" cy="36" rx="26" ry="32" fill="${skin}" stroke="${line}" stroke-width="2"/>
    <path d="M-22 16c4-20 40-22 46 0 2 8-8 12-23 12s-25-4-23-12z" fill="${hair}"/>
    <circle cx="-8" cy="38" r="1.7" fill="${line}"/>
    <circle cx="10" cy="38" r="1.7" fill="${line}"/>
    <path d="M-6 50c4 3 10 3 14 0" fill="none" stroke="${line}" stroke-width="1.4"/>
    <path d="M-8 66h16v16h-16z" fill="${skin}"/>
    ${clothes}
  </g>`;
}

function slimLimbs(pants, shoes) {
  return `
    <path d="M-62 92 L-92 210 L-74 214 L-48 112 Z" fill="#e0b07c"/>
    <path d="M62 92 L92 210 L74 214 L48 112 Z" fill="#e0b07c"/>
    ${pants}
    ${shoes}
  `;
}

export function proportionSvg() {
  const pants = `
    <path d="M-36 168 L-44 360 h28 L-6 188 L8 360 h28 L28 168z" fill="#c4a36a" stroke="#6b4b32" stroke-width="2"/>
  `;
  const shoes = `
    <path d="M-58 352h40v16h-46z" fill="#6b4b32"/>
    <path d="M18 352h40v16H12z" fill="#6b4b32"/>
  `;
  const coat = `
    <path d="M-70 86c-16 30-18 120-4 176 6 10 18 6 16-8L-28 120z" fill="#162844"/>
    <path d="M70 86c16 30 18 120 4 176-6 10-18 6-16-8L28 120z" fill="#162844"/>
    <path d="M-40 78h80l18 180H-58z" fill="#1e3558" stroke="#0e1c30" stroke-width="2"/>
    <path d="M-8 84 L-24 130 L-4 118Z" fill="#162844"/>
    <path d="M8 84 L24 130 L4 118Z" fill="#314e78"/>
  `;
  const body = croquis(
    230,
    150,
    1.05,
    `${slimLimbs(pants, shoes)}${coat}<path d="M-16 68h32v22h-32z" fill="#e4d3bc" stroke="#b9a48a" stroke-width="1.4"/>`
  );
  return svgDoc(
    680,
    1180,
    `<title>181cm、72kg 的肩线、衣摆和裤管</title>
     <rect width="680" height="1180" fill="#f3ecdf"/>
     <rect x="16" y="16" width="648" height="1148" rx="20" fill="#fbf7f1" stroke="#e4d8c8"/>
     <text x="40" y="58" font-family="${FONT}" font-size="28" fill="#1c1915">181 cm / 72 kg</text>
     <text x="40" y="92" font-family="${FONT}" font-size="20" fill="#6e665c">肉不多，空的是厚度，不是把码数无脑加大。</text>
     ${body}
     <line x1="48" y1="210" x2="48" y2="600" stroke="#7c3140" stroke-width="2"/>
     <text x="36" y="420" font-family="${FONT}" font-size="18" fill="#7c3140" transform="rotate(-90 36 420)">身高 181</text>
     <g font-family="${FONT}">
       <rect x="40" y="620" width="600" height="150" rx="14" fill="#fff" stroke="#e4d8c8"/>
       <text x="64" y="668" font-size="28" fill="#7c3140">1 肩线</text>
       <text x="64" y="708" font-size="24" fill="#1c1915">缝要落在肩骨上。</text>
       <text x="64" y="742" font-size="20" fill="#6e665c">滑到袖子上，181 的肩就空了一块。</text>
       <rect x="40" y="786" width="600" height="150" rx="14" fill="#fff" stroke="#e4d8c8"/>
       <text x="64" y="834" font-size="28" fill="#7c3140">2 衣摆</text>
       <text x="64" y="874" font-size="24" fill="#1c1915">盖过臀部，到大腿中段。</text>
       <text x="64" y="908" font-size="20" fill="#6e665c">停在腰最细的地方，人会更瘦。</text>
       <rect x="40" y="1002" width="600" height="140" rx="14" fill="#fff" stroke="#e4d8c8"/>
       <text x="64" y="1050" font-size="28" fill="#7c3140">3 裤管</text>
       <text x="64" y="1090" font-size="24" fill="#1c1915">直筒，大腿处留一点空气。</text>
       <text x="64" y="1124" font-size="20" fill="#6e665c">72kg 不需要贴身裤来显瘦。</text>
     </g>`
  );
}

function panelFigure(kind) {
  if (kind === "bad") {
    const skinny = `
      <path d="M-16 168 L-14 332 h12 L-2 180 L4 332 h12 L14 168z" fill="#202226" stroke="#111" stroke-width="2"/>
    `;
    const shoes = `
      <path d="M-28 326h26v12h-30z" fill="#f7f7f4" stroke="#222" stroke-width="1.5"/>
      <path d="M4 326h26v12H0z" fill="#f7f7f4" stroke="#222" stroke-width="1.5"/>
    `;
    const yellow = `
      <path d="M-58 96c-8 14-6 36 0 48l10-28 8 100h80l8-100 10 28c6-12 8-34 0-48-12-10-28-16-58-16s-46 6-58 16z" fill="#f0d430" stroke="#a48910" stroke-width="2"/>
      <path d="M-22 78c6 16 38 16 44 0v14h-44z" fill="#e2c420"/>
    `;
    const shortBand = `<path d="M-46 176h92v14h-92z" fill="#3e4348" stroke="#1c1c1c" stroke-width="1.6"/>`;
    return croquis(0, 0, 1, `${slimLimbs(skinny, shoes)}${yellow}${shortBand}`);
  }
  const pants = `
    <path d="M-40 168 L-50 340 h32 L-8 190 L10 340 h32 L36 168z" fill="#c4a36a" stroke="#6b4b32" stroke-width="2"/>
  `;
  const boots = `
    <path d="M-62 300h48c6 10 4 28-6 36h-48z" fill="#6b4b32"/>
    <path d="M14 300h48c6 10 4 28-6 36H8z" fill="#6b4b32"/>
  `;
  const coat = `
    <path d="M-78 88c-18 36-16 150 0 210 6 8 16 4 14-8L-36 130z" fill="#162844"/>
    <path d="M78 88c18 36 16 150 0 210-6 8-16 4-14-8L36 130z" fill="#162844"/>
    <path d="M-46 76h92l22 230H-68z" fill="#1e3558" stroke="#0e1c30" stroke-width="2"/>
    <path d="M-6 84 L-26 140 L-2 124Z" fill="#162844"/>
    <path d="M6 84 L26 140 L2 124Z" fill="#314e78"/>
  `;
  const neck = `<path d="M-18 64h36v30c-8 10-28 10-36 0z" fill="#e4d3bc" stroke="#b9a48a" stroke-width="1.6"/>`;
  return croquis(0, 0, 1, `${slimLimbs(pants, boots)}${coat}${neck}`);
}

export function compareSvg() {
  return svgDoc(
    680,
    1680,
    `<title>同一身材，两套秋冬的差别</title>
     <rect width="680" height="1680" fill="#f3ecdf"/>
     <text x="36" y="52" font-family="${FONT}" font-size="28" fill="#1c1915">同一位 181 / 72、偏黄肤色</text>
     <rect x="24" y="80" width="632" height="760" rx="18" fill="#fffdf8" stroke="#e7c7c7"/>
     <text x="48" y="124" font-family="${FONT}" font-size="28" fill="#7c3140">不适合</text>
     <g transform="translate(250 150)">${panelFigure("bad")}</g>
     <g font-family="${FONT}" font-size="22" fill="#3a342c">
       <text x="48" y="690">亮黄贴着脸，暖黄肤色会发脏。</text>
       <text x="48" y="728">短棉服停在最细的腰上。</text>
       <text x="48" y="766">裤管贴住腿，细被描出来了。</text>
     </g>
     <rect x="24" y="870" width="632" height="770" rx="18" fill="#fffdf8" stroke="#d5dec8"/>
     <text x="48" y="914" font-family="${FONT}" font-size="28" fill="#3f5134">适合</text>
     <g transform="translate(250 940)">${panelFigure("good")}</g>
     <g font-family="${FONT}" font-size="22" fill="#3a342c">
       <text x="48" y="1500">藏青离脸远，不跟黄皮抢。</text>
       <text x="48" y="1538">燕麦高领垫在下巴下面。</text>
       <text x="48" y="1576">大衣过臀，直筒裤有一点余量。</text>
     </g>`
  );
}

export function lessonFlatlay() {
  return renderBoard(
    [
      { type: "overcoat", name: "羊毛大衣", color: "藏青", fit: "过臀，肩缝在肩骨上" },
      { type: "turtleneck", name: "高领针织", color: "燕麦", fit: "中厚，腰侧进一拳" },
      { type: "trousers", name: "直筒西裤", color: "卡其", fit: "不要修身，裤长配靴" },
      { type: "chelsea", name: "切尔西靴", color: "棕", fit: "圆头，靴筒到踝" },
    ],
    {
      title: "秋冬通勤的四件",
      callouts: [
        { x1: 168, y1: 150, x2: 40, y2: 120, text: "肩", align: "start" },
        { x1: 168, y1: 300, x2: 40, y2: 300, text: "衣摆过臀", align: "start" },
        { x1: 210, y1: 640, x2: 48, y2: 700, text: "裤管留空", align: "start" },
      ],
    }
  );
}

export { svgDoc, FONT, PALETTE };
