const $ = (id) => document.getElementById(id);

function fmtDate(d) {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return "";
  }
}

function userCard(u) {
  const courses = Array.isArray(u.courses) ? u.courses : [];

  const coursesHtml = courses.length
    ? `<ul class="learnList">
        ${courses.map(c => `
          <li>
            <strong>${c.title}</strong>
            <span class="muted"> (ID: ${c.courseId})</span>
            <div class="muted">Status: ${c.status} • Enrolled: ${fmtDate(c.enrolledAt)}</div>
          </li>
        `).join("")}
      </ul>`
    : `<div class="muted">No enrollments</div>`;

  return `
    <section class="panel" style="margin-bottom:16px;">
      <div class="panelHead">
        <div>
          <h3 class="sectionTitle" style="margin:0;">${u.email}</h3>
          <div class="muted">Role: ${u.role} • Created: ${fmtDate(u.createdAt)}</div>
        </div>
      </div>

      <div class="divider"></div>
      <h4 class="sectionTitle" style="margin-top:0;">Enrollments</h4>
      ${coursesHtml}
    </section>
  `;
}

async function loadUsers() {
  const grid = $("grid");
  const empty = $("empty");
  const count = $("count");

  const res = await api("/api/users/admin/users"); 
  const users = res.users || [];

  if (count) count.textContent = users.length ? `${users.length} total` : "";

  if (!users.length) {
    if (empty) empty.style.display = "block";
    if (grid) grid.innerHTML = "";
    return;
  }

  if (empty) empty.style.display = "none";
  grid.innerHTML = users.map(userCard).join("");
}


document.addEventListener("DOMContentLoaded", () => {
  loadUsers().catch(e => {
    console.error(e);
    alert(e.message || "Request failed");
  });
});
