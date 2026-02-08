const $ = (id) => document.getElementById(id);

function saveAuth(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

async function handleLogin(e) {
  e.preventDefault();

  const email = $("email").value.trim();
  const password = $("password").value;

  try {
    const res = await api("/api/auth/login", {
      method: "POST",
      body: { email, password }
    });

    saveAuth(res.token, res.user);
    alert("Logged in!");
    window.location.href = "./courses.html";
  } catch (err) {
    alert(err.message);
  }
}

async function handleRegister(e) {
  e.preventDefault();

  const email = $("email").value.trim();
  const password = $("password").value;

  try {
    await api("/api/auth/register", {
      method: "POST",
      body: { email, password }
    });

    alert("Registered ✅ Now log in");
    window.location.href = "./login.html";
  } catch (err) {
    const msg = err?.message || "Register failed";
    const details = Array.isArray(err?.errors) ? "\n" + err.errors.join("\n") : "";
    alert(msg + details);
  }
}


document.addEventListener("DOMContentLoaded", () => {
  console.log("auth.js loaded ✅");
  console.log("api exists?", typeof api);

  const loginForm = $("loginForm");
  console.log("loginForm?", loginForm);

  const registerForm = $("registerForm");
  console.log("registerForm?", registerForm);

  const email = $("email");
  const password = $("password");
  console.log("email input?", email, "password input?", password);

  if (loginForm) loginForm.addEventListener("submit", (e) => {
    console.log("login submit fired ✅");
    handleLogin(e);
  });

  if (registerForm) registerForm.addEventListener("submit", (e) => {
    console.log("register submit fired ✅");
    handleRegister(e);
  });
});
