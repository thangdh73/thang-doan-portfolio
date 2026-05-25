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
      showFlowchart: true,
      pdf: {
        src: "assets/projects/ai-fault-workflow.pdf",
        title: "AI Faults Workflow — full illustration (PDF)",
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
    "eage-2016": {
      region: "EAGE · Kuala Lumpur · December 2016",
      title: "Best Practices in Seismic Constraining of 3D Reservoir Architecture Models",
      authors: "A.J.W. Everts (LEAP Energy) & H.D. Thang (LEAP Energy)",
      workflowHeading: "Key themes from the paper",
      summary:
        "Conference paper on practical methods to constrain 3D static reservoir architecture with seismic — balancing geological concept, hard/soft seismic constraints, and close-the-loop QC. Focus on complex clastic “labyrinth-type” settings where vertical resolution and object shapes are challenging.",
      pdf: {
        src: "assets/publications/eage-seismic-constraining-2016.pdf",
        title: "EAGE 2016 — full paper (PDF)",
      },
      workflow: [
        {
          title: "Conceptual model drives the method",
          text: "Appropriate geological concept (valley vs shoreface, channel-levee, etc.) determines whether to hard-code or soft-code seismic into architecture and properties — one workflow does not fit all settings.",
        },
        {
          title: "Vertical resolution & seismic facies domains",
          text: "Combine well-based vertical facies trends with lateral maps from seismic attributes; polygonise seismic facies domains (e.g. valley-fill vs overbank) and model each domain separately when breaks are geologically justified.",
        },
        {
          title: "Realistic sedimentary body shapes",
          text: "Object modelling with manual constraining from amplitude domains and seismic-derived trendlines — control orientation and seed probability, not only position — with Net-to-Gross back-comparison to seismic.",
        },
        {
          title: "Spatial facies arrangements",
          text: "Nested workflows using distance-to-surface or distance-to-trendline properties to place dependent facies (e.g. splays on channels, proximal–distal levee grading) in geologically consistent patterns.",
        },
        {
          title: "Close-the-loop QC",
          text: "Compare average property maps from the static model against the seismic attribute maps used for constraining — a practical quality check that the model honours the seismic input.",
        },
      ],
      deliverables: [
        "Framework for seismic-constrained static modelling in clastics",
        "Domain-based and object-based constraining workflows",
        "Field case studies (lower coastal plain, deepwater channel-levee)",
        "QC via model vs seismic attribute comparison",
      ],
      tags: ["EAGE", "Publication", "Static modelling", "Seismic constraining"],
    },
  };

  const modal = document.getElementById("project-modal");
  const modalBody = document.getElementById("project-modal-body");
  const modalTitle = document.getElementById("project-modal-title");
  const closeBtn = document.getElementById("project-modal-close");
  let lastFocused = null;

  function assetUrl(relativePath) {
    try {
      return new URL(relativePath, window.location.href).href;
    } catch (e) {
      return relativePath;
    }
  }

  function renderFlowchart() {
    return (
      '<div class="project-detail__flowchart" role="img" aria-label="AI fault workflow from seismic input to fault surfaces">' +
      '<p class="project-detail__figure-label">Workflow overview</p>' +
      '<div class="flowchart__pipeline">' +
      '<span class="flowchart__node">Original seismic</span>' +
      '<span class="flowchart__arrow" aria-hidden="true">→</span>' +
      '<span class="flowchart__node">AI denoising</span>' +
      '<span class="flowchart__arrow" aria-hidden="true">→</span>' +
      '<span class="flowchart__node">Fault imaging</span>' +
      '<span class="flowchart__arrow" aria-hidden="true">→</span>' +
      '<span class="flowchart__node flowchart__node--accent">AI fault detection</span>' +
      '<span class="flowchart__arrow" aria-hidden="true">→</span>' +
      '<span class="flowchart__node flowchart__node--accent">Fine-tuning</span>' +
      '<span class="flowchart__arrow" aria-hidden="true">→</span>' +
      '<span class="flowchart__node flowchart__node--highlight">QC &amp; export</span>' +
      "</div>" +
      '<div class="flowchart__outputs">' +
      '<span class="flowchart__chip">AI confidence</span>' +
      '<span class="flowchart__chip">Clean confidence</span>' +
      '<span class="flowchart__chip">Fault trends</span>' +
      '<span class="flowchart__chip">Fault in</span>' +
      '<span class="flowchart__chip">Fault sticks &amp; surfaces</span>' +
      "</div>" +
      '<p class="project-detail__flowchart-caption">Conditioning → AI detection → fine-tuning → confidence volumes → fault sticks and surfaces (1,145 km² 3D seismic).</p>' +
      "</div>"
    );
  }

  function renderFigures(figures) {
    const list = figures || [];
    return list
      .map(function (fig) {
        const label = fig.label
          ? '<p class="project-detail__figure-label">' + fig.label + "</p>"
          : "";
        const figureClass =
          "project-detail__figure" + (fig.zoom ? " project-detail__figure--zoom" : "");
        const src = assetUrl(fig.src);
        const img =
          '<img class="project-detail__figure-img" src="' +
          src +
          '" alt="' +
          fig.alt +
          '" loading="lazy" decoding="async" onerror="this.closest(\'figure\').classList.add(\'is-broken\')">';
        const media = fig.zoom
          ? '<a class="project-detail__figure-link" href="' +
            src +
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
    const url = assetUrl(pdf.src);
    return (
      '<div class="project-detail__pdf">' +
      '<p class="project-detail__figure-label">' +
      title +
      "</p>" +
      '<iframe class="project-detail__pdf-frame" src="' +
      url +
      '#toolbar=1&navpanes=0" title="' +
      title +
      '"></iframe>' +
      '<p class="project-detail__pdf-fallback">' +
      '<a href="' +
      url +
      '" target="_blank" rel="noopener noreferrer">Open workflow PDF in a new tab</a>' +
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
    const pdfBlock = renderPdf(data.pdf);
    const flowchartBlock = data.showFlowchart ? renderFlowchart() : "";
    const figuresBlock = renderFigures(data.figures || (data.figure ? [data.figure] : []));
    const mediaBlock = pdfBlock + flowchartBlock + figuresBlock;

    const authorsHtml = data.authors
      ? '<p class="project-detail__authors">' + data.authors + "</p>"
      : "";

    return (
      '<p class="project-detail__region">' +
      data.region +
      "</p>" +
      authorsHtml +
      '<p class="project-detail__summary">' +
      data.summary +
      "</p>" +
      (mediaBlock ? '<div class="project-detail__figures">' + mediaBlock + "</div>" : "") +
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
