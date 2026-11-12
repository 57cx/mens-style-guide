const DB_NAME = "yijia-wardrobe";
const STORE = "outfits";

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function allLocal() {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE).objectStore(STORE).getAll();
    request.onsuccess = () => resolve(request.result.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || "")));
    request.onerror = () => reject(request.error);
  });
}

async function putLocal(outfit) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE, "readwrite").objectStore(STORE).put(outfit);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function deleteLocal(id) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE, "readwrite").objectStore(STORE).delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

function seasonOk(value, selected) {
  if (!selected) return true;
  if (value === selected) return true;
  if (selected === "秋冬" && (value === "秋" || value === "冬" || value === "秋冬")) return true;
  if (selected === "春夏" && (value === "春" || value === "夏" || value === "春夏")) return true;
  if ((selected === "秋" || selected === "冬") && value === "秋冬") return true;
  if ((selected === "春" || selected === "夏") && value === "春夏") return true;
  return false;
}

function readFilters() {
  const selected = {};
  document.querySelectorAll(".filter-line").forEach((line) => {
    const pressed = line.querySelector('[aria-pressed="true"]');
    selected[line.dataset.key] = pressed ? pressed.dataset.value : "";
  });
  return selected;
}

function applyFilters() {
  const selected = readFilters();
  const cards = [...document.querySelectorAll("#outfit-grid .outfit-card")];
  let shown = 0;
  cards.forEach((card) => {
    const colors = (card.dataset.colors || "").split(",").filter(Boolean);
    const ok =
      (!selected.scene || card.dataset.scene === selected.scene) &&
      (!selected.style || card.dataset.style === selected.style) &&
      seasonOk(card.dataset.season, selected.season) &&
      (!selected.color || colors.includes(selected.color));
    card.classList.toggle("is-hidden", !ok);
    if (ok) shown += 1;
  });
  const count = document.querySelector("#visible-count");
  if (count) count.textContent = `当前显示 ${shown} 套`;
}

function bindFilters() {
  const params = new URLSearchParams(location.search);
  document.querySelectorAll(".filter-line").forEach((line) => {
    const key = line.dataset.key;
    const initial = params.get(key);
    line.querySelectorAll("button").forEach((button) => {
      const on = initial && button.dataset.value === initial;
      button.setAttribute("aria-pressed", on ? "true" : "false");
      button.addEventListener("click", () => {
        const next = button.getAttribute("aria-pressed") !== "true";
        line.querySelectorAll("button").forEach((other) => other.setAttribute("aria-pressed", "false"));
        button.setAttribute("aria-pressed", next ? "true" : "false");
        const url = new URL(location.href);
        if (next) url.searchParams.set(key, button.dataset.value);
        else url.searchParams.delete(key);
        history.replaceState(null, "", url);
        applyFilters();
      });
    });
  });
  applyFilters();
}

function fileToBitmap(file) {
  if (window.createImageBitmap) return createImageBitmap(file);
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = URL.createObjectURL(file);
  });
}

async function compressFile(file) {
  const bitmap = await fileToBitmap(file);
  const width = bitmap.width;
  const height = bitmap.height;
  const scale = Math.min(1, 1600 / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.82));
  if (bitmap.close) bitmap.close();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function renderLocalCard(outfit, template) {
  const node = template.content.firstElementChild.cloneNode(true);
  node.id = `local-${outfit.id}`;
  node.dataset.scene = outfit.scene || "";
  node.dataset.style = outfit.style || "";
  node.dataset.season = outfit.season || "";
  node.dataset.colors = (outfit.colors || []).join(",");
  const img = node.querySelector("img");
  img.src = (outfit.photos && outfit.photos[0]) || "";
  img.alt = outfit.title || "我的搭配";
  node.querySelector("h3").textContent = outfit.title || "未命名";
  const tags = node.querySelector(".tag-list");
  [outfit.scene, outfit.style, outfit.season, ...(outfit.colors || [])].filter(Boolean).forEach((tag) => {
    const li = document.createElement("li");
    li.textContent = tag;
    tags.appendChild(li);
  });
  node.querySelector(".why").textContent = outfit.why || "";
  const items = node.querySelector(".items");
  (outfit.items || []).forEach((item) => {
    const li = document.createElement("li");
    li.textContent = [item.name, item.color, item.fit].filter(Boolean).join(" · ");
    items.appendChild(li);
  });
  const thumbs = node.querySelector(".thumb-row");
  (outfit.photos || []).slice(1).forEach((src) => {
    const extra = document.createElement("img");
    extra.src = src;
    extra.alt = "";
    thumbs.appendChild(extra);
  });
  node.querySelector("[data-delete]").addEventListener("click", async () => {
    if (!confirm("从这台设备删除这套搭配？")) return;
    await deleteLocal(outfit.id);
    node.remove();
    applyFilters();
  });
  return node;
}

