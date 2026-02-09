const API_BASE = "";

async function api(path, opts = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(API_BASE + path, {
    method: opts.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: "Bearer " + token } : {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `HTTP ${res.status}`);
  }

  return data;
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

function setupAdminAccess() {
  const adminLink = document.getElementById("adminLink");
  if (!adminLink) return;

  adminLink.onclick = (e) => {
    e.preventDefault();

    const user = getUser();

    if (!user) {
      alert("Please login first");
      window.location.href = "/pages/login.html";
      return;
    }

    if (user.role !== "admin") {
      alert("Permission denied ❌\nOnly admin can view this page.");
      return;
    }

    window.location.href = "/pages/admin.html";
  };
}

document.addEventListener("DOMContentLoaded", () => {
  setupAdminAccess();
});
