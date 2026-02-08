const $ = (id) => document.getElementById(id);

function courseCard(c) {
  return `
    <article class="courseCard" data-id="${c.courseId}">
      <div class="courseImage">
        <img src="${c.cover}" alt="${c.title}">
      </div>
      <div class="courseBody">
        <h3 class="courseTitle">${c.title}</h3>
        <div class="courseMetaLine">
          <span class="courseChip">${c.category}</span>
          <span class="muted">ID: ${c.courseId}</span>
        </div>
      </div>
    </article>
  `;
}


async function loadMyCourses() {
  const grid = $("grid");
  const empty = $("empty");

  const res = await api("/api/enrollments/my");
  const courses = res.courses || [];

  if (!courses.length) {
    empty.style.display = "block";
    grid.innerHTML = "";
    return;
  }

  empty.style.display = "none";
  grid.innerHTML = courses.map(courseCard).join("");

  grid.querySelectorAll(".courseCard").forEach(card => {
    card.onclick = () => {
      const id = card.getAttribute("data-id");
      window.location.href = `./course.html?id=${id}`;
    };
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadMyCourses().catch(e => alert(e.message));
});
