// Fills every progress box from js/funding.js.
(function () {
  var f = window.FUNDING || {};
  var raised = Number(f.raised) || 0;
  var goal = Number(f.goal) || 0;
  var pct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 1000) / 10) : 0;
  var money = function (n) { return "$" + n.toLocaleString("en-US"); };

  document.querySelectorAll("[data-funding]").forEach(function (box) {
    box.querySelectorAll("[data-raised]").forEach(function (el) { el.textContent = money(raised); });
    box.querySelectorAll("[data-goal]").forEach(function (el) { el.textContent = money(goal); });
    box.querySelectorAll("[data-percent]").forEach(function (el) { el.textContent = pct + "%"; });
    var bar = box.querySelector(".bar");
    var fill = box.querySelector(".bar-fill");
    if (bar) { bar.setAttribute("aria-valuenow", String(pct)); }
    if (fill) { requestAnimationFrame(function () { fill.style.width = pct + "%"; }); }
  });

  var year = document.querySelector("[data-year]");
  if (year) { year.textContent = new Date().getFullYear(); }
})();

// Share the film: native share sheet where supported, copy link everywhere.
// Buttons start hidden so visitors without JavaScript just see the address.
(function () {
  var URL_ = "https://danse-macabrefilm.com/";
  var TITLE = "Danse Macabre";
  var TEXT = "Help bring Danse Macabre to life: a medieval action horror short film set during the Black Plague. Discover the story and support the production.";

  // Try the modern clipboard API first; if it is missing or refused, fall back
  // to the older copy command; only if both fail do we show the address.
  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () { return legacyCopy(text); });
    }
    return legacyCopy(text);
  }

  function legacyCopy(text) {
    return new Promise(function (resolve, reject) {
      var t = document.createElement("textarea");
      t.value = text;
      t.setAttribute("readonly", "");
      t.style.position = "fixed";
      t.style.opacity = "0";
      document.body.appendChild(t);
      t.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(t);
      if (ok) { resolve(); } else { reject(new Error("copy failed")); }
    });
  }

  document.querySelectorAll("[data-share]").forEach(function (box) {
    var status = box.querySelector(".share-status");
    var timer;
    function say(msg) {
      if (!status) { return; }
      status.textContent = msg;
      clearTimeout(timer);
      timer = setTimeout(function () { status.textContent = ""; }, 5000);
    }
    function copyLink() {
      copy(URL_).then(
        function () { say("Link copied."); },
        function () { say("Copy this link: " + URL_); }
      );
    }

    var copyBtn = box.querySelector("[data-share-copy]");
    if (copyBtn) {
      copyBtn.hidden = false;
      copyBtn.addEventListener("click", copyLink);
    }

    var nativeBtn = box.querySelector("[data-share-native]");
    if (nativeBtn && typeof navigator.share === "function") {
      nativeBtn.hidden = false;
      nativeBtn.addEventListener("click", function () {
        navigator.share({ title: TITLE, text: TEXT, url: URL_ }).catch(function (err) {
          if (err && err.name === "AbortError") { return; } // visitor closed the share sheet
          copyLink();
        });
      });
    }
  });
})();
