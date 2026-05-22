(function () {
  "use strict";

  const PLOT_LAYOUT = {
    paper_bgcolor: "#243044",
    plot_bgcolor: "#1a2332",
    font: { family: "DM Sans, system-ui, sans-serif", color: "#e8eaed", size: 12 },
    margin: { t: 48, r: 24, b: 56, l: 64 },
    xaxis: {
      gridcolor: "#334155",
      zerolinecolor: "#334155",
      linecolor: "#334155",
    },
    yaxis: {
      gridcolor: "#334155",
      zerolinecolor: "#334155",
      linecolor: "#334155",
    },
  };

  const PLOT_CONFIG = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ["lasso2d", "select2d"],
    toImageButtonOptions: { format: "png", filename: "thang-doan-plot" },
  };

  let rawRows = [];
  let columns = [];
  let numericColumns = [];
  let chartMode = "crossplot";

  const els = {
    uploadZone: document.getElementById("upload-zone"),
    fileInput: document.getElementById("file-input"),
    fileInfo: document.getElementById("file-info"),
    message: document.getElementById("lab-message"),
    controls: document.getElementById("lab-controls"),
    colX: document.getElementById("col-x"),
    colY: document.getElementById("col-y"),
    colColor: document.getElementById("col-color"),
    colHist: document.getElementById("col-hist"),
    bins: document.getElementById("bins"),
    logX: document.getElementById("log-x"),
    logY: document.getElementById("log-y"),
    plotBtn: document.getElementById("plot-btn"),
    sampleBtn: document.getElementById("sample-btn"),
    clearBtn: document.getElementById("clear-btn"),
    plotDiv: document.getElementById("plot"),
    preview: document.getElementById("data-preview"),
    stats: document.getElementById("stats-panel"),
    tabCrossplot: document.getElementById("tab-crossplot"),
    tabHistogram: document.getElementById("tab-histogram"),
    tabVolume: document.getElementById("tab-volume"),
    volArea: document.getElementById("vol-area"),
    volPay: document.getElementById("vol-pay"),
    volPhi: document.getElementById("vol-phi"),
    volSw: document.getElementById("vol-sw"),
    volBo: document.getElementById("vol-bo"),
    volCalcBtn: document.getElementById("vol-calc-btn"),
    volumeResult: document.getElementById("volume-result"),
    volumeStoiip: document.getElementById("volume-stoiip"),
    volumeDetail: document.getElementById("volume-detail"),
    chartOnlyActions: document.querySelector(".chart-only-actions"),
  };

  function showMessage(text, type) {
    if (!els.message) return;
    els.message.textContent = text;
    els.message.className = "lab-message is-visible lab-message--" + (type || "info");
  }

  function hideMessage() {
    if (els.message) els.message.classList.remove("is-visible");
  }

  function parseNumber(val) {
    if (val == null || val === "") return null;
    const n = parseFloat(String(val).replace(/,/g, "").trim());
    return Number.isFinite(n) ? n : null;
  }

  function getNumericSeries(colName) {
    const idx = columns.indexOf(colName);
    if (idx < 0) return [];
    return rawRows
      .map(function (row) {
        return parseNumber(row[idx]);
      })
      .filter(function (v) {
        return v !== null;
      });
  }

  function computeStats(values) {
    if (!values.length) return null;
    const sorted = values.slice().sort(function (a, b) {
      return a - b;
    });
    const sum = values.reduce(function (a, b) {
      return a + b;
    }, 0);
    const mean = sum / values.length;
    const p = function (q) {
      const i = (sorted.length - 1) * q;
      const lo = Math.floor(i);
      const hi = Math.ceil(i);
      if (lo === hi) return sorted[lo];
      return sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo);
    };
    return {
      count: values.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      mean: mean,
      median: p(0.5),
      p10: p(0.1),
      p90: p(0.9),
    };
  }

  function renderStats(stats, label) {
    if (!els.stats || !stats) {
      if (els.stats) els.stats.innerHTML = "";
      return;
    }
    els.stats.innerHTML =
      '<p class="lab-panel__title">Statistics — ' +
      label +
      "</p><dl>" +
      "<dt>Count</dt><dd>" +
      stats.count +
      "</dd>" +
      "<dt>Min</dt><dd>" +
      stats.min.toFixed(4) +
      "</dd>" +
      "<dt>Max</dt><dd>" +
      stats.max.toFixed(4) +
      "</dd>" +
      "<dt>Mean</dt><dd>" +
      stats.mean.toFixed(4) +
      "</dd>" +
      "<dt>Median</dt><dd>" +
      stats.median.toFixed(4) +
      "</dd>" +
      "<dt>P10</dt><dd>" +
      stats.p10.toFixed(4) +
      "</dd>" +
      "<dt>P90</dt><dd>" +
      stats.p90.toFixed(4) +
      "</dd></dl>";
  }

  function fillSelect(select, cols, includeEmpty) {
    if (!select) return;
    select.innerHTML = "";
    if (includeEmpty) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "(none)";
      select.appendChild(opt);
    }
    cols.forEach(function (c) {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      select.appendChild(opt);
    });
  }

  function updateColumnSelectors() {
    fillSelect(els.colX, numericColumns, false);
    fillSelect(els.colY, numericColumns, false);
    fillSelect(els.colHist, numericColumns, false);
    fillSelect(els.colColor, columns, true);

    if (numericColumns.length >= 2) {
      els.colX.value = numericColumns[0];
      els.colY.value = numericColumns[1];
    }
    if (numericColumns.length >= 1) {
      els.colHist.value = numericColumns[0];
    }

  }

  function renderPreview() {
    if (!els.preview || !columns.length) return;
    const maxRows = 8;
    let html = "<table><thead><tr>";
    columns.forEach(function (c) {
      html += "<th>" + escapeHtml(c) + "</th>";
    });
    html += "</tr></thead><tbody>";
    rawRows.slice(0, maxRows).forEach(function (row) {
      html += "<tr>";
      columns.forEach(function (_, i) {
        html += "<td>" + escapeHtml(String(row[i] ?? "")) + "</td>";
      });
      html += "</tr>";
    });
    html += "</tbody></table>";
    if (rawRows.length > maxRows) {
      html +=
        '<p style="padding:0.5rem;font-size:0.75rem;color:#9aa5b4">Showing ' +
        maxRows +
        " of " +
        rawRows.length +
        " rows</p>";
    }
    els.preview.innerHTML = html;
  }

  function escapeHtml(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function detectColumns(rows) {
    if (!rows.length) return { headers: [], data: [] };
    const headers = rows[0].map(function (h) {
      return String(h || "").trim();
    });
    const data = rows.slice(1).filter(function (row) {
      return row.some(function (cell) {
        return cell != null && String(cell).trim() !== "";
      });
    });
    return { headers: headers, data: data };
  }

  function loadData(headers, data) {
    columns = headers;
    rawRows = data;
    numericColumns = columns.filter(function (col) {
      const idx = columns.indexOf(col);
      let numericCount = 0;
      const sample = rawRows.slice(0, Math.min(50, rawRows.length));
      sample.forEach(function (row) {
        if (parseNumber(row[idx]) !== null) numericCount++;
      });
      return numericCount >= sample.length * 0.5 && numericCount > 0;
    });

    if (!numericColumns.length) {
      showMessage("No numeric columns found. Use CSV with numeric data.", "error");
      return;
    }

    hideMessage();
    if (els.fileInfo) {
      els.fileInfo.innerHTML =
        "<strong>" +
        rawRows.length +
        "</strong> rows · <strong>" +
        numericColumns.length +
        "</strong> numeric columns";
    }
    updateColumnSelectors();
    renderPreview();
    buildPlot();
  }

  function parseCsvFile(file) {
    if (typeof Papa === "undefined") {
      showMessage("CSV parser not loaded. Check your internet connection.", "error");
      return;
    }
    Papa.parse(file, {
      skipEmptyLines: true,
      complete: function (result) {
        if (result.errors.length) {
          showMessage("CSV parse error: " + result.errors[0].message, "error");
          return;
        }
        const parsed = detectColumns(result.data);
        if (!parsed.headers.length) {
          showMessage("Could not read column headers.", "error");
          return;
        }
        loadData(parsed.headers, parsed.data);
      },
      error: function (err) {
        showMessage("Failed to read file: " + err.message, "error");
      },
    });
  }

  function loadSampleData() {
    const headers = [
      "Well",
      "Porosity",
      "Permeability",
      "WaterSat",
      "Depth",
      "Facies",
    ];
    const facies = ["Channel", "Shoreface", "Delta", "Marine"];
    const data = [];
    for (let i = 0; i < 120; i++) {
      const phi = 0.08 + Math.random() * 0.22;
      const perm = Math.exp(2 + 8 * phi + (Math.random() - 0.5) * 1.5);
      data.push([
        "W-" + (100 + i),
        phi.toFixed(4),
        perm.toFixed(2),
        (0.15 + Math.random() * 0.5).toFixed(3),
        (2100 + i * 2.5).toFixed(1),
        facies[i % facies.length],
      ]);
    }
    if (els.fileInfo) {
      els.fileInfo.innerHTML = "<strong>Sample dataset</strong> (synthetic porosity–permeability)";
    }
    loadData(headers, data);
    showMessage("Loaded sample well data. Try crossplot Porosity vs Permeability.", "info");
  }

  function buildCrossplot() {
    const xCol = els.colX.value;
    const yCol = els.colY.value;
    const colorCol = els.colColor.value;
    const xIdx = columns.indexOf(xCol);
    const yIdx = columns.indexOf(yCol);
    const cIdx = colorCol ? columns.indexOf(colorCol) : -1;

    const x = [];
    const y = [];
    const text = [];
    const colors = [];

    rawRows.forEach(function (row, i) {
      const xv = parseNumber(row[xIdx]);
      const yv = parseNumber(row[yIdx]);
      if (xv === null || yv === null) return;
      x.push(xv);
      y.push(yv);
      text.push("Row " + (i + 1));
      if (cIdx >= 0) colors.push(String(row[cIdx] ?? ""));
    });

    if (x.length < 2) {
      showMessage("Need at least 2 valid numeric points for crossplot.", "error");
      return;
    }

    hideMessage();
    const trace = {
      x: x,
      y: y,
      text: text,
      mode: "markers",
      type: "scatter",
      marker: {
        size: 8,
        opacity: 0.75,
        color: colors.length ? colors : "#2dd4bf",
        line: { width: 0.5, color: "#0f1419" },
      },
      hovertemplate: xCol + ": %{x}<br>" + yCol + ": %{y}<extra></extra>",
    };

    const layout = JSON.parse(JSON.stringify(PLOT_LAYOUT));
    layout.title = { text: yCol + " vs " + xCol, font: { size: 14, color: "#e8eaed" } };
    layout.xaxis.title = xCol;
    layout.yaxis.title = yCol;
    if (els.logX && els.logX.checked) layout.xaxis.type = "log";
    if (els.logY && els.logY.checked) layout.yaxis.type = "log";

    Plotly.newPlot(els.plotDiv, [trace], layout, PLOT_CONFIG);

    const xs = computeStats(x);
    const ys = computeStats(y);
    renderStats(
      {
        count: xs.count,
        min: xs.min,
        max: xs.max,
        mean: xs.mean,
        median: xs.median,
        p10: xs.p10,
        p90: xs.p90,
      },
      xCol + " (X); " + yCol + " mean=" + ys.mean.toFixed(4)
    );
  }

  function buildHistogram() {
    const col = els.colHist.value;
    const values = getNumericSeries(col);
    const binCount = Math.min(80, Math.max(5, parseInt(els.bins.value, 10) || 20));

    if (values.length < 2) {
      showMessage("Need numeric values for histogram.", "error");
      return;
    }

    hideMessage();
    const trace = {
      x: values,
      type: "histogram",
      nbinsx: binCount,
      marker: { color: "#2dd4bf", line: { color: "#0f1419", width: 0.5 } },
    };

    const layout = JSON.parse(JSON.stringify(PLOT_LAYOUT));
    layout.title = { text: "Histogram — " + col, font: { size: 14, color: "#e8eaed" } };
    layout.xaxis.title = col;
    layout.yaxis.title = "Count";
    layout.bargap = 0.05;

    Plotly.newPlot(els.plotDiv, [trace], layout, PLOT_CONFIG);
    renderStats(computeStats(values), col);
  }

  function buildPlot() {
    if (!rawRows.length || typeof Plotly === "undefined") return;
    if (chartMode === "histogram") buildHistogram();
    else buildCrossplot();
  }

  function calculateVolume() {
    const areaKm2 = parseFloat(els.volArea.value);
    const h = parseFloat(els.volPay.value);
    const phi = parseFloat(els.volPhi.value);
    const sw = parseFloat(els.volSw.value);
    const bo = parseFloat(els.volBo.value);

    if (![areaKm2, h, phi, sw, bo].every(Number.isFinite) || bo <= 0) {
      showMessage("Enter valid numbers for all volume inputs.", "error");
      return;
    }
    if (phi < 0 || phi > 1 || sw < 0 || sw > 1) {
      showMessage("Porosity and Sw must be between 0 and 1.", "error");
      return;
    }

    const areaM2 = areaKm2 * 1e6;
    const volResM3 = areaM2 * h * phi * (1 - sw);
    const stb = (volResM3 * 6.28981) / bo;
    const mmstb = stb / 1e6;

    hideMessage();
    if (els.volumeResult) els.volumeResult.hidden = false;
    if (els.volumeStoiip) {
      els.volumeStoiip.textContent = mmstb.toFixed(2) + " MMSTB";
    }
    if (els.volumeDetail) {
      els.volumeDetail.textContent =
        stb.toLocaleString(undefined, { maximumFractionDigits: 0 }) +
        " STB · reservoir volume " +
        (volResM3 / 1e6).toFixed(2) +
        " × 10⁶ m³";
    }

    if (els.plotDiv && typeof Plotly !== "undefined") {
      const layout = JSON.parse(JSON.stringify(PLOT_LAYOUT));
      layout.title = { text: "Deterministic volumetrics", font: { size: 14, color: "#e8eaed" } };
      layout.showlegend = false;
      layout.xaxis.visible = false;
      layout.yaxis.visible = false;
      layout.annotations = [
        {
          x: 0.5,
          y: 0.55,
          xref: "paper",
          yref: "paper",
          text: "<b>" + mmstb.toFixed(2) + " MMSTB</b>",
          showarrow: false,
          font: { size: 28, color: "#2dd4bf" },
        },
        {
          x: 0.5,
          y: 0.38,
          xref: "paper",
          yref: "paper",
          text:
            "A=" +
            areaKm2 +
            " km² · h=" +
            h +
            " m · φ=" +
            phi +
            " · Sw=" +
            sw +
            " · Bo=" +
            bo,
          showarrow: false,
          font: { size: 12, color: "#9aa5b4" },
        },
      ];
      Plotly.newPlot(els.plotDiv, [], layout, PLOT_CONFIG);
    }
    if (els.stats) els.stats.innerHTML = "";
  }

  function setChartMode(mode) {
    chartMode = mode;
    document.body.classList.remove(
      "chart-mode-crossplot",
      "chart-mode-histogram",
      "chart-mode-volume"
    );
    document.body.classList.add("chart-mode-" + mode);
    if (els.tabCrossplot) els.tabCrossplot.classList.toggle("is-active", mode === "crossplot");
    if (els.tabHistogram) els.tabHistogram.classList.toggle("is-active", mode === "histogram");
    if (els.tabVolume) els.tabVolume.classList.toggle("is-active", mode === "volume");
    if (els.chartOnlyActions) {
      els.chartOnlyActions.hidden = mode === "volume";
    }
    if (mode === "volume") {
      hideMessage();
    } else if (rawRows.length) {
      buildPlot();
    }
  }

  function clearAll() {
    rawRows = [];
    columns = [];
    numericColumns = [];
    if (els.fileInput) els.fileInput.value = "";
    if (els.fileInfo) els.fileInfo.textContent = "";
    if (els.preview) els.preview.innerHTML = "";
    if (els.stats) els.stats.innerHTML = "";
    if (els.volumeResult) els.volumeResult.hidden = true;
    if (els.plotDiv) Plotly.purge(els.plotDiv);
    hideMessage();
  }

  /* Upload handlers */
  if (els.uploadZone && els.fileInput) {
    els.uploadZone.addEventListener("click", function () {
      els.fileInput.click();
    });
    els.fileInput.addEventListener("change", function () {
      const file = els.fileInput.files[0];
      if (file) parseCsvFile(file);
    });
    els.uploadZone.addEventListener("dragover", function (e) {
      e.preventDefault();
      els.uploadZone.classList.add("is-dragover");
    });
    els.uploadZone.addEventListener("dragleave", function () {
      els.uploadZone.classList.remove("is-dragover");
    });
    els.uploadZone.addEventListener("drop", function (e) {
      e.preventDefault();
      els.uploadZone.classList.remove("is-dragover");
      const file = e.dataTransfer.files[0];
      if (file && file.name.toLowerCase().endsWith(".csv")) {
        parseCsvFile(file);
      } else {
        showMessage("Please upload a .csv file.", "error");
      }
    });
  }

  if (els.plotBtn) els.plotBtn.addEventListener("click", buildPlot);
  if (els.sampleBtn) els.sampleBtn.addEventListener("click", loadSampleData);
  if (els.clearBtn) els.clearBtn.addEventListener("click", clearAll);
  if (els.tabCrossplot)
    els.tabCrossplot.addEventListener("click", function () {
      setChartMode("crossplot");
    });
  if (els.tabHistogram)
    els.tabHistogram.addEventListener("click", function () {
      setChartMode("histogram");
    });
  if (els.tabVolume)
    els.tabVolume.addEventListener("click", function () {
      setChartMode("volume");
    });
  if (els.volCalcBtn) els.volCalcBtn.addEventListener("click", calculateVolume);

  [els.colX, els.colY, els.colHist, els.colColor, els.bins, els.logX, els.logY].forEach(
    function (el) {
      if (el) el.addEventListener("change", buildPlot);
    }
  );

  setChartMode("crossplot");
})();
