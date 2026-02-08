const $ = (id) => document.getElementById(id);

let editingLessonId = null;

function setCreateMode() {
  editingLessonId = null;
  $("submitBtn").textContent = "Create";
  $("modeText").textContent = "Create mode";
  $("cancelEditBtn").style.display = "none";
}

function setEditMode(lesson) {
  editingLessonId = lesson._id;

  $("submitBtn").textContent = "Update";
  $("modeText").textContent = "Edit mode";
  $("cancelEditBtn").style.display = "inline-flex";

  $("title").value = lesson.title || "";
  $("content").value = lesson.content || "";
  $("duration").value = lesson.duration || 1;
  $("videoUrl").value = lesson.videoUrl || "";

  $("lessonForm").scrollIntoView({ behavior: "smooth" });
}

function toEmbed(url) {
  if (!url) return "";
  const u = String(url).trim();

  const m1 = u.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
  const m2 = u.match(/v=([a-zA-Z0-9_-]{6,})/);
  const id = (m1 && m1[1]) || (m2 && m2[1]);

  return id ? `https://www.youtube.com/embed/${id}` : u;
}

function lessonRow(lesson) {
  const hasVideo = !!(lesson.videoUrl && lesson.videoUrl.trim());
  const video = hasVideo
    ? `<a class="muted" href="${lesson.videoUrl}" target="_blank">video</a>`
    : `<span class="muted">no video</span>`;

  return `
    <div class="panel" style="padding:12px; margin-bottom:10px;">
      <div style="display:flex; justify-content:space-between; gap:12px; align-items:flex-start;">
        <div style="min-width:0;">
          <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
            <strong>${lesson.title || ""}</strong>
            <span class="muted">${lesson.duration || 0} min</span>
            ${video}
          </div>
          <div class="muted" style="margin-top:6px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${lesson.content || ""}
          </div>
        </div>

        <div style="display:flex; gap:8px; flex-shrink:0;">
          <button class="btn btnSoft" type="button" data-edit="${lesson._id}">Edit</button>
          <button class="btn btnSoft" type="button" data-del="${lesson._id}">Delete</button>
        </div>
      </div>
    </div>
  `;
}

async function loadCourses() {
  const select = $("courseSelect");
  select.innerHTML = "";

  const data = await api("/api/courses");
  const list = Array.isArray(data) ? data : (data.courses || []);

  if (!list.length) {
    select.innerHTML = `<option value="">No courses found</option>`;
    return;
  }

  select.innerHTML = list
    .map(c => `<option value="${c._id}" data-courseid="${c.courseId}">${c.courseId} — ${c.title}</option>`)
    .join("");
}

function selectedCourse() {
  const sel = $("courseSelect");
  const opt = sel.options[sel.selectedIndex];
  const courseMongoId = sel.value;
  const courseIdNumber = opt ? opt.getAttribute("data-courseid") : "";
  return { courseMongoId, courseIdNumber };
}

async function loadLessons() {
  const { courseIdNumber } = selectedCourse();

  const listWrap = $("lessonsList");
  const empty = $("lessonsEmpty");
  const count = $("lessonsCount");

  listWrap.innerHTML = "";
  if (empty) empty.style.display = "none";
  if (count) count.textContent = "";

  if (!courseIdNumber) return;

  const res = await api(`/api/lessons/by-course/${courseIdNumber}`);
  const lessons = res.lessons || [];

  if (count) count.textContent = lessons.length ? `${lessons.length} total` : "";

  if (!lessons.length) {
    empty.style.display = "block";
    return;
  }

  listWrap.innerHTML = lessons.map(lessonRow).join("");

  listWrap.querySelectorAll("[data-edit]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-edit");
      const lesson = lessons.find(x => x._id === id);
      if (!lesson) return;
      setEditMode(lesson);
    });
  });

  listWrap.querySelectorAll("[data-del]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-del");
      const ok = confirm("Delete this lesson?");
      if (!ok) return;

      await api(`/api/lessons/${id}`, { method: "DELETE" });
      setCreateMode();
      $("lessonForm").reset();
      await loadLessons();
      alert("Deleted ✅");
    });
  });
}

async function submitLesson(e) {
  e.preventDefault();

  const { courseMongoId } = selectedCourse();

  const title = $("title").value.trim();
  const content = $("content").value.trim();
  const duration = Number($("duration").value || 0);
  const videoUrl = $("videoUrl").value.trim();

  const body = {
    course: courseMongoId,
    title,
    content,
    duration,
    videoUrl: videoUrl ? toEmbed(videoUrl) : ""
  };

  if (!editingLessonId) {
    await api("/api/lessons", { method: "POST", body });
    $("lessonForm").reset();
    await loadLessons();
    alert("Lesson created ✅");
    return;
  }

  await api(`/api/lessons/${editingLessonId}`, { method: "PUT", body });
  setCreateMode();
  $("lessonForm").reset();
  await loadLessons();
  alert("Lesson updated ✅");
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadCourses();
    setCreateMode();
    await loadLessons();

    $("courseSelect").addEventListener("change", async () => {
      setCreateMode();
      $("lessonForm").reset();
      await loadLessons();
    });

    $("cancelEditBtn").addEventListener("click", () => {
      setCreateMode();
      $("lessonForm").reset();
    });

    $("lessonForm").addEventListener("submit", submitLesson);
  } catch (e) {
    console.error(e);
    alert(e.message || "Request failed");
  }
});
