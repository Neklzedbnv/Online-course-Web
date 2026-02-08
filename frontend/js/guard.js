function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function requireLogin() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "./login.html";
    return false;
  }
  return true;
}

function requireAdmin() {
  if (!requireLogin()) return false;
  const user = getUser();
  const role = String(user?.role || "").toLowerCase();
  if (role !== "admin") {
    window.location.href = "./courses.html";
    return false;
  }
  return true;
}