async function mountLocalCards() {
  const grid = document.querySelector("#outfit-grid");
  const template = document.querySelector("#local-card");
  if (!grid || !template) return;
  const outfits = await allLocal();
  outfits.forEach((outfit) => grid.prepend(renderLocalCard(outfit, template)));
  applyFilters();
}

function splitColors(value) {
  return value.split(/[、,，\s]+/).map((item) => item.trim()).filter(Boolean);
}

function readItems(form) {
  const rows = [...form.querySelectorAll(".item-row")];
  return rows
    .map((row) => ({
      name: row.querySelector('[name="item-name"]').value.trim(),
      color: row.querySelector('[name="item-color"]').value.trim(),
      fit: row.querySelector('[name="item-fit"]').value.trim(),
    }))
    .filter((item) => item.name);
}

function addItemRow(container, required) {
  const row = document.createElement("div");
  row.className = "item-row";
  row.innerHTML = `
    <input type="text" name="item-name" placeholder="单品" ${required ? "required" : ""}>
    <input type="text" name="item-color" placeholder="颜色">
    <input type="text" name="item-fit" placeholder="版型">
  `;
  container.appendChild(row);
}

function downloadJson(outfits) {
  const payload = { version: 1, exportedAt: new Date().toISOString(), outfits };
  const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
  const link = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);
  link.href = URL.createObjectURL(blob);
  link.download = `我的搭配-${stamp}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
}

async function exportAll() {
  const outfits = await allLocal();
  if (!outfits.length) {
    alert("这台设备上还没有保存的搭配。");
    return;
  }
  downloadJson(outfits);
}

async function importFile(file) {
  const data = JSON.parse(await file.text());
  const outfits = Array.isArray(data) ? data : data.outfits;
  if (!Array.isArray(outfits)) throw new Error("文件里没有 outfits 数组");
  for (const outfit of outfits) {
    if (!outfit.id) outfit.id = crypto.randomUUID();
    await putLocal(outfit);
  }
  location.reload();
}

function bindUpload() {
  const form = document.querySelector("#outfit-form");
  if (!form) return;
  const status = document.querySelector("#form-status");
  const rows = document.querySelector("#item-rows");
  const photoInput = form.querySelector('input[name="photos"]');
  const photoNames = document.querySelector("#photo-names");
  if (photoInput && photoNames) {
    photoInput.addEventListener("change", () => {
      const names = [...photoInput.files].map((file) => file.name);
      photoNames.textContent = names.length ? names.join("、") : "还没有选择照片";
    });
  }
  document.querySelector("#add-item").addEventListener("click", () => {
    if (rows.children.length >= 8) return;
    addItemRow(rows, false);
  });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "正在压缩照片…";
    try {
      const files = [...form.photos.files].slice(0, 4);
      if (!files.length) throw new Error("请至少选一张照片");
      const photos = [];
      for (const file of files) photos.push(await compressFile(file));
      const outfit = {
        id: crypto.randomUUID(),
        title: form.title.value.trim(),
        scene: form.scene.value,
        style: form.style.value,
        season: form.season.value,
        colors: splitColors(form.colors.value),
        items: readItems(form),
        why: form.why.value.trim(),
        photos,
        createdAt: new Date().toISOString(),
      };
      await putLocal(outfit);
      status.textContent = "已保存在这台设备。可以去衣橱页筛选，或马上导出 JSON。";
      form.reset();
      await refreshLocalList();
    } catch (error) {
      status.textContent = `没有保存成功：${error.message || error}`;
    }
  });
  document.querySelector("#export-json").addEventListener("click", () => exportAll().catch((error) => {
    status.textContent = error.message || String(error);
  }));
  document.querySelector("#import-json").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;
    importFile(file).catch((error) => {
      status.textContent = `导入失败：${error.message || error}`;
    });
  });
  refreshLocalList();
}

async function refreshLocalList() {
  const list = document.querySelector("#local-list");
  const template = document.querySelector("#local-card");
  if (!list) return;
  list.innerHTML = "";
  const outfits = await allLocal();
  if (!outfits.length) {
    list.innerHTML = '<p class="empty">还没有保存在这台设备上的搭配。</p>';
    return;
  }
  if (!template) return;
  outfits.forEach((outfit) => list.append(renderLocalCard(outfit, template)));
}

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page === "wardrobe") {
    bindFilters();
    mountLocalCards().catch((error) => {
      console.error(error);
    });
  }
  if (page === "upload") bindUpload();
});
