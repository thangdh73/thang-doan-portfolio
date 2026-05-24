(function () {
  "use strict";

  const PROJECT_DETAILS = {
    tembakau: {
      region: "Malaysia · Offshore",
      title: "Tembakau IPC — FDP Green Field",
      workflowHeading: "Seismic model building workflow",
      figures: [
        {
          src: "assets/projects/tembakau-cross-sections.JPG",
          alt:
            "I80 reservoir layer 91: gas-zone statistics QC, AI seismic and lithofacies plan maps, strike and dip sections through wells A and B",
          caption:
            "Seismically conditioned model QC — statistics (gas zone), AI seismic and lithofacies maps, strike and dip lithofacies/seismic sections tied to wells A & B.",
          label: "Seismic model building",
          zoom: true,
        },
      ],
      summary:
        "Onsite lead integrating seismic attributes with reservoir geology to build seismically constrained 3D static models for FDP volumetrics and dynamic modelling support.",
      workflow: [
        {
          title: "Seismic attribute analysis",
          text: "Derived and interpreted acoustic impedance (AI) and related attributes to characterize reservoir architecture and fluid-sensitive response in the gas zone.",
        },
        {
          title: "Lithofacies conditioning",
          text: "Built lithofacies models (very good to poor sand, shale) conditioned to seismic AI and well data — plan views and layer-based maps for key reservoir units.",
        },
        {
          title: "Section QC & well ties",
          text: "Strike and dip sections through key wells validated facies against seismic character; histogram QC compared model vs. observed statistics in the gas zone.",
        },
        {
          title: "FDP static model & volumes",
          text: "Delivered seismically constrained framework for deterministic and probabilistic resource assessment and dynamic model upscaling.",
        },
      ],
      deliverables: [
        "AI seismic attribute maps and layer slices",
        "3D lithofacies model conditioned to seismic",
        "Strike / dip section QC panels",
        "Statistics QC (model vs. data)",
        "Static model inputs for STOIIP / GIIP and uncertainty",
      ],
      tags: ["FDP", "Attribute Analysis", "Seismic conditioning", "Lithofacies"],
    },
    "ai-fault": {
      region: "Vietnam · Offshore",
      title: "AI Fault Interpretation",
      workflowHeading: "AI fault interpretation workflow",
      summary:
        "Central role in ML-driven fault interpretation over 1,145 km² of 3D seismic — seismic conditioning, CNN-based fault detection, model fine-tuning, integration with legacy interpretation, and delivery of a refined fault network for digital subsurface imaging.",
      figures: [
        {
          src: "assets/projects/ai-fault-workflow.svg",
          alt: "Diagram of AI fault workflow from seismic input through detection, fine-tuning, and fault surface extraction",
          caption: "Workflow overview: conditioning → AI detection → fine-tuning → confidence volumes → fault sticks and surfaces.",
          label: "Workflow overview",
        },
      ],
      pdf: {
        src: "assets/projects/ai-fault-workflow.pdf",
        title: "AI Faults Workflow — full illustration",
      },
      workflow: [
        {
          title: "Seismic data conditioning",
          text: "Original 3D seismic volume prepared for ML — AI denoising and fault-imaging workflows to enhance fault expression before detection.",
        },
        {
          title: "AI fault detection",
          text: "3D convolutional networks (CNNs) predict fault likelihood across the survey. Pre-trained networks (e.g. Birch, Larch, Meranti for Z sticks; Confidence, Ash for volume confidence) provide the starting point.",
        },
        {
          title: "Fine-tuning on survey data",
          text: "Networks fine-tuned on local 3D seismic so fault predictions match regional geology — balancing legacy interpretation with ML-derived edges.",
        },
        {
          title: "Confidence & cleaning",
          text: "AI confidence volumes (0–100%) refined with gaussian smoothing and fault-detect ridge operators to segment lineations representing likely fault edges.",
        },
        {
          title: "Fault trends & Fault In",
          text: "Fault Trends estimates strike orientation along detected lineations (fault families). Fault In embeds detected faults into the conditioned seismic volume for QC against reflectivity.",
        },
        {
          title: "Sticks, surfaces & framework",
          text: "Automated extraction of fault sticks and surfaces, integrated with interpreter edits — refined fault network exported for static modelling and digital subsurface workflows.",
        },
      ],
      deliverables: [
        "Conditioned seismic and AI confidence volumes",
        "Fine-tuned 3D fault detection (survey-specific)",
        "Fault trends and Fault In QC products",
        "Fault sticks and surfaces for framework building",
        "Integration with legacy fault interpretation (1,145 km²)",
      ],
      tags: ["AI / ML", "Seismic Interpretation", "Fault framework", "CNN"],
    },
  };

  const modal = document.getElementById("project-modal");
  const modalBody = document.getElementById("project-modal-body");
  const modalTitle = document.getElementById("project-modal-title");
  const closeBtn = document.getElementById("project-modal-close");
  let lastFocused = null;

  function renderFigures(figures) {
    const list = figures || [];
    return list
      .map(function (fig) {
        const label = fig.label
          ? '<p class="project-detail__figure-label">' + fig.label + "</p>"
          : "";
        const figureClass =
          "project-detail__figure" + (fig.zoom ? " project-detail__figure--zoom" : "");
        const img =
          '<img class="project-detail__figure-img" src="' +
          fig.src +
          '" alt="' +
          fig.alt +
          '" loading="lazy" decoding="async">';
        const media = fig.zoom
          ? '<a class="project-detail__figure-link" href="' +
            fig.src +
            '" target="_blank" rel="noopener noreferrer">' +
            img +
            '<span class="project-detail__figure-hint">Click image to open full size</span></a>'
          : img;
        return (
          "<figure class=\"" +
          figureClass +
          '">' +
          label +
          media +
          "<figcaption>" +
          fig.caption +
          "</figcaption></figure>"
        );
      })
      .join("");
  }

  function renderPdf(pdf) {
    if (!pdf || !pdf.src) return "";
    const title = pdf.title || "Project workflow PDF";
    return (
      '<div class="project-detail__pdf">' +
      '<p class="project-detail__figure-label">' +
      title +
      "</p>" +
      '<iframe class="project-detail__pdf-frame" src="' +
      pdf.src +
      '#toolbar=1&navpanes=0" title="' +
      title +
      '"></iframe>' +
      '<p class="project-detail__pdf-fallback">' +
      'PDF not showing? <a href="' +
      pdf.src +
      '" target="_blank" rel="noopener noreferrer">Open workflow PDF in a new tab</a>.' +
      "</p></div>"
    );
  }

  function renderDetail(data) {
    const workflowHtml = data.workflow
      .map(function (step, i) {
        return (
          '<li class="project-detail__step">' +
          '<span class="project-detail__step-num">' +
          (i + 1) +
          "</span>" +
          "<div><strong>" +
          step.title +
          "</strong><p>" +
          step.text +
          "</p></div></li>"
        );
      })
      .join("");

    const tagsHtml = data.tags
      .map(function (t) {
        return '<span class="tag">' + t + "</span>";
      })
      .join("");

    const deliverablesHtml = data.deliverables
      .map(function (d) {
        return "<li>" + d + "</li>";
      })
      .join("");

    const workflowHeading =
      data.workflowHeading || "Project workflow";
    const figuresBlock = renderFigures(data.figures || (data.figure ? [data.figure] : []));
    const pdfBlock = renderPdf(data.pdf);

    return (
      '<p class="project-detail__region">' +
      data.region +
      "</p>" +
      '<p class="project-detail__summary">' +
      data.summary +
      "</p>" +
      (figuresBlock || pdfBlock
        ? '<div class="project-detail__figures">' + figuresBlock + pdfBlock + "</div>"
        : "") +
      "<h3 class=\"project-detail__heading\">" +
      workflowHeading +
      "</h3>" +
      '<ol class="project-detail__workflow">' +
      workflowHtml +
      "</ol>" +
      '<h3 class="project-detail__heading">Key deliverables</h3>' +
      '<ul class="project-detail__list">' +
      deliverablesHtml +
      "</ul>" +
      '<div class="project-detail__tags">' +
      tagsHtml +
      "</div>"
    );
  }

  function openDetail(id) {
    const data = PROJECT_DETAILS[id];
    if (!data || !modal || !modalBody) return;

    lastFocused = document.activeElement;
    if (modalTitle) modalTitle.textContent = data.title;
    modalBody.innerHTML = renderDetail(data);
    modal.hidden = false;
    document.body.classList.add("project-modal-open");
    modal.scrollTop = 0;
    const panel = modal.querySelector(".project-modal__panel");
    if (panel) panel.scrollTop = 0;
    if (closeBtn) closeBtn.focus();
  }

  function closeDetail() {
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("project-modal-open");
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  function onCardActivate(card) {
    const id = card.getAttribute("data-project-detail");
    if (id) openDetail(id);
  }

  document.querySelectorAll("[data-project-detail]").forEach(function (card) {
    card.addEventListener("click", function (e) {
      if (e.target.closest("a")) return;
      onCardActivate(card);
    });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onCardActivate(card);
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", closeDetail);
  }

  if (modal) {
    modal.addEventListener("click", function (e) {
      if (
        e.target === modal ||
        e.target.classList.contains("project-modal__backdrop")
      ) {
        closeDetail();
      }
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal && !modal.hidden) {
      closeDetail();
    }
  });
})();
