(function () {
  const cfg = window.PJ;

  const el = (tag, props = {}, ...kids) => {
    const n = Object.assign(document.createElement(tag), props);
    kids.flat().forEach((k) => k != null && n.append(k));
    return n;
  };

  // Logo: split each line into characters for the staggered reveal
  let i = 0;
  document.querySelectorAll(".logo-line").forEach((line) => {
    [...line.dataset.text].forEach((c) => {
      const ch = el("span", { className: "ch", textContent: c });
      ch.style.setProperty("--i", i++);
      line.append(ch);
    });
  });

  // Releases
  const list = document.getElementById("release-list");
  cfg.releases.forEach((r) => {
    const id = `release-${r.cat.toLowerCase()}`;
    const links = r.links.map((l) =>
      el("li", {}, l.url
        ? el("a", { href: l.url, target: "_blank", rel: "noopener", textContent: l.label })
        : el("span", { textContent: `${l.label} (soon)` }))
    );
    const cover = r.cover
      ? el("img", { className: "cover", src: r.cover, alt: `${r.artist}, ${r.title}`, loading: "lazy" })
      : el("div", { className: "cover" });

    const toggle = el("span", { className: "toggle" });
    toggle.setAttribute("aria-hidden", "true");
    const head = el("button", { className: "release-head", type: "button" },
      el("span", { className: "cat", textContent: r.cat }),
      el("span", { className: "artist", textContent: r.artist }),
      el("span", { className: "title", textContent: r.title }),
      toggle,
    );
    head.setAttribute("aria-expanded", "false");
    head.setAttribute("aria-controls", id);

    const body = el("div", { className: "release-body", id },
      el("div", { className: "release-inner" },
        el("div", { className: "release-content" }, cover, el("ul", { className: "links" }, links))));
    body.inert = true;

    const item = el("li", { className: "release" }, head, body);
    head.addEventListener("click", () => {
      const open = item.classList.toggle("open");
      head.setAttribute("aria-expanded", String(open));
      body.inert = !open;
    });
    list.append(item);
  });

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
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { msg.textContent = "Please enter a valid email."; return; }
    if (document.getElementById("hp").value) return;
    if (!cfg.mailchimp.action) { msg.textContent = "Signup opens soon."; return; }

    const cb = `pj_mc_${Date.now()}`;
    const params = new URLSearchParams({ EMAIL: email, c: cb });
    if (form.PHONE.value.trim()) params.set("PHONE", form.PHONE.value.trim());
    if (cfg.mailchimp.honeypot) params.set(cfg.mailchimp.honeypot, "");
    const url = cfg.mailchimp.action.replace("/post?", "/post-json?") + "&" + params;

    const script = el("script", { src: url });
    const done = () => { delete window[cb]; script.remove(); };
    window[cb] = (res) => {
      done();
      if (res.result === "success") { form.reset(); msg.textContent = "Thanks. You're on the list."; }
      else msg.textContent = /already subscribed/i.test(res.msg) ? "You're already on the list." : "Something went wrong. Try again.";
    };
    script.onerror = () => { done(); msg.textContent = "Something went wrong. Try again."; };
    msg.textContent = "Sending…";
    document.body.append(script);
  });
})();
