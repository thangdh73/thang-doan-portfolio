(function () {
  "use strict";

  function yearsSince(startYear, startMonth) {
    if (!startYear) return 0;
    const now = new Date();
    let years = now.getFullYear() - startYear;
    const month = startMonth != null ? startMonth : 0;
    if (now.getMonth() < month) {
      years -= 1;
    }
    return Math.max(0, years);
  }

  function formatYearsPlus(years) {
    return years > 0 ? years + "+" : "0";
  }

  /* Auto-update experience years from career start dates in site-config.js */
  if (window.SITE_CONFIG) {
    const cfg = window.SITE_CONFIG;
    const industryYears = yearsSince(
      cfg.industryStartYear,
      cfg.industryStartMonth
    );
    const modellingYears = yearsSince(
      cfg.modellingStartYear,
      cfg.modellingStartMonth
    );

    const statIndustry = document.getElementById("stat-industry-years");
    const statModelling = document.getElementById("stat-modelling-years");
    const heroTagline = document.getElementById("hero-tagline");
    const aboutYears = document.getElementById("about-years-text");
    const metaDesc = document.querySelector('meta[name="description"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');

    if (statIndustry && industryYears > 0) {
      statIndustry.textContent = formatYearsPlus(industryYears);
    }
    if (statModelling && modellingYears > 0) {
      statModelling.textContent = String(modellingYears);
    }
    if (heroTagline && industryYears > 0 && modellingYears > 0) {
      heroTagline.textContent =
        formatYearsPlus(industryYears) +
        " years in oil and gas — " +
        modellingYears +
        " years in reservoir modelling — delivering integrated subsurface solutions across Southeast Asia, the Middle East, Europe, Africa, and South America.";
    }
    if (aboutYears && industryYears > 0 && modellingYears > 0) {
      aboutYears.textContent =
        "over " +
        formatYearsPlus(industryYears) +
        " years of experience (" +
        modellingYears +
        " years in modelling)";
    }
    const descSnippet =
      "Thang Doan — Senior Geologist and Geological Modeler with " +
      formatYearsPlus(industryYears) +
      " years in oil and gas. Reservoir modeling, seismic interpretation, and subsurface evaluation.";
    if (metaDesc && industryYears > 0) metaDesc.setAttribute("content", descSnippet);
    if (ogDesc && industryYears > 0) {
      ogDesc.setAttribute(
        "content",
        "Senior Geologist / Geological Modeler — " +
          formatYearsPlus(industryYears) +
          " years across global oil and gas projects."
      );
    }
  }

  /* Apply contact details from js/site-config.js */
  if (window.SITE_CONFIG) {
    const cfg = window.SITE_CONFIG;
    const emailLink = document.getElementById("contact-email-link");
    const phoneLink = document.getElementById("contact-phone-link");
    const phoneText = document.getElementById("contact-phone-text");
    const locationText = document.getElementById("contact-location-text");
    const linkedinLink = document.getElementById("contact-linkedin-link");
    const footerEmail = document.getElementById("footer-email-link");
    const footerLinkedin = document.getElementById("footer-linkedin-link");
    const contactForm = document.getElementById("contact-form");

    if (cfg.email && emailLink) {
      emailLink.href = "mailto:" + cfg.email;
      emailLink.textContent = cfg.email;
      if (footerEmail) footerEmail.href = "mailto:" + cfg.email;
    }
    const phoneItem = document.getElementById("contact-phone-item");
    const locationItem = document.getElementById("contact-location-item");

    if (cfg.phone && phoneText) {
      phoneText.textContent = cfg.phone;
      if (phoneLink) phoneLink.href = "tel:" + cfg.phone.replace(/\s/g, "");
      if (phoneItem) phoneItem.hidden = false;
    }
    if (cfg.location && locationText) {
      locationText.textContent = cfg.location;
      if (locationItem) locationItem.hidden = false;
    }
    if (cfg.linkedin && linkedinLink) {
      linkedinLink.href = cfg.linkedin;
      linkedinLink.textContent = cfg.linkedinLabel || cfg.linkedin;
      if (footerLinkedin) footerLinkedin.href = cfg.linkedin;
    }
    if (cfg.email && contactForm) {
      contactForm.setAttribute("data-contact-email", cfg.email);
    }
    if (cfg.siteUrl) {
      const ogUrl = document.getElementById("meta-og-url");
      if (ogUrl) ogUrl.setAttribute("content", cfg.siteUrl);
    }
    if (cfg.cvPath) {
      const cvBtn = document.getElementById("cv-download");
      if (cvBtn) cvBtn.setAttribute("href", cfg.cvPath);
    }
  }

  /* CV download — warn if PDF not added yet */
  const cvDownload = document.getElementById("cv-download");
  if (cvDownload) {
    cvDownload.addEventListener("click", function (e) {
      const path = cvDownload.getAttribute("href");
      if (!path || path.indexOf("cv.pdf") === -1) return;

      fetch(path, { method: "HEAD" })
        .then(function (res) {
          if (!res.ok) {
            e.preventDefault();
            alert(
              "CV PDF not found. Add your resume as assets/cv.pdf (see assets/README.md)."
            );
          }
        })
        .catch(function () {
          /* file:// or offline — allow default download attempt */
        });
    });
  }

  const nav = document.querySelector(".nav");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll(".nav__link");
  const sections = document.querySelectorAll("section[id]");
  const backToTop = document.querySelector(".back-to-top");
  const contactForm = document.getElementById("contact-form");
  const formMessage = document.querySelector(".form-message");

  /* Smooth scroll with focus management for in-page links */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      if (history.pushState) {
        history.pushState(null, "", targetId);
      }

      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });

  /* Mobile navigation */
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("is-open");
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        navToggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        navToggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        navToggle.focus();
      }
    });
  }

  /* Active nav link on scroll */
  if (sections.length && navLinks.length) {
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -55% 0px",
      threshold: 0,
    };

    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach(function (link) {
            link.classList.toggle(
              "is-active",
              link.getAttribute("href") === "#" + id
            );
          });
        }
      });
    }, observerOptions);

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  /* Fade-in on scroll */
  const fadeElements = document.querySelectorAll(".fade-in");
  if (fadeElements.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const fadeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    fadeElements.forEach(function (el) {
      fadeObserver.observe(el);
    });
  } else {
    fadeElements.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Back to top */
  if (backToTop) {
    window.addEventListener(
      "scroll",
      function () {
        backToTop.classList.toggle("is-visible", window.scrollY > 400);
      },
      { passive: true }
    );
  }

  /* Contact form — opens mail client; replace with Formspree/Netlify when ready */
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      const toEmail =
        contactForm.getAttribute("data-contact-email") ||
        (window.SITE_CONFIG && window.SITE_CONFIG.email) ||
        "thangdh73@gmail.com";

      const subject = encodeURIComponent("Portfolio inquiry from " + name);
      const body = encodeURIComponent(
        "Name: " + name + "\nEmail: " + email + "\n\n" + message
      );

      window.location.href =
        "mailto:" + toEmail + "?subject=" + subject + "&body=" + body;

      if (formMessage) {
        formMessage.textContent =
          "Your email client should open. If not, use the contact links above.";
        formMessage.classList.add("is-visible", "form-message--success");
      }
    });
  }

  /* Technical Corner — show images when src is set */
  document.querySelectorAll(".technical-card__img").forEach(function (img) {
    const src = img.getAttribute("src");
    if (src && src.trim() !== "") {
      img.hidden = false;
      img.addEventListener("error", function () {
        img.hidden = true;
      });
    }
  });

  /* Expandable additional projects */
  const projectsToggle = document.getElementById("projects-toggle");
  const projectsMore = document.getElementById("projects-more");

  if (projectsToggle && projectsMore) {
    projectsToggle.addEventListener("click", function () {
      const expanded = projectsToggle.getAttribute("aria-expanded") === "true";
      projectsToggle.setAttribute("aria-expanded", String(!expanded));
      projectsMore.hidden = expanded;
      projectsToggle.textContent = expanded
        ? "Show more projects"
        : "Show fewer projects";
    });
  }
})();
