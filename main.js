(function () {
  const cfg = window.PJ;

  const el = (tag, props = {}, ...kids) => {
    const n = Object.assign(document.createElement(tag), props);
    kids.flat().forEach((k) => k != null && n.append(k));
    return n;
  };

  // Releases
  const list = document.getElementById("release-list");
  cfg.releases.forEach((r) => {
    const id = `release-${r.cat.toLowerCase()}`;
    const links = r.links.map((l) =>
      el("li", {}, l.url
        ? el("a", { href: l.url, target: "_blank", rel: "noopener", textContent: l.label })
        : el("span", { textContent: `${l.label} .... PENDING` }))
    );
    const toggle = el("span", { className: "c-toggle", textContent: "[+]" });
    toggle.setAttribute("aria-hidden", "true");
    const head = el("button", { className: "release-head grid", type: "button" },
      el("span", { className: "c-cat", textContent: r.cat }),
      el("span", { className: "c-artist", textContent: r.artist }),
      el("span", { className: "c-title", textContent: r.title }),
      el("span", { className: "c-format", textContent: r.format || "" }),
      toggle,
    );
    head.setAttribute("aria-expanded", "false");
    head.setAttribute("aria-controls", id);

    const body = el("div", { className: "release-body", id },
      el("div", { className: "release-inner" },
        el("div", { className: "release-content grid" }, el("ul", { className: "links" }, links))));
    body.inert = true;

    const item = el("li", { className: "release" }, head, body);
    head.addEventListener("click", () => {
      const open = item.classList.toggle("open");
      head.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "[-]" : "[+]";
      body.inert = !open;
    });
    list.append(item);
  });

  const n = String(cfg.releases.length).padStart(3, "0");
  document.getElementById("release-count").innerHTML = `${n}<span class="rec-unit"> REC</span>`;
  document.getElementById("rec-count").textContent = `${n} ENTRIES`;
  document.getElementById("eol").textContent = "END OF LISTING";

  // System clock, local time
  const clock = document.getElementById("clock");
  const pad = (v) => String(v).padStart(2, "0");
  const tick = () => {
    const d = new Date();
    clock.textContent = `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };
  tick();
  setInterval(tick, 1000);

  // Socials and contact
  document.getElementById("socials").append(...cfg.socials.map((s) =>
    el("li", {}, el("a", { href: s.url, target: "_blank", rel: "noopener", textContent: s.label }))));

  const contact = document.getElementById("contact");
  if (cfg.contact.email) contact.append(el("li", {}, el("a", { href: `mailto:${cfg.contact.email}`, textContent: cfg.contact.email })));
  if (cfg.contact.phone) contact.append(el("li", {}, el("a", { href: `tel:${cfg.contact.phone.replace(/\s/g, "")}`, textContent: cfg.contact.phone })));

  // Mailchimp signup via JSONP so the visitor stays on the page
  const form = document.getElementById("signup");
  const msg = document.getElementById("signup-msg");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = form.EMAIL.value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { msg.textContent = "ERR 01: INVALID ADDRESS"; return; }
    if (document.getElementById("hp").value) return;
    if (!cfg.mailchimp.action) { msg.textContent = "ERR 02: CHANNEL NOT OPEN. TRY LATER"; return; }

    const cb = `pj_mc_${Date.now()}`;
    const params = new URLSearchParams({ EMAIL: email, c: cb });
    if (form.PHONE.value.trim()) params.set("PHONE", form.PHONE.value.trim());
    if (cfg.mailchimp.honeypot) params.set(cfg.mailchimp.honeypot, "");
    const url = cfg.mailchimp.action.replace("/post?", "/post-json?") + "&" + params;

    const script = el("script", { src: url });
    const done = () => { delete window[cb]; script.remove(); };
    window[cb] = (res) => {
      done();
      if (res.result === "success") { form.reset(); msg.textContent = "OK: ADDRESS REGISTERED"; }
      else msg.textContent = /already subscribed/i.test(res.msg) ? "OK: ADDRESS ALREADY REGISTERED" : "ERR 03: TRANSMISSION FAILED. RETRY";
    };
    script.onerror = () => { done(); msg.textContent = "ERR 03: TRANSMISSION FAILED. RETRY"; };
    msg.textContent = "TRANSMITTING...";
    document.body.append(script);
  });
})();
