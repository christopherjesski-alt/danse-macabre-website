// Rewards page: builds the donor wall from js/donors.js, counts the
// villager and zombie names still open, and shows the form link if set.
(function () {
  var donors = Array.isArray(window.DONORS) ? window.DONORS : [];
  var limits = window.REWARD_LIMITS || {};

  // Death leads the procession, so the wall runs from the top tier down.
  var TIERS = [
    { key: "death", name: "Death", fr: "la mort" },
    { key: "hermit", name: "The Hermit", fr: "l’ermite" },
    { key: "cure", name: "The Curé", fr: "le curé" },
    { key: "merchant", name: "The Merchant", fr: "la marchande" },
    { key: "friar", name: "The Friar", fr: "le cordelier" },
    { key: "clerk", name: "The Clerk", fr: "le clerc" },
    { key: "chambermaid", name: "The Chambermaid", fr: "la chambrière" },
    { key: "laborer", name: "The Laborer", fr: "le laboureur" },
    { key: "child", name: "The Child", fr: "l’enfant" }
  ];

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text != null) { node.textContent = text; }
    return node;
  }

  function namesIn(tierKey) {
    return donors.filter(function (d) {
      return d && d.tier === tierKey && typeof d.name === "string" && d.name.trim() !== "";
    });
  }

  // 1. Donor wall
  document.querySelectorAll("[data-donor-wall]").forEach(function (wall) {
    var frag = document.createDocumentFragment();
    TIERS.forEach(function (tier) {
      var group = el("div", "rw-group");
      var dt = el("dt");
      dt.appendChild(el("span", "rw-wall-tier", tier.name));
      dt.appendChild(document.createTextNode(" "));
      var fr = el("span", "rw-wall-fr", tier.fr);
      fr.lang = "fr";
      dt.appendChild(fr);
      var dd = el("dd");
      var list = namesIn(tier.key);
      if (list.length) {
        list.forEach(function (d) { dd.appendChild(el("span", null, d.name.trim())); });
      } else {
        dd.appendChild(el("span", "rw-empty",
          tier.key === "death" ? "Be the first to lead the dance." : "Be the first in this place."));
      }
      group.appendChild(dt);
      group.appendChild(dd);
      frag.appendChild(group);
    });
    wall.textContent = "";
    wall.appendChild(frag);
  });

  // 2. Villager and zombie names still open
  function count(keys) {
    return donors.filter(function (d) { return d && keys.indexOf(d.tier) !== -1; }).length;
  }
  function fill(kind, limit, used, fullText) {
    var left = Math.max(0, (Number(limit) || 0) - used);
    document.querySelectorAll('[data-left="' + kind + '"]').forEach(function (span) {
      if (left === 0) {
        var line = span.closest(".rw-limit") || span.parentNode;
        if (line) { line.textContent = fullText; }
      } else {
        span.textContent = String(left);
      }
    });
  }
  fill("villager", limits.villagers, count(["friar"]), "All villager names are claimed");
  fill("zombie", limits.zombies, count(["merchant", "cure", "hermit", "death"]), "All zombie names are claimed");

  // 3. Optional form link
  var formUrl = typeof window.REWARD_FORM_URL === "string" ? window.REWARD_FORM_URL.trim() : "";
  if (formUrl) {
    document.querySelectorAll("[data-form-link]").forEach(function (a) { a.href = formUrl; });
    document.querySelectorAll("[data-form-wrap]").forEach(function (w) { w.hidden = false; });
  }
})();
