// Styles for the generated portfolio (also copied into the downloaded file)
var PF_CSS = `
.pf{--accent:#2b6cb0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#16202c;background:#fff;line-height:1.55;min-height:100%}
.pf *{box-sizing:border-box}
.pf .wrap{max-width:720px;margin:0 auto}
.pf header{background:var(--accent);color:#fff;padding:52px 24px 40px}
.pf h1{font-family:Georgia,"Times New Roman",serif;font-size:clamp(2rem,8vw,3.2rem);margin:0 0 6px;line-height:1.1}
.pf .role{margin:0;font-size:1.15rem;opacity:.92}
.pf section{padding:28px 24px 4px;max-width:720px;margin:0 auto}
.pf h2{font-size:1.1rem;margin:0 0 12px}
.pf p{margin:0 0 12px}
.pf .chips{display:flex;flex-wrap:wrap;gap:8px;padding:0;margin:0;list-style:none}
.pf .chips li{border:1.5px solid var(--accent);color:var(--accent);border-radius:999px;padding:4px 12px;font-size:.9rem}
.pf .proj{border-left:4px solid var(--accent);padding:2px 0 2px 14px;margin-bottom:18px}
.pf .proj h3{margin:0;font-size:1.05rem}
.pf .proj p{margin:4px 0 0}
.pf a{color:var(--accent);font-weight:600}
.pf .contact a{margin-right:16px;display:inline-block}
.pf footer{padding:28px 24px;text-align:center;font-size:.85rem;opacity:.65}
`;
var pfTag = document.createElement('style');
pfTag.id = 'pfStyle';
pfTag.textContent = PF_CSS;
document.head.appendChild(pfTag);

(function () {
  var KEY = "portfolio_builder_v1";
  var $ = function (id) { return document.getElementById(id); };
  var blank = function () {
    return { name: "", role: "", about: "", skills: "", email: "", github: "", linkedin: "",
             accent: "#2b6cb0", projects: [{ title: "", desc: "", link: "" }] };
  };

  function load() {
    try { var s = localStorage.getItem(KEY); return s ? JSON.parse(s) : null; } catch (e) { return null; }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

  var state = load() || blank();
  if (!state.projects || !state.projects.length) state.projects = [{ title: "", desc: "", link: "" }];

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function safeUrl(u) {
    u = (u || "").trim();
    if (!u) return "";
    if (!/^https?:\/\//i.test(u)) u = "https://" + u;
    return /^https?:\/\/[^\s"'<>]+$/i.test(u) ? u : "";
  }
  function safeColor(c) { return /^#[0-9a-f]{6}$/i.test(c) ? c : "#2b6cb0"; }

  // ---------- generated portfolio ----------
  function renderPortfolio() {
    var name = state.name.trim() || "Your Name";
    var role = state.role.trim();
    var skills = state.skills.split(",").map(function (s) { return s.trim(); }).filter(Boolean);
    var projects = state.projects.filter(function (p) { return p.title.trim() || p.desc.trim(); });

    var contact = [];
    if (state.email.trim()) contact.push('<a href="mailto:' + esc(state.email.trim()) + '">Email</a>');
    var gh = state.github.trim().replace(/^@/, "");
    if (/^[A-Za-z0-9-]+$/.test(gh)) contact.push('<a href="https://github.com/' + gh + '">GitHub</a>');
    var li = safeUrl(state.linkedin);
    if (li) contact.push('<a href="' + esc(li) + '">LinkedIn</a>');

    var h = '<div class="pf" style="--accent:' + safeColor(state.accent) + '">';
    h += '<header><div class="wrap"><h1>' + esc(name) + '</h1>';
    if (role) h += '<p class="role">' + esc(role) + '</p>';
    h += '</div></header>';

    if (state.about.trim()) h += '<section><h2>About</h2><p>' + esc(state.about.trim()).replace(/\n/g, "<br>") + '</p></section>';
    if (skills.length) h += '<section><h2>Skills</h2><ul class="chips">' + skills.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + '</ul></section>';
    if (projects.length) {
      h += '<section><h2>Projects</h2>';
      projects.forEach(function (p) {
        var link = safeUrl(p.link);
        h += '<div class="proj"><h3>' + esc(p.title.trim() || "Untitled project") + '</h3>';
        if (p.desc.trim()) h += '<p>' + esc(p.desc.trim()) + '</p>';
        if (link) h += '<p><a href="' + esc(link) + '">View project</a></p>';
        h += '</div>';
      });
      h += '</section>';
    }
    if (contact.length) h += '<section class="contact"><h2>Contact</h2><p>' + contact.join("") + '</p></section>';
    h += '<footer>© ' + new Date().getFullYear() + ' ' + esc(name) + '</footer></div>';
    return h;
  }

  function update() {
    save();
    $("preview").innerHTML = renderPortfolio();
  }

  // ---------- editor ----------
  function buildProjects() {
    var box = $("projects");
    box.innerHTML = "";
    state.projects.forEach(function (p, i) {
      var d = document.createElement("div");
      d.className = "projcard";
      d.innerHTML =
        '<label>Project name</label><input type="text" data-i="' + i + '" data-pk="title" value="' + esc(p.title) + '">' +
        '<label>What it does</label><textarea data-i="' + i + '" data-pk="desc">' + esc(p.desc) + '</textarea>' +
        '<label>Link (live site or GitHub)</label><input type="text" data-i="' + i + '" data-pk="link" autocapitalize="none" value="' + esc(p.link) + '">' +
        '<button type="button" class="rm" data-rm="' + i + '">Remove</button>';
      box.appendChild(d);
    });
  }

  function fillFields() {
    document.querySelectorAll("[data-k]").forEach(function (el) { el.value = state[el.dataset.k] || ""; });
    buildProjects();
  }

  $("editor").addEventListener("input", function (e) {
    var t = e.target;
    if (t.dataset.k) state[t.dataset.k] = t.value;
    else if (t.dataset.pk) state.projects[+t.dataset.i][t.dataset.pk] = t.value;
    update();
  });

  $("editor").addEventListener("click", function (e) {
    var rm = e.target.getAttribute("data-rm");
    if (rm !== null) {
      state.projects.splice(+rm, 1);
      if (!state.projects.length) state.projects.push({ title: "", desc: "", link: "" });
      buildProjects(); update();
    }
  });

  $("addProj").addEventListener("click", function () {
    state.projects.push({ title: "", desc: "", link: "" });
    buildProjects(); update();
  });

  // ---------- tabs ----------
  function showTab(preview) {
    document.body.classList.toggle("show-preview", preview);
    $("tabEdit").setAttribute("aria-selected", String(!preview));
    $("tabView").setAttribute("aria-selected", String(preview));
    window.scrollTo(0, 0);
  }
  $("tabEdit").addEventListener("click", function () { showTab(false); });
  $("tabView").addEventListener("click", function () { showTab(true); });

  // ---------- download / reset ----------
  $("dlBtn").addEventListener("click", function () {
    var name = state.name.trim() || "Portfolio";
    var doc = '<!DOCTYPE html>\n<html lang="en"><head><meta charset="UTF-8">' +
      '<meta name="viewport" content="width=device-width, initial-scale=1">' +
      '<title>' + esc(name) + '</title><style>body{margin:0}' + $("pfStyle").textContent + '</style></head><body>' +
      renderPortfolio() + '</body></html>';
    var blob = new Blob([doc], { type: "text/html" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "portfolio.html";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  });

  $("resetBtn").addEventListener("click", function () {
    if (!confirm("Clear everything and start over?")) return;
    state = blank(); fillFields(); update();
  });

  fillFields();
  update();
})();
