/*
  Najma Abdi – portefølje
  Hatteeske-åpningen, brevregnet, lysslyngen, lappene som lander og brevskjemaet.
*/

const intro = document.getElementById("intro");
const box = document.getElementById("hatbox");
const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function hearts(x, y) {
  const colors = ["#F7C6D0", "#FFE7A3", "#C9425F", "#E3D7F4", "#A9DCD3"];
  for (let i = 0; i < 14; i++) {
    const h = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    h.setAttribute("viewBox", "0 0 24 24");
    h.setAttribute("aria-hidden", "true");
    h.classList.add("burst");
    h.innerHTML = '<path d="M12 21s-8-5.3-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.7-8 11-8 11z" fill="' + colors[i % colors.length] + '" stroke="#3A2A3F" stroke-width="1.4"/>';
    const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.4;
    const dist = 90 + Math.random() * 90;
    h.style.left = x - 11 + "px";
    h.style.top = y - 11 + "px";
    h.style.setProperty("--x", Math.cos(angle) * dist + "px");
    h.style.setProperty("--y", Math.sin(angle) * dist + "px");
    h.style.setProperty("--rot", (Math.random() * 90 - 45) + "deg");
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 1000);
  }
}

function finish() {
  intro.hidden = true;
  intro.classList.remove("opening");
  document.body.classList.remove("locked");
  document.getElementById("hei").focus({ preventScroll: true });
}

function letterRain(x, y) {
  const colors = ["#FFFDF8", "#F7C6D0", "#FFE7A3", "#E3D7F4", "#D8F0EA", "#FBE1E7"];
  const seals = ["#C9425F", "#E0819A", "#9B7CC9", "#3E9C8E"];
  const small = window.innerWidth < 600;
  const n = small ? 30 : 46;
  const W = window.innerWidth, H = window.innerHeight;
  for (let i = 0; i < n; i++) {
    const el = document.createElement("div");
    el.className = "flying";
    el.setAttribute("aria-hidden", "true");
    const size = (small ? 30 : 38) + Math.random() * (small ? 22 : 30);
    const c = colors[i % colors.length];
    const isNote = i % 5 === 0;
    el.innerHTML = isNote
      ? '<svg viewBox="0 0 32 40"><rect x="1" y="1" width="30" height="38" rx="2" fill="' + c + '" stroke="#3A2A3F" stroke-width="1.6"/><path d="M6 11h20M6 17h20M6 23h14M6 29h17" stroke="#E0819A" stroke-width="1.6" stroke-linecap="round"/></svg>'
      : '<svg viewBox="0 0 40 28"><rect x="1" y="1" width="38" height="26" rx="2" fill="' + c + '" stroke="#3A2A3F" stroke-width="1.6"/><path d="M1.5 2 L20 15 L38.5 2" fill="none" stroke="#3A2A3F" stroke-width="1.6"/><path d="M20 22s-4.4-2.8-4.4-5.9a2.4 2.4 0 0 1 4.4-1.3 2.4 2.4 0 0 1 4.4 1.3c0 3.1-4.4 5.9-4.4 5.9z" fill="' + seals[i % seals.length] + '"/></svg>';
    el.style.width = size + "px";
    el.style.left = x - size / 2 + "px";
    el.style.top = y - size / 2 + "px";
    document.body.appendChild(el);
    const dx = (Math.random() * 2 - 1) * W * 0.55;
    const peak = -(H * (0.22 + Math.random() * 0.38));
    const fall = H * 1.05 + Math.random() * 160;
    const r1 = Math.random() * 120 - 60;
    const r2 = r1 + (Math.random() * 480 - 240);
    const sway = (Math.random() * 2 - 1) * 60;
    const anim = el.animate([
      { transform: "translate(0,0) rotate(0) scale(.3)", easing: "cubic-bezier(.2,.9,.4,1)" },
      { transform: "translate(" + dx * 0.45 + "px," + peak + "px) rotate(" + r1 + "deg) scale(1)", offset: 0.3, easing: "ease-in-out" },
      { transform: "translate(" + (dx * 0.75 + sway) + "px," + (peak * 0.1 + H * 0.2) + "px) rotate(" + (r1 + r2) / 2 + "deg) scale(1)", offset: 0.62, easing: "ease-in" },
      { transform: "translate(" + (dx - sway * 0.5) + "px," + fall + "px) rotate(" + r2 + "deg) scale(1)" }
    ], { duration: 2800 + Math.random() * 1600, delay: i * 22 + Math.random() * 220, fill: "forwards" });
    anim.onfinish = () => el.remove();
  }
}

