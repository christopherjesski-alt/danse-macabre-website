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
