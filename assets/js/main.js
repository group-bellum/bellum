(function () {
  "use strict";

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }

    callback();
  }

  window.addEventListener("load", function () {
    document.body.classList.add("loaded");
  });

  ready(function () {
    var header = document.querySelector(".header--sticky");
    var menuButton = document.querySelector(".menu-btn");
    var sideBar = document.getElementById("side-bar");
    var closeButton = document.querySelector(".close-icon-menu");
    var progressWrap = document.querySelector(".progress-wrap");
    var progressPath = document.querySelector(".progress-wrap path");

    function updateStickyHeader() {
      if (!header) {
        return;
      }

      header.classList.toggle("sticky", window.scrollY > 150);
    }

    function toggleSidebar(show) {
      if (sideBar) {
        sideBar.classList.toggle("show", show);
      }
    }

    function updateProgress() {
      if (!progressWrap || !progressPath) {
        return;
      }

      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pathLength = progressPath.getTotalLength();
      var progress = scrollableHeight > 0 ? scrollTop / scrollableHeight : 0;

      progressPath.style.strokeDasharray = pathLength + " " + pathLength;
      progressPath.style.strokeDashoffset = pathLength - progress * pathLength;
      progressWrap.classList.toggle("active-progress", scrollTop > 50);
    }

    function animateOdometers() {
      document.querySelectorAll(".odometer").forEach(function (element) {
        if (element.dataset.done === "true") {
          return;
        }

        var rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          element.textContent = element.dataset.count || element.textContent;
          element.dataset.done = "true";
        }
      });
    }

    function animateRadialProgress() {
      document.querySelectorAll("svg.radial-progress").forEach(function (svg) {
        if (svg.dataset.done === "true") {
          return;
        }

        var rect = svg.getBoundingClientRect();
        if (rect.top >= window.innerHeight || rect.bottom < 0) {
          return;
        }

        var circle = svg.querySelector("circle.bar--animated");
        var text = svg.querySelector(".countervalue");
        var value = Number(svg.dataset.countervalue || 0);

        if (circle) {
          var radius = Number(circle.getAttribute("r") || 0);
          var circumference = 2 * Math.PI * radius;
          circle.style.strokeDasharray = circumference;
          circle.style.strokeDashoffset = circumference - (value / 100) * circumference;
        }

        if (text) {
          text.textContent = value + "%";
          text.classList.remove("start");
        }

        svg.dataset.done = "true";
      });
    }

    function onScroll() {
      updateStickyHeader();
      updateProgress();
      animateOdometers();
      animateRadialProgress();
    }

    if (menuButton) {
      menuButton.addEventListener("click", function () {
        toggleSidebar(true);
      });
    }

    if (closeButton) {
      closeButton.addEventListener("click", function () {
        toggleSidebar(false);
      });
    }

    if (progressWrap) {
      progressWrap.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (event) {
        var target = document.querySelector(link.getAttribute("href"));

        if (!target) {
          return;
        }

        event.preventDefault();
        toggleSidebar(false);
        target.scrollIntoView({ behavior: "smooth" });
      });
    });

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  });
})();
