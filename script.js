(() => {
  "use strict";

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  // ---------------------------
  // Code rain — lightweight canvas
  // ---------------------------
  const canvas = $("#code-rain");
  const ctx = canvas.getContext("2d", { alpha: true });
  const glyphs = "01{}[]<>/\\\\=+*#@$;:JAVA PYTHON JS CSS SQL".split("");
  let columns = [], fontSize = 12, width = 0, height = 0;

  function resizeRain() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth; height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fontSize = width < 600 ? 10 : 12;
    const count = Math.ceil(width / fontSize);
    columns = Array.from({ length: count }, () => Math.random() * -height / fontSize);
  }

  function rain() {
    ctx.fillStyle = "rgba(8,8,10,.075)";
    ctx.fillRect(0, 0, width, height);
    ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
    columns.forEach((y, i) => {
      const ch = glyphs[(Math.random() * glyphs.length) | 0];
      const x = i * fontSize;
      ctx.fillStyle = Math.random() > .975 ? "rgba(255,150,80,.85)" : "rgba(255,107,0,.34)";
      ctx.fillText(ch, x, y * fontSize);
      columns[i] = y * fontSize > height && Math.random() > .985 ? 0 : y + 1;
    });
    requestAnimationFrame(rain);
  }
  resizeRain(); rain();
  window.addEventListener("resize", resizeRain, { passive: true });

  // ---------------------------
  // Custom cursor + coordinates
  // ---------------------------
  const cursor = $(".cursor");
  const coords = $(".cursor-coords");
  let mx = 0, my = 0, cx = 0, cy = 0;
  window.addEventListener("pointermove", e => {
    mx = e.clientX; my = e.clientY;
    coords.textContent = `X:${String(mx).padStart(3,"0")} Y:${String(my).padStart(3,"0")}`;
  }, { passive: true });
  function cursorLoop() {
    cx += (mx - cx) * .18; cy += (my - cy) * .18;
    cursor.style.transform = `translate3d(${cx}px,${cy}px,0) translate(-50%,-50%)`;
    requestAnimationFrame(cursorLoop);
  }
  cursorLoop();

  // ---------------------------
  // Typewriter
  // ---------------------------
  const roles = ["DESENVOLVEDOR EM FORMAÇÃO", "JAVA / PYTHON / WEB", "BUILDING DIGITAL SOLUTIONS"];
  let roleIndex = 0, charIndex = 0, deleting = false;
  const typing = $("#typing");
  function typeRole() {
    const word = roles[roleIndex];
    typing.textContent = word.slice(0, charIndex);
    if (!deleting && charIndex < word.length) charIndex++;
    else if (deleting && charIndex > 0) charIndex--;
    else if (!deleting) { deleting = true; setTimeout(typeRole, 1300); return; }
    else { deleting = false; roleIndex = (roleIndex + 1) % roles.length; }
    setTimeout(typeRole, deleting ? 35 : 65);
  }
  typeRole();

  // ---------------------------
  // Bio typing inside code
  // ---------------------------
  const bioText = "transformar experiência em software útil, claro e bem construído";
  const bio = $("#bio-typed");
  let b = 0;
  function typeBio() {
    if (b <= bioText.length) { bio.textContent = bioText.slice(0, b++); setTimeout(typeBio, 38); }
  }
  setTimeout(typeBio, 500);

  // ---------------------------
  // Language compile interaction
  // ---------------------------
  const consoleText = $("#compile-text");
  const compileMessages = {
    Java: "javac Filipe.java  →  BUILD OK  •  0 errors",
    Python: "python Filipe.py  →  EXECUTED  •  output ready",
    JavaScript: "node Filipe.js  →  BUILD OK  •  runtime online",
    HTML: "html5check index.html  →  VALID  •  semantic markup",
    CSS: "css-compile style.css  →  CLEAN  •  responsive",
    SQL: "query Filipe.db  →  CONNECTED  •  rows available"
  };
  $$(".lang").forEach(lang => {
    const key = lang.dataset.lang;
    lang.addEventListener("mouseenter", () => {
      consoleText.textContent = compileMessages[key];
    });
    lang.addEventListener("mouseleave", () => {
      consoleText.textContent = "Passe o mouse sobre uma linguagem para compilar.";
    });
  });

  // ---------------------------
  // 3D portrait tilt
  // ---------------------------
  const portrait = $("#portrait");
  const frame = $(".portrait-frame", portrait);
  if (window.matchMedia("(pointer:fine)").matches) {
    portrait.addEventListener("pointermove", e => {
      const r = portrait.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      frame.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 7}deg) translateZ(6px)`;
    });
    portrait.addEventListener("pointerleave", () => {
      frame.style.transform = "";
    });
  }

  // ---------------------------
  // Magnetic buttons
  // ---------------------------
  $$(".magnetic").forEach(el => {
    if (!window.matchMedia("(pointer:fine)").matches) return;
    el.addEventListener("pointermove", e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width/2)) * .08;
      const y = (e.clientY - (r.top + r.height/2)) * .08;
      el.style.transform = `translate(${x}px,${y}px)`;
    });
    el.addEventListener("pointerleave", () => el.style.transform = "");
  });

  // ---------------------------
  // Reveal on scroll
  // ---------------------------
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  $$(".reveal").forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 45, 260)}ms`;
    observer.observe(el);
  });

  // ---------------------------
  // Local clock + system uptime
  // ---------------------------
  const timeEl = $("#local-time"), uptimeEl = $("#uptime"), started = performance.now();
  function tick() {
    const now = new Date();
    timeEl.textContent = now.toLocaleTimeString("pt-BR", { hour12: false });
    const sec = Math.floor((performance.now() - started) / 1000);
    const h = String(Math.floor(sec / 3600)).padStart(2,"0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2,"0");
    const s = String(sec % 60).padStart(2,"0");
    if (uptimeEl.dataset.server !== "true") uptimeEl.textContent = `${h}:${m}:${s}`;
  }
  tick(); setInterval(tick, 1000);

  // If hosted through PHP, replace the page uptime with real server uptime.
  fetch("status.php", { cache: "no-store" })
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(data => {
      if (data && data.server_uptime && data.server_uptime !== "N/A") {
        uptimeEl.textContent = data.server_uptime;
        uptimeEl.dataset.server = "true";
        uptimeEl.title = `Servidor: PHP ${data.php}`;
      }
    })
    .catch(() => { /* static hosting: browser uptime remains active */ });

  $("#year").textContent = new Date().getFullYear();

  // Hide cursor when pointer leaves viewport.
  document.addEventListener("mouseleave", () => cursor.style.opacity = "0");
  document.addEventListener("mouseenter", () => cursor.style.opacity = "1");
})();
