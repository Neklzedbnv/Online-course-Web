const $ = (id) => document.getElementById(id);

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  console.log("token exists?", !!token);

  if (!token) {
    alert("No token found. Please log in again.");
    window.location.href = "./login.html";
    return;
  }

  try {
    const res = await api("/api/users/profile");
    console.log("profile response", res);

    $("email").value = res.user.email;
  } catch (e) {
    console.log("profile error", e);
    alert(e.message || "Failed to load profile");
    window.location.href = "./login.html";
  }
});

$("profileForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = $("email").value.trim();
  const password = $("password").value;

  const body = {};
  if (email) body.email = email;
  if (password) body.password = password;

  if (Object.keys(body).length === 0) {
    alert("Nothing to update");
    return;
  }

  try {
    const res = await api("/api/users/profile", {
      method: "PUT",
      body
    });

    alert("Profile updated ✅");
    $("password").value = "";
  } catch (err) {
    console.log("update error", err);
    const msg = err?.message || "Update failed";
    const details = Array.isArray(err?.errors) ? "\n" + err.errors.join("\n") : "";
    alert(msg + details);
  }
});
