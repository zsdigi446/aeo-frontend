// AEO 学院 - 渐进增强：若 articles.json 可加载则动态渲染，否则保留静态卡片
(async function () {
  try {
    const res = await fetch("./articles/articles.json", { cache: "no-store" });
    if (!res.ok) return;
    const list = await res.json();
    const box = document.getElementById("article-list");
    if (!box || !Array.isArray(list) || !list.length) return;
    box.innerHTML = list.map(a => `
      <article class="card">
        <span class="tag">${a.category || "AEO"}</span>
        <h3><a href="./articles/${a.slug}.html">${a.title}</a></h3>
        <p>${a.summary || ""}</p>
        <a class="more" href="./articles/${a.slug}.html">阅读全文 →</a>
      </article>`).join("");
  } catch (e) { /* 静态回退已就位 */ }
})();
