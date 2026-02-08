const $ = (id) => document.getElementById(id);

let coursesCache = [];

function normalizeCourses(raw) {
  const list = Array.isArray(raw) ? raw : (raw.courses || []);
  return list.map((c) => ({
    _id: c._id,
    courseId: c.courseId,
    title: c.title || ""
  }));
}

function renderCoursesSelect() {
  const select = $("courseSelect");
  if (!select) return;

  select.innerHTML = coursesCache
    .map((c) => `<option value="${c.courseId}">${c.courseId} — ${c.title}</option>`)
    .join("");
}

async function loadCoursesOnce() {
  const data = await api("/api/courses");
  coursesCache = normalizeCourses(data);

  renderCoursesSelect();

  const select = $("courseSelect");
  if (select && coursesCache.length && !select.value) {
    select.value = String(coursesCache[0].courseId);
  }
}

async function handleSubmit(e) {
  e.preventDefault();

  const select = $("courseSelect");
  const courseId = select?.value;

  const course = coursesCache.find((c) => String(c.courseId) === String(courseId));
  if (!course) {
    alert("Course not selected");
    return;
  }

  const body = {
    course: course._id,
    title: $("title").value.trim(),
    content: $("content").value.trim(),
    duration: Number($("duration").value || 1),
    videoUrl: $("videoUrl").value.trim(),
  };

  try {
    await api("/api/lessons", { method: "POST", body });
    alert("Lesson created ✅");
    $("lessonForm")?.reset();
    if (select) select.value = String(courseId);
  } catch (err) {
    const msg = err?.message || "Request failed";
    const details = Array.isArray(err?.errors) ? "\n" + err.errors.join("\n") : "";
    alert(msg + details);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    $("lessonForm")?.addEventListener("submit", handleSubmit);
    await loadCoursesOnce();
  } catch (e) {
    console.error(e);
    alert(e.message || "Request failed");
  }
});
