const $ = (id) => document.getElementById(id);

const PROGRAM_CATS = new Set([
  "programming",
  "data science",
  "web development",
  "ai basics",
  "blockchain",
  "mobile dev"
]);

function isLoggedIn() {
  return !!localStorage.getItem("token");
}

function setupAuthButtons() {
  const loginBtn = $("loginBtn");
  const profileBtn = $("profileBtn");
  const logoutBtn = $("logoutBtn");

  if (!loginBtn || !profileBtn || !logoutBtn) return;

  if (isLoggedIn()) {
    loginBtn.style.display = "none";
    profileBtn.style.display = "inline-flex";
    logoutBtn.style.display = "inline-flex";
  } else {
    loginBtn.style.display = "inline-flex";
    profileBtn.style.display = "none";
    logoutBtn.style.display = "none";
  }

  logoutBtn.onclick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setupAuthButtons();
    alert("Logged out");
  };
}

function money(n) {
  return `$${Number(n || 0).toFixed(2)}`;
}

function stars() {
  return "★★★★★";
}

function normalizeCourse(c) {
  const courseId = Number(c.courseId);
  const category = c.category || "Programming";

  const packages = Array.isArray(c.packages) ? c.packages : ["basic", "premium", "vip"];
  const priceUsd = c.priceUsd || { basic: 0, premium: 0, vip: 0 };

  return {
    courseId,
    title: c.title || "",
    description: c.description || "",
    category,
    packages,
    priceUsd,
    rating: Number(c.rating || 0),
    reviews: Number(c.reviews || 0),
    cover: c.cover || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=80"
  };
}

async function fetchCourses() {
  const data = await api("/api/courses");
  const list = Array.isArray(data) ? data : (data.courses || []);
  return list.map(normalizeCourse);
}

function applyFilters(list, state) {
  let out = list.slice();

  out = out.filter(c => PROGRAM_CATS.has((c.category || "").toLowerCase()));

  if (state.category) {
    out = out.filter(c => (c.category || "").toLowerCase() === state.category.toLowerCase());
  }

  if (state.level) {
    out = out.filter(c => (c.packages || []).includes(state.level));
  }

  if (state.q) {
    const q = state.q.toLowerCase();
    out = out.filter(c =>
      (c.title || "").toLowerCase().includes(q) ||
      (c.description || "").toLowerCase().includes(q) ||
      (c.category || "").toLowerCase().includes(q)
    );
  }

  if (state.sort === "priceAsc") out.sort((a,b) => (a.priceUsd.basic ?? 0) - (b.priceUsd.basic ?? 0));
  if (state.sort === "priceDesc") out.sort((a,b) => (b.priceUsd.basic ?? 0) - (a.priceUsd.basic ?? 0));
  if (state.sort === "titleAsc") out.sort((a,b) => a.title.localeCompare(b.title));
  if (state.sort === "titleDesc") out.sort((a,b) => b.title.localeCompare(a.title));

  return out;
}

function courseCardHTML(c) {
  const defaultPkg = "vip";
  const shownId = c.courseId;

  return `
  <article class="courseCard" data-course="${c.courseId}" data-selected="${defaultPkg}">
    <div class="courseImage">
      <img src="${c.cover}" alt="${c.title}">
    </div>

    <div class="courseBody">
      <h3 class="courseTitle">${c.title}</h3>

      <div class="courseRating">
        <span class="courseRatingNum">${c.rating.toFixed(1)}</span>
        <span class="courseStars">${stars()}</span>
        <span class="courseReviews">(${c.reviews})</span>
      </div>

      <div class="coursePackages">
        <button class="coursePkgBtn" type="button" data-pkg="basic">Basic</button>
        <button class="coursePkgBtn" type="button" data-pkg="premium">Premium</button>
        <button class="coursePkgBtn coursePkgBtnActive" type="button" data-pkg="vip">VIP</button>
      </div>

      <div class="courseBottom">
        <div class="coursePrice">
          <span class="coursePriceValue" data-price>${money(c.priceUsd?.vip ?? 0)}</span>
          <span class="coursePriceUnit">USD</span>
        </div>

        <button class="buyBtn" data-buy="${c.courseId}" data-pkg="${defaultPkg}">
          Buy with USD
        </button>
      </div>

      <div class="courseMeta">
        Category: ${c.category} | courseId: ${shownId}
      </div>
    </div>
  </article>
  `;
}

async function initCoursesPage() {
  setupAuthButtons();

  const grid = $("grid");
  if (!grid) return;

  const state = { category: "", level: "", q: "", sort: "" };

  let all = [];
  try {
    all = await fetchCourses();
  } catch (e) {
    all = [];
  }

  function render() {
    const filtered = applyFilters(all, state);

    const empty = $("empty");
    if (empty) empty.style.display = filtered.length ? "none" : "block";

    grid.innerHTML = filtered.map(courseCardHTML).join("");

    grid.querySelectorAll(".courseCard").forEach(card => {
      const courseId = card.getAttribute("data-course");
      const course = all.find(x => String(x.courseId) === String(courseId));
      if (!course) return;

      const priceEl = card.querySelector("[data-price]");
      const buyBtn = card.querySelector("[data-buy]");

      card.addEventListener("click", (e) => {
        if (e.target.closest(".coursePkgBtn") || e.target.closest(".buyBtn")) return;
        window.location.href = `./course.html?id=${courseId}`;
      });

      const buy = card.querySelector(".buyBtn");
      if (buy) {
        buy.addEventListener("click", () => {
          const pkg = buy.getAttribute("data-pkg") || "vip";
          addToCart(courseId, pkg);
          alert("Added to cart ✅");
        });
      }

      card.querySelectorAll(".coursePkgBtn").forEach(btn => {
        btn.onclick = () => {
          const pkg = btn.getAttribute("data-pkg");

          card.querySelectorAll(".coursePkgBtn").forEach(x => x.classList.remove("coursePkgBtnActive"));
          btn.classList.add("coursePkgBtnActive");

          const newPrice = course.priceUsd?.[pkg] ?? course.priceUsd?.basic ?? 0;
          if (priceEl) priceEl.textContent = money(newPrice);

          if (buyBtn) buyBtn.setAttribute("data-pkg", pkg);
          card.setAttribute("data-selected", pkg);
        };
      });
    });
  }

  render();

  const q = $("q");
  const level = $("level");
  const sort = $("sort");
  const reset = $("resetBtn");

  if (q) q.addEventListener("input", () => { state.q = q.value.trim(); render(); });
  if (level) level.addEventListener("change", () => { state.level = level.value; render(); });
  if (sort) sort.addEventListener("change", () => { state.sort = sort.value; render(); });

  document.querySelectorAll(".pill").forEach(p => {
    p.addEventListener("click", () => {
      document.querySelectorAll(".pill").forEach(x => x.classList.remove("active"));
      p.classList.add("active");
      state.category = p.dataset.cat || "";
      render();
    });
  });

  if (reset) {
    reset.onclick = () => {
      state.category = "";
      state.level = "";
      state.q = "";
      state.sort = "";
      if (q) q.value = "";
      if (level) level.value = "";
      if (sort) sort.value = "";
      document.querySelectorAll(".pill").forEach(x => x.classList.remove("active"));
      const first = document.querySelector(".pill");
      if (first) first.classList.add("active");
      render();
    };
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("courses.js loaded");
  setupAuthButtons();
  if ($("grid")) initCoursesPage();
});
