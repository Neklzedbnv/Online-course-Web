const $ = (id) => document.getElementById(id);

function selectedPackages() {
  const out = [];
  if ($("pkgBasic")?.checked) out.push("basic");
  if ($("pkgPremium")?.checked) out.push("premium");
  if ($("pkgVip")?.checked) out.push("vip");
  return out.length ? out : ["basic", "premium", "vip"];
}

async function initCreateCourse() {
  const form = $("createCourseForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const body = {
      courseId: Number($("courseId").value),
      title: $("title").value.trim(),
      description: $("description").value.trim(),
      category: $("category").value,
      cover: $("cover").value.trim(),
      packages: selectedPackages(),
      priceUsd: {
        basic: Number($("priceBasic").value),
        premium: Number($("pricePremium").value),
        vip: Number($("priceVip").value),
      },
    };

    try {
      await api("/api/courses", { method: "POST", body });
      alert("Course created ✅");
      window.location.href = "./manage-courses.html";
    } catch (err) {
      const msg = err?.message || "Create failed";
      const details = Array.isArray(err?.errors) ? "\n" + err.errors.join("\n") : "";
      alert(msg + details);
    }
  });
}

function courseRow(course) {
  const price = course?.priceUsd?.basic ?? 0;
  return `
    <div class="lessonItem">
      <div class="lessonMain">
        <div class="lessonTitle">${course.title} <span class="muted">#${course.courseId}</span></div>
        <div class="muted">${course.category} • from $${price}</div>
      </div>
      <div class="lessonMeta">
        <button class="btn btnSoft" data-del="${course.courseId}">Delete</button>
      </div>
    </div>
  `;
}

async function initManageCourses() {
  const list = $("coursesAdminList");
  if (!list) return;

  try {
    const courses = await api("/api/courses");
    $("count").textContent = `${courses.length} courses`;

    list.innerHTML = courses.map(courseRow).join("");

    list.addEventListener("click", async (e) => {
      const btn = e.target.closest("[data-del]");
      if (!btn) return;

      const courseId = btn.getAttribute("data-del");
      const ok = confirm(`Delete course #${courseId}?`);
      if (!ok) return;

      try {
        await api(`/api/courses/${courseId}`, { method: "DELETE" });
        btn.closest(".lessonItem")?.remove();
        const left = list.querySelectorAll(".lessonItem").length;
        $("count").textContent = `${left} courses`;
      } catch (err) {
        alert(err?.message || "Delete failed");
      }
    });
  } catch (err) {
    alert(err?.message || "Failed to load courses");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof requireAdmin === "function") {
    const path = window.location.pathname;
    if (path.includes("/admin.html") || path.includes("/create-course.html") || path.includes("/manage-courses.html")) {
      if (!requireAdmin()) return;
    }
  }

  initCreateCourse();
  initManageCourses();
});
