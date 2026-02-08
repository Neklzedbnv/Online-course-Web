const $ = (id) => document.getElementById(id);

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
    window.location.href = "./login.html";
  };
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  } catch {
    return [];
  }
}

function setCart(items) {
  localStorage.setItem("cart", JSON.stringify(items));
  updateCartCount();
}

function updateCartCount() {
  const c = getCart().reduce((a, it) => a + (it.qty || 1), 0);
  const el = $("cartCount");
  if (el) el.textContent = String(c);
}

function addToCart(courseId, pkg) {
  const cart = getCart();
  const key = `${courseId}:${pkg}`;
  const i = cart.findIndex((x) => x.key === key);
  if (i >= 0) cart[i].qty += 1;
  else cart.push({ key, courseId, pkg, qty: 1 });
  setCart(cart);
}

function money(n) {
  return `$${Number(n || 0).toFixed(2)}`;
}

function stars() {
  return "★★★★★";
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function ytToEmbed(url) {
  if (!url) return "";
  if (url.includes("youtube.com/embed/")) return url;

  const m1 = url.match(/[?&]v=([^&]+)/);
  if (m1) return `https://www.youtube.com/embed/${m1[1]}`;

  const m2 = url.match(/youtu\.be\/([^?]+)/);
  if (m2) return `https://www.youtube.com/embed/${m2[1]}`;

  return url;
}

function closeVideo() {
  const panel = $("watchPanel");
  const frame = $("videoFrame");
  if (!panel || !frame) return;
  frame.src = "";
  panel.style.display = "none";
}

function openVideo(title, url) {
  const panel = $("watchPanel");
  const frame = $("videoFrame");
  const titleEl = $("watchTitle");

  const embed = ytToEmbed(url);
  if (!embed) {
    alert("No video for this lesson");
    return;
  }

  if (titleEl) titleEl.textContent = title || "Lesson";
  panel.style.display = "block";
  frame.src = embed + (embed.includes("?") ? "&" : "?") + "autoplay=1";
  panel.scrollIntoView({ behavior: "smooth" });
}

function setupPanelClickToClose() {
  const panel = $("watchPanel");
  const frame = $("videoFrame");
  if (!panel || !frame) return;

  panel.addEventListener("click", () => {
    closeVideo();
  });

  frame.addEventListener("click", (e) => {
    e.stopPropagation();
  });
}

async function loadCourse(courseId) {
  const course = await api(`/api/courses/${courseId}`);

  $("cover").src = course.cover || "";
  $("title").textContent = course.title || "";
  $("desc").textContent = course.description || "";
  $("catTag").textContent = course.category || "";

  const defaultPkg = "vip";
  $("lvlTag").textContent = defaultPkg.toUpperCase();

  const price = course.priceUsd?.[defaultPkg] ?? course.priceUsd?.basic ?? 0;
  $("price").textContent = money(price);

  $("stars").textContent = stars();
  $("reviews").textContent = `(${course.reviews || 0})`;

  return course;
}


function renderLearnList(course) {
  const learn = $("learn");
  if (!learn) return;
  learn.innerHTML = "";

  const items = [
    `Understand ${course.title || "this course"} basics`,
    "Practice with examples",
    "Build a small project",
  ];

  items.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t;
    learn.appendChild(li);
  });
}

async function loadLessons(courseId) {
  const listEl = $("lessons");
  const countEl = $("lessonsCount");
  if (!listEl || !countEl) return;

  const data = await api(`/api/lessons/by-course/${courseId}`);
  const lessons = data.lessons || [];

  countEl.textContent = lessons.length ? `${lessons.length} lessons` : "No lessons";
  listEl.innerHTML = "";

  lessons.forEach((l, idx) => {
    const div = document.createElement("div");
    div.className = "lessonItem";
    div.innerHTML = `
      <div class="lessonTitle">${idx + 1}. ${l.title}</div>
      <div class="muted">${l.duration} min</div>
    `;
    div.onclick = () => openVideo(l.title, l.videoUrl);
    listEl.appendChild(div);
  });
}


async function setupEnroll(courseId) {
  const enrollBtn = $("enrollBtn");
  if (!enrollBtn) return;

  enrollBtn.onclick = async () => {
    if (!isLoggedIn()) {
      alert("Please login first");
      window.location.href = "./login.html";
      return;
    }

    try {
      await api(`/api/enrollments/${courseId}`, { method: "POST" });
      alert("Enrolled ✅");
    } catch (e) {
      alert(e.message);
    }
  };
}


document.addEventListener("DOMContentLoaded", async () => {
  setupAuthButtons();
  updateCartCount();
  setupPanelClickToClose();

  const courseId = getQueryParam("id");
  if (!courseId) {
    alert("No course id in URL");
    return;
  }

  try {
    closeVideo();

    const course = await loadCourse(courseId);
    renderLearnList(course);

    await loadLessons(courseId);
    setupEnroll(courseId);
  } catch (e) {
    console.error(e);
    alert(e.message || "Failed to load course");
  }
});
