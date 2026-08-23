/* Project gallery panel
   - Project names, status and image folders are managed in this list.
   - For sub folders, use folder + files. Example:
     { status: "active", name: "Villa Projesi", folder: "./assets/images/projects/villa", files: ["01.jpg", "02.jpg"] }
   - If files are named 01.jpg, 02.jpg, 03.jpg, you can use count + extension instead of files.
*/
window.projectGalleryItems = [
  {
    status: "active",
    name: "Onem Classic",
    location: "Beylerbeyi",
    folder: "./assets/images/projects/onem/",
    files: ["01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg", "06.jpg"],
  },
   {
    status: "active",
    name: "Aktif Proje",
    location: "Devam Eden Çalışma",
    folder: "./assets/images/banner",
    files: ["hero.webp"],
  },
  {
    status: "completed",
    name: "Tamamlanan Proje",
    location: "Teslim Edilen Çalışma",
    folder: "./assets/images/business",
    files: ["business.webp"],
  },
];

(function () {
  "use strict";

  var state = {
    filter: "active",
    projects: [],
    activeProject: null,
    activeImageIndex: 0,
  };

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }

    callback();
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function buildNumberedFiles(count, extension) {
    var files = [];
    var total = Number(count) || 0;
    var ext = extension || "jpg";

    for (var index = 1; index <= total; index += 1) {
      files.push(String(index).padStart(2, "0") + "." + ext.replace(/^\./, ""));
    }

    return files;
  }

  function resolveAsset(folder, file) {
    if (/^(https?:)?\/\//.test(file) || file.indexOf("./") === 0 || file.indexOf("/") === 0) {
      return file;
    }

    return folder ? folder + "/" + file : file;
  }

  function normalizeProject(project, index) {
    var files = Array.isArray(project.files) && project.files.length
      ? project.files
      : buildNumberedFiles(project.count, project.extension);
    var folder = project.folder ? project.folder.replace(/\/$/, "") : "";
    var images = files.map(function (file) {
      return resolveAsset(folder, file);
    });
    var cover = project.cover ? resolveAsset(folder, project.cover) : images[0] || "";

    if (!images.length && cover) {
      images = [cover];
    }

    return {
      id: project.id || "project-" + index,
      status: project.status === "completed" ? "completed" : "active",
      name: project.name || "Proje " + String(index + 1).padStart(2, "0"),
      location: project.location || "",
      images: images,
      cover: cover,
    };
  }

  function getProjectImages(project) {
    return project.images;
  }

  function getProjectCover(project) {
    return project.cover;
  }

  function getFilteredProjects() {
    return state.projects.filter(function (project) {
      return project.status === state.filter;
    });
  }

  function renderProjects(track) {
    var projects = getFilteredProjects();
    var isStatic = projects.length < 3;

    track.classList.toggle("is-static", isStatic);
    if (track.parentElement) {
      track.parentElement.classList.toggle("is-static", isStatic);
    }

    if (!projects.length) {
      track.innerHTML = '<div class="project-empty">Bu kategoride henüz proje bulunmuyor.</div>';
      return;
    }

    track.innerHTML = projects
      .map(function (project, index) {
        var imageCount = getProjectImages(project).length;
        return (
          '<article class="project-card" data-project-index="' + index + '">' +
          '<button class="project-card-media" type="button" aria-label="' + escapeHtml(project.name) + ' galerisini aç">' +
          '<img src="' + escapeHtml(getProjectCover(project)) + '" alt="' + escapeHtml(project.name) + '" loading="lazy" />' +
          '<span><i class="fal fa-expand"></i></span>' +
          "</button>" +
          '<div class="project-card-body">' +
          '<div>' +
          '<h3>' + escapeHtml(project.name) + "</h3>" +
          (project.location ? '<p>' + escapeHtml(project.location) + "</p>" : "") +
          "</div>" +
          '<small>' + imageCount + ' görsel</small>' +
          "</div>" +
          "</article>"
        );
      })
      .join("");
  }

  function updateLightbox(lightbox) {
    var images = state.activeProject ? getProjectImages(state.activeProject) : [];

    if (!state.activeProject || !images.length) {
      return;
    }

    var image = lightbox.querySelector("[data-lightbox-image]");
    var stack = lightbox.querySelector("[data-lightbox-stack]");
    var title = lightbox.querySelector("[data-lightbox-title]");
    var count = lightbox.querySelector("[data-lightbox-count]");
    var total = images.length;
    var activeImage = images[state.activeImageIndex];

    if (!stack) {
      stack = document.createElement("div");
      stack.className = "project-lightbox-stack";
      stack.setAttribute("data-lightbox-stack", "");
      image.insertAdjacentElement("afterend", stack);
    }

    image.src = activeImage;
    image.alt = state.activeProject.name;
    stack.innerHTML = images
      .map(function (src, index) {
        return '<img src="' + escapeHtml(src) + '" alt="' + escapeHtml(state.activeProject.name) + ' ' + String(index + 1) + '" loading="lazy" />';
      })
      .join("");
    title.textContent = state.activeProject.name;
    count.textContent = String(state.activeImageIndex + 1) + " / " + String(total);
  }

  function openLightbox(project, imageIndex, lightbox) {
    state.activeProject = project;
    state.activeImageIndex = imageIndex || 0;
    updateLightbox(lightbox);
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("project-gallery-open");
  }

  function closeLightbox(lightbox) {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("project-gallery-open");
  }

  function moveLightbox(direction, lightbox) {
    var images = state.activeProject ? getProjectImages(state.activeProject) : [];

    if (!state.activeProject || !images.length) {
      return;
    }

    var total = images.length;
    state.activeImageIndex = (state.activeImageIndex + direction + total) % total;
    updateLightbox(lightbox);
  }

  ready(function () {
    var gallery = document.querySelector("[data-project-gallery]");
    var track = document.getElementById("projectsTrack");
    var lightbox = document.querySelector("[data-project-lightbox]");

    if (!gallery || !track || !lightbox || !Array.isArray(window.projectGalleryItems)) {
      return;
    }

    state.projects = window.projectGalleryItems
      .filter(function (project) {
        return project && (project.files || project.count || project.cover);
      })
      .map(normalizeProject);

    renderProjects(track);

    gallery.querySelectorAll("[data-project-filter]").forEach(function (button) {
      button.addEventListener("click", function () {
        state.filter = button.dataset.projectFilter;
        gallery.querySelectorAll("[data-project-filter]").forEach(function (tab) {
          var isActive = tab === button;
          tab.classList.toggle("active", isActive);
          tab.setAttribute("aria-selected", isActive ? "true" : "false");
        });
        renderProjects(track);
        track.scrollTo({ left: 0, behavior: "smooth" });
      });
    });

    gallery.querySelectorAll("[data-project-nav]").forEach(function (button) {
      button.addEventListener("click", function () {
        if (track.classList.contains("is-static")) {
          return;
        }

        var direction = button.dataset.projectNav === "next" ? 1 : -1;
        track.scrollBy({ left: direction * Math.max(280, track.clientWidth * 0.82), behavior: "smooth" });
      });
    });

    track.addEventListener("click", function (event) {
      var card = event.target.closest(".project-card");
      var filteredProjects = getFilteredProjects();

      if (!card) {
        return;
      }

      openLightbox(filteredProjects[Number(card.dataset.projectIndex)], 0, lightbox);
    });

    lightbox.querySelector("[data-project-close]").addEventListener("click", function () {
      closeLightbox(lightbox);
    });

    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) {
        closeLightbox(lightbox);
      }
    });

    lightbox.querySelectorAll("[data-lightbox-nav]").forEach(function (button) {
      button.addEventListener("click", function () {
        moveLightbox(button.dataset.lightboxNav === "next" ? 1 : -1, lightbox);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (!lightbox.classList.contains("open")) {
        return;
      }

      if (event.key === "Escape") {
        closeLightbox(lightbox);
      }

      if (event.key === "ArrowRight") {
        moveLightbox(1, lightbox);
      }

      if (event.key === "ArrowLeft") {
        moveLightbox(-1, lightbox);
      }
    });
  });
})();
