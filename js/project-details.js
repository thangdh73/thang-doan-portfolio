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
    poseidon: {
      region: "Oman · PDO · Wafra Field",
      title: "POSEIDON — Wafra Field Static Model Build & Update",
      workflowHeading: "Static model workflow (POSEIDON / Three60)",
      summary:
        "AI-driven POSEIDON study for Petroleum Development Oman (PDO): fast-paced repair and update of the legacy 2013 Wafra Field Petrel static model — structural framework, sequence-package zonation in the Gharif Formation, facies and property modelling, fluid contacts, and STOIIP uncertainty scenarios to support ROCM and ML workflows.",
      presentation: {
        title: "POSEIDON static model study (9 slides)",
        pdf: "assets/projects/poseidon-static-model.pdf",
      },
      highlights: [
        { value: "112", label: "Wells (field inventory)" },
        { value: "~4.3M", label: "Grid cells (122×201×175)" },
        { value: "10–12 km²", label: "Model coverage" },
        { value: "7", label: "Zones — contacts updated" },
        { value: "UG2 / UG3", label: "Primary BCO flow units" },
        { value: "3 mo", label: "Legacy model repair (no extra cost)" },
      ],
      workflow: [
        {
          title: "Legacy model assessment",
          text: "Reviewed 2013 Petrel build (67 wells in scope); remediated formation-top mismatches, correlation errors, OWC discrepancies, log inconsistencies, and missing uncertainty cases — agreed 3-month repair at no additional cost for POSEIDON ROCM support.",
        },
        {
          title: "Structural framework (Gharif)",
          text: "Retained fault network; updated stratigraphic tops from new well data; revised zonation to sequence-package correlation (5 Upper + 2 Middle Gharif zones) on ~4.3M-cell grid over 10–12 km².",
        },
        {
          title: "Facies & properties",
          text: "SIS facies (RPD method, WAFRA-6 core); SGS porosity facies-conditioned with normal score transform; permeability SGS co-kriged with porosity; NTG and SHF-by-zone saturation from 2010/11 DSC study.",
        },
        {
          title: "Fluid contacts & Sw",
          text: "Revised contacts using stick-plots (production, pressure, logs) across seven zones; SHF applied per zone; validated with Sw cutoff on early producers.",
        },
        {
          title: "Volumetrics & ROCM linkage",
          text: "STOIIP low/mid/high scenarios and flank uncertainty assessed; UG2 and UG3 history-matched in ROCM — enabling BCO and infill screening (2 BCOs UG2, 3 BCOs UG3, 8 infill targets). PDO TA2 endorsement scoped to ML workflow.",
        },
      ],
      deliverables: [
        "Updated Petrel static model (structure, zonation, properties)",
        "Sequence-package Gharif zonation (legacy sand-to-sand replaced)",
        "Seven-zone fluid contact compilation",
        "Facies / porosity / permeability / saturation models",
        "STOIIP uncertainty scenarios (TA2-assured scope)",
        "BCO and infill opportunity screening inputs (UG2, UG3)",
        "POSEIDON study deck (9 slides)",
      ],
      tags: [
        "Petrel",
        "Three60",
        "PDO",
        "Brownfield",
        "Gharif",
        "STOIIP",
        "ROCM",
      ],
    },
    mako: {
      region: "Indonesia · Natuna Sea · Conrad",
      title: "Conrad Mako Gas Field — Model Update 2023",
      workflowHeading: "Reservoir modeling workflow",
      summary:
        "Featured portfolio case study: integrated new 3D seismic acoustic impedance over the SW area (116 km²) with legacy 2D pseudo-AI, updated structure and Petrel static model (Three60 workflow), and delivered measurable GIIP uplift for the Mako gas field.",
      presentation: {
        title: "Reservoir modeling portfolio (7 slides)",
        pdf: "assets/projects/mako-reservoir-modeling-portfolio.pdf",
        pptx: "assets/projects/mako-reservoir-modeling-portfolio.pptx",
      },
      highlights: [
        { value: "+6%", label: "Total field GIIP uplift" },
        { value: "+8%", label: "Primary zone (Muda Sand1)" },
        { value: "116 km²", label: "3D seismic SW coverage" },
        { value: "12 m", label: "Structure shallower vs legacy 2D" },
        { value: "6 wells", label: "Foundation dataset" },
        { value: "610k", label: "Active model cells (+4.3%)" },
      ],
      workflow: [
        {
          title: "3D seismic & AI integration",
          text: "Interpreted reservoir tops/bases in TWT, depth conversion on 116 km² new 3D seismic; merged 3D acoustic impedance with legacy 2D pseudo-AI — Area A without rebalancing, Area B rebalanced; removed anomalous DYG-13 line.",
        },
        {
          title: "Structural update",
          text: "Structure up to 12 m shallower versus legacy 2D interpretation — increased gross rock volume feeding volumetric uplift.",
        },
        {
          title: "Petrel static model (Three60)",
          text: "Full reservoir model update in Petrel following Three60 standard workflow — structural framework, facies and properties integrated with new seismic inputs.",
        },
        {
          title: "AI-guided facies & properties",
          text: "Sequential Indicator Simulation (SIS) with AI guidance; water-to-gas substitution in property modelling; active gas cells increased ~4% (303,863 vs 291,739).",
        },
        {
          title: "GIIP volumetrics",
          text: "Gas initially in place recalculated by zone — +6% field total, +8% in primary Muda Sand1, +49% upside outside contract boundary vs legacy model.",
        },
      ],
      deliverables: [
        "Merged 3D + 2D seismic AI volume in Petrel",
        "Updated structural model and depth framework",
        "3D facies model with AI-guided SIS",
        "Updated porosity, permeability, and Sw",
        "GIIP report with zone-level comparison",
        "Reservoir modeling portfolio (7 slides)",
      ],
      tags: [
        "Petrel",
        "Three60",
        "GIIP",
        "Seismic AI",
        "Static model",
        "Natuna Sea",
      ],
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

  function publicAssetUrl(relativePath) {
    const cfg = window.SITE_CONFIG || {};
    const base = cfg.siteUrl
      ? String(cfg.siteUrl).replace(/\/?$/, "/")
      : new URL("./", window.location.href).href;
    try {
      return new URL(relativePath, base).href;
    } catch (e) {
      return assetUrl(relativePath);
    }
  }

  function renderPresentation(pres) {
    if (!pres) return "";
    const title = pres.title || "Portfolio presentation";
    const pdfUrl = pres.pdf ? assetUrl(pres.pdf) : "";
    const pptxUrl = pres.pptx ? publicAssetUrl(pres.pptx) : "";
    const officeUrl = pptxUrl
      ? "https://view.officeapps.live.com/op/embed.aspx?src=" +
        encodeURIComponent(pptxUrl)
      : "";

    let viewerHtml = "";
    if (pdfUrl) {
      viewerHtml +=
        '<iframe class="project-detail__pdf-frame project-detail__pdf-frame--deck" data-pres-pdf src="' +
        pdfUrl +
        '#toolbar=1&navpanes=0" title="' +
        title +
        ' (PDF)"></iframe>';
    }
    if (officeUrl) {
      viewerHtml +=
        '<iframe class="project-detail__office-frame" data-pres-office hidden src="' +
        officeUrl +
        '" title="' +
        title +
        ' (PowerPoint)"></iframe>';
    }

    const openPdf = pdfUrl
      ? '<a href="' + pdfUrl + '" target="_blank" rel="noopener noreferrer">Open PDF</a>'
      : "";
    const openPptx = pptxUrl
      ? '<a href="' + assetUrl(pres.pptx) + '" target="_blank" rel="noopener noreferrer">Open PowerPoint</a>'
      : "";
    const links = [openPdf, openPptx].filter(Boolean).join(" · ");

    return (
      '<div class="project-detail__pdf project-detail__presentation" data-presentation data-pres-pdf-path="' +
      (pres.pdf || "") +
      '">' +
      '<p class="project-detail__figure-label">' +
      title +
      "</p>" +
      '<p class="project-detail__pres-hint" data-pres-status>Loading presentation…</p>' +
      viewerHtml +
      '<p class="project-detail__pdf-fallback" data-pres-fallback hidden>' +
      links +
      " · If the preview is blank, run <code>save-mako-as-pdf.ps1</code>, commit the PDF, and push to Vercel." +
      "</p></div>"
    );
  }

  function initPresentations(root) {
    const scope = root || document;
    scope.querySelectorAll("[data-presentation]").forEach(function (wrap) {
      const pdfPath = wrap.getAttribute("data-pres-pdf-path");
      const pdfFrame = wrap.querySelector("[data-pres-pdf]");
      const officeFrame = wrap.querySelector("[data-pres-office]");
      const status = wrap.querySelector("[data-pres-status]");
      const fallback = wrap.querySelector("[data-pres-fallback]");

      function usePdf() {
        if (pdfFrame) pdfFrame.hidden = false;
        if (officeFrame) officeFrame.hidden = true;
        if (status) {
          status.textContent =
            "PDF export of your PowerPoint deck — scroll or use PDF controls to move between slides.";
        }
        if (fallback) fallback.hidden = false;
      }

      function useOffice() {
        if (pdfFrame) pdfFrame.hidden = true;
        if (officeFrame) {
          officeFrame.hidden = false;
          officeFrame.removeAttribute("hidden");
        }
        if (status) {
          status.textContent =
            "Live PowerPoint view (Microsoft Office viewer) — use slide controls in the viewer.";
        }
        if (fallback) fallback.hidden = false;
      }

      if (!pdfPath) {
        useOffice();
        return;
      }

      const pdfUrl = assetUrl(pdfPath);
      usePdf();
      fetch(pdfUrl, { method: "HEAD", cache: "no-store" })
        .then(function (res) {
          if (!res.ok && officeFrame) useOffice();
        })
        .catch(function () {
          if (officeFrame) useOffice();
        });
    });
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

  function renderHighlights(items) {
    if (!items || !items.length) return "";
    const cells = items
      .map(function (h) {
        return (
          '<div class="project-detail__metric">' +
          '<span class="project-detail__metric-value">' +
          h.value +
          "</span>" +
          '<span class="project-detail__metric-label">' +
          h.label +
          "</span></div>"
        );
      })
      .join("");
    return (
      '<div class="project-detail__metrics">' +
      '<p class="project-detail__figure-label">Key outcomes</p>' +
      '<div class="project-detail__metrics-grid">' +
      cells +
      "</div></div>"
    );
  }

  function renderDownload(dl) {
    if (!dl || !dl.src) return "";
    const url = assetUrl(dl.src);
    return (
      '<p class="project-detail__download">' +
      '<a class="btn btn--primary" href="' +
      url +
      '" download target="_blank" rel="noopener noreferrer">' +
      dl.label +
      "</a></p>"
    );
  }

  function renderPdf(pdf) {
    if (!pdf || !pdf.src) return "";
    const title = pdf.title || "Project workflow PDF";
    const url = assetUrl(pdf.src);
    const frameClass =
      "project-detail__pdf-frame" + (pdf.deck ? " project-detail__pdf-frame--deck" : "");
    return (
      '<div class="project-detail__pdf">' +
      '<p class="project-detail__figure-label">' +
      title +
      "</p>" +
      '<iframe class="' +
      frameClass +
      '" src="' +
      url +
      '#toolbar=1&navpanes=0" title="' +
      title +
      '"></iframe>' +
      '<p class="project-detail__pdf-fallback">' +
      '<a href="' +
      url +
      '" target="_blank" rel="noopener noreferrer">Open PDF in a new tab</a>' +
      " · If the preview shows 404, wait 1–2 min after deploy and hard-refresh (Ctrl+F5)." +
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
    const downloadBlock = renderDownload(data.download);
    const presentationBlock = renderPresentation(data.presentation);
    const highlightsBlock = renderHighlights(data.highlights);
    const flowchartBlock = data.showFlowchart ? renderFlowchart() : "";
    const figuresBlock = renderFigures(data.figures || (data.figure ? [data.figure] : []));
    const mediaBlock =
      presentationBlock +
      downloadBlock +
      highlightsBlock +
      pdfBlock +
      flowchartBlock +
      figuresBlock;

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
    initPresentations(modalBody);
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