box.addEventListener("click", () => {
  if (calm) { finish(); return; }
  intro.classList.add("opening");
  const r = box.getBoundingClientRect();
  setTimeout(() => letterRain(r.left + r.width / 2, r.top + r.height * 0.42), 420);
  setTimeout(finish, 3300);
});

document.getElementById("replay").addEventListener("click", () => {
  window.scrollTo(0, 0);
  intro.hidden = false;
  document.body.classList.add("locked");
  box.focus();
});

// Skriv et brev
const composer = document.getElementById("composer");
const msg = document.getElementById("msg");
const from = document.getElementById("from");
const statusEl = document.getElementById("status");
const sentEl = document.getElementById("sent");
const miniEnv = composer.querySelector(".mini-env");

document.querySelectorAll('input[name="wax"]').forEach((r) => {
  r.addEventListener("change", () => composer.style.setProperty("--wax", r.value));
});
composer.style.setProperty("--wax", "#C9425F");
msg.addEventListener("input", () => { statusEl.textContent = ""; });

function openMail() {
  const name = from.value.trim();
  const subject = name ? "Brev fra " + name : "Et brev til deg";
  const body = "Kjære Najma,\n\n" + msg.value.trim() + "\n\nHilsen " + (name || "");
  window.location.href = "mailto:najma845abdi@outlook.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
}

document.getElementById("send").addEventListener("click", () => {
  if (!msg.value.trim()) {
    statusEl.textContent = "Skriv noen ord i brevet først ♡";
    msg.focus();
    return;
  }
  statusEl.textContent = "";
  if (calm) {
    composer.classList.add("done");
    openMail();
    sentEl.focus();
    return;
  }
  composer.classList.add("sending");
  setTimeout(() => {
    const box = miniEnv.getBoundingClientRect();
    hearts(box.left + box.width / 2, box.top + box.height * 0.62);
  }, 1150);
  setTimeout(openMail, 2300);
  setTimeout(() => {
    composer.classList.remove("sending");
    composer.classList.add("done");
    sentEl.focus();
  }, 2750);
});

document.getElementById("again").addEventListener("click", () => {
  composer.classList.remove("done");
  msg.value = "";
  msg.focus();
});

// Lysslynge som tilpasser seg skjermbredden
function drawLights() {
  const svg = document.querySelector(".lights");
  const w = Math.round(svg.getBoundingClientRect().width);
  if (!w) return;
  const n = Math.max(4, Math.round(w / 110));
  const seg = w / n;
  const colors = ["#FFE7A3", "#F7C6D0", "#FFFDF8"];
  let d = "M0 6";
  let bulbs = "";
  for (let i = 0; i < n; i++) {
    const cx = i * seg + seg / 2;
    d += " Q" + cx + " 42 " + (i + 1) * seg + " 6";
    bulbs += '<line x1="' + cx + '" y1="24" x2="' + cx + '" y2="31" stroke="#3A2A3F" stroke-width="1.5"/>' +
      '<rect x="' + (cx - 3.5) + '" y="30" width="7" height="5" rx="1" fill="#3A2A3F"/>' +
      '<ellipse class="bulb" cx="' + cx + '" cy="44" rx="7" ry="9.5" fill="' + colors[i % 3] + '" stroke="#3A2A3F" stroke-width="1.5"/>';
  }
  svg.setAttribute("viewBox", "0 0 " + w + " 64");
  svg.innerHTML = '<path d="' + d + '" fill="none" stroke="#3A2A3F" stroke-width="1.5"/>' + bulbs;
}
drawLights();
let rt;
window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(drawLights, 150); });

// Lappene "lander" når du scroller til dem
const notes = document.querySelectorAll(".note.reveal");
if ("IntersectionObserver" in window && !calm) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  notes.forEach((n) => io.observe(n));
} else {
  notes.forEach((n) => n.classList.add("in"));
}
