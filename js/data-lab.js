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
  let volumeMode = "stochastic";
  let plotlyLoadPromise = null;
  let plotLoadingTimer = null;

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
    volumePercentiles: document.getElementById("volume-percentiles"),
    volModeDet: document.getElementById("vol-mode-det"),
    volModeStoch: document.getElementById("vol-mode-stoch"),
    volPanelDet: document.getElementById("vol-panel-det"),
    volPanelStoch: document.getElementById("vol-panel-stoch"),
    chartOnlyActions: document.querySelector(".chart-only-actions"),
    plotLoading: document.getElementById("plot-loading"),
    panelCrossplot: document.getElementById("panel-crossplot"),
    panelHistogram: document.getElementById("panel-histogram"),
    panelVolume: document.getElementById("panel-volume"),
  };

  function hidePlotLoading() {
    if (plotLoadingTimer) {
      clearTimeout(plotLoadingTimer);
      plotLoadingTimer = null;
    }
    if (els.plotLoading) {
      els.plotLoading.classList.remove("is-loading");
      els.plotLoading.setAttribute("aria-hidden", "true");
    }
  }

  function showPlotLoading() {
    if (!els.plotLoading || window.Plotly) return;
    if (plotLoadingTimer) return;
    plotLoadingTimer = setTimeout(function () {
      plotLoadingTimer = null;
      if (!window.Plotly && els.plotLoading) {
        els.plotLoading.classList.add("is-loading");
        els.plotLoading.setAttribute("aria-hidden", "false");
      }
    }, 350);
  }

  function ensurePlotly() {
    if (window.Plotly) {
      hidePlotLoading();
      return Promise.resolve();
    }
    if (!plotlyLoadPromise) {
      showPlotLoading();
      plotlyLoadPromise = new Promise(function (resolve, reject) {
        let poll;
        function fail(err) {
          if (poll) clearInterval(poll);
          clearTimeout(deadline);
          plotlyLoadPromise = null;
          hidePlotLoading();
          reject(err);
        }
        const deadline = setTimeout(function () {
          fail(new Error("Chart library load timed out"));
        }, 20000);
        poll = setInterval(function () {
          if (!window.Plotly) return;
          clearInterval(poll);
          clearTimeout(deadline);
          hidePlotLoading();
          resolve();
        }, 50);
        const existing = document.querySelector(
          'script[src*="plotly.js-dist-min"]'
        );
        if (!existing) {
          const s = document.createElement("script");
          s.src =
            "https://cdn.jsdelivr.net/npm/plotly.js-dist-min@2.35.2/plotly.min.js";
          s.async = true;
          s.onerror = function () {
            fail(new Error("Could not load chart library"));
          };
          document.head.appendChild(s);
        }
      });
    }
    return plotlyLoadPromise;
  }

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
        '<p class="data-preview__more">Showing ' +
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

  function isExcelFile(file) {
    const name = (file.name || "").toLowerCase();
    return name.endsWith(".xlsx") || name.endsWith(".xls");
  }

  function parseXlsxFile(file) {
    if (typeof XLSX === "undefined") {
      showMessage("Excel library not loaded. Check your internet connection.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const workbook = XLSX.read(e.target.result, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          showMessage("Excel file has no sheets.", "error");
          return;
        }
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          defval: "",
          raw: false,
        });
        const parsed = detectColumns(rows);
        if (!parsed.headers.length) {
          showMessage("Could not read column headers from Excel.", "error");
          return;
        }
        if (els.fileInfo) {
          els.fileInfo.innerHTML =
            "<strong>" +
            file.name +
            "</strong> · sheet: " +
            sheetName;
        }
        loadData(parsed.headers, parsed.data);
        showMessage("Excel loaded from first sheet: " + sheetName, "info");
      } catch (err) {
        showMessage("Excel read error: " + err.message, "error");
      }
    };
    reader.onerror = function () {
      showMessage("Failed to read Excel file.", "error");
    };
    reader.readAsArrayBuffer(file);
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
        if (els.fileInfo) {
          els.fileInfo.innerHTML = "<strong>" + file.name + "</strong>";
        }
        loadData(parsed.headers, parsed.data);
      },
      error: function (err) {
        showMessage("Failed to read file: " + err.message, "error");
      },
    });
  }

  function parseUploadedFile(file) {
    if (!file) return;
    const name = (file.name || "").toLowerCase();
    if (name.endsWith(".csv")) {
      parseCsvFile(file);
    } else if (isExcelFile(file)) {
      parseXlsxFile(file);
    } else {
      showMessage("Use a .csv or .xlsx file.", "error");
    }
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

    return Plotly.newPlot(els.plotDiv, [trace], layout, PLOT_CONFIG).then(function () {
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
    });
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

    return Plotly.newPlot(els.plotDiv, [trace], layout, PLOT_CONFIG).then(function () {
      renderStats(computeStats(values), col);
    });
  }

  function buildPlot() {
    if (chartMode === "volume") {
      calculateVolume();
      return;
    }
    if (!rawRows.length) {
      showMessage("Upload CSV or load sample data first.", "info");
      return;
    }
    ensurePlotly()
      .then(function () {
        if (chartMode === "histogram") return buildHistogram();
        return buildCrossplot();
      })
      .then(function () {
        hidePlotLoading();
      })
      .catch(function () {
        hidePlotLoading();
        showMessage("Chart library failed to load. Check your connection.", "error");
      });
  }

  function stoiipMmstb(areaKm2, h, phi, sw, bo) {
    const areaM2 = areaKm2 * 1e6;
    const volResM3 = areaM2 * h * phi * (1 - sw);
    return (volResM3 * 6.28981) / bo / 1e6;
  }

  function triangularSample(p90, p50, p10) {
    const low = Math.min(p90, p10);
    const high = Math.max(p90, p10);
    let mode = Math.min(Math.max(p50, low), high);
    if (high <= low) return mode;
    const u = Math.random();
    const fc = (mode - low) / (high - low);
    if (u < fc) return low + Math.sqrt(u * (high - low) * (mode - low));
    return high - Math.sqrt((1 - u) * (high - low) * (high - mode));
  }

  function clampPhiSw(phi, sw) {
    return {
      phi: Math.min(1, Math.max(0, phi)),
      sw: Math.min(1, Math.max(0, sw)),
    };
  }

  function percentile(sorted, p) {
    if (!sorted.length) return NaN;
    const idx = (sorted.length - 1) * p;
    const lo = Math.floor(idx);
    const hi = Math.ceil(idx);
    if (lo === hi) return sorted[lo];
    return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
  }

  function readStochTriplet(prefix) {
    const p90 = parseFloat(document.getElementById("st-" + prefix + "-p90").value);
    const p50 = parseFloat(document.getElementById("st-" + prefix + "-p50").value);
    const p10 = parseFloat(document.getElementById("st-" + prefix + "-p10").value);
    return { p90: p90, p50: p50, p10: p10 };
  }

  function validateTriplet(label, t, opts) {
    if (![t.p90, t.p50, t.p10].every(Number.isFinite)) {
      showMessage(label + ": enter valid P90, P50, and P10 values.", "error");
      return false;
    }
    if (opts && opts.min !== undefined && (t.p90 < opts.min || t.p50 < opts.min || t.p10 < opts.min)) {
      showMessage(label + ": values must be ≥ " + opts.min + ".", "error");
      return false;
    }
    if (opts && opts.max !== undefined && (t.p90 > opts.max || t.p50 > opts.max || t.p10 > opts.max)) {
      showMessage(label + ": values must be ≤ " + opts.max + ".", "error");
      return false;
    }
    return true;
  }

  function setVolumeMode(mode) {
    volumeMode = mode;
    const isStoch = mode === "stochastic";
    if (els.volModeDet) {
      els.volModeDet.classList.toggle("is-active", !isStoch);
      els.volModeDet.setAttribute("aria-selected", String(!isStoch));
    }
    if (els.volModeStoch) {
      els.volModeStoch.classList.toggle("is-active", isStoch);
      els.volModeStoch.setAttribute("aria-selected", String(isStoch));
    }
    if (els.volPanelDet) els.volPanelDet.hidden = isStoch;
    if (els.volPanelStoch) els.volPanelStoch.hidden = !isStoch;
    if (els.volCalcBtn) {
      els.volCalcBtn.textContent = isStoch ? "Run Monte Carlo" : "Calculate STOIIP";
    }
    if (chartMode === "volume") calculateVolume();
  }

  function renderVolumeStatsHtml(p90, p50, p10) {
    return (
      '<div class="stats-panel__title">STOIIP percentiles (MMSTB)</div>' +
      '<table class="stats-table"><tbody>' +
      "<tr><td>P90 (low)</td><td>" + p90.toFixed(2) + "</td></tr>" +
      "<tr><td>P50</td><td><strong>" + p50.toFixed(2) + "</strong></td></tr>" +
      "<tr><td>P10 (high)</td><td>" + p10.toFixed(2) + "</td></tr>" +
      "</tbody></table>"
    );
  }

  function calculateStochasticVolume() {
    const area = readStochTriplet("area");
    const pay = readStochTriplet("pay");
    const phi = readStochTriplet("phi");
    const sw = readStochTriplet("sw");
    const bo = readStochTriplet("bo");

    if (
      !validateTriplet("Area", area, { min: 0 }) ||
      !validateTriplet("Net pay", pay, { min: 0 }) ||
      !validateTriplet("Porosity", phi, { min: 0, max: 1 }) ||
      !validateTriplet("Water saturation", sw, { min: 0, max: 1 }) ||
      !validateTriplet("Bo", bo, { min: 0.1 })
    ) {
      return;
    }

    const trials = 5000;
    const samples = [];
    for (let i = 0; i < trials; i++) {
      const a = triangularSample(area.p90, area.p50, area.p10);
      const h = triangularSample(pay.p90, pay.p50, pay.p10);
      const p = clampPhiSw(
        triangularSample(phi.p90, phi.p50, phi.p10),
        triangularSample(sw.p90, sw.p50, sw.p10)
      );
      const b = triangularSample(bo.p90, bo.p50, bo.p10);
      if (b <= 0) continue;
      samples.push(stoiipMmstb(a, h, p.phi, p.sw, b));
    }

    if (!samples.length) {
      showMessage("Could not generate stochastic samples. Check inputs.", "error");
      return;
    }

    samples.sort(function (a, b) {
      return a - b;
    });
    const p90Vol = percentile(samples, 0.1);
    const p50Vol = percentile(samples, 0.5);
    const p10Vol = percentile(samples, 0.9);

    hideMessage();
    if (els.volumeResult) els.volumeResult.hidden = false;
    if (els.volumeStoiip) {
      els.volumeStoiip.textContent = "P50: " + p50Vol.toFixed(2) + " MMSTB";
    }
    if (els.volumeDetail) {
      els.volumeDetail.textContent =
        "P90 " +
        p90Vol.toFixed(2) +
        " · P10 " +
        p10Vol.toFixed(2) +
        " MMSTB · " +
        trials.toLocaleString() +
        " Monte Carlo trials";
    }
    if (els.volumePercentiles) {
      els.volumePercentiles.hidden = false;
      els.volumePercentiles.innerHTML =
        '<div class="volume-percentiles__cell volume-percentiles__cell--p90">' +
        '<span class="volume-percentiles__label">P90</span>' +
        '<span class="volume-percentiles__value">' +
        p90Vol.toFixed(1) +
        "</span>" +
        '<span class="volume-percentiles__unit">MMSTB</span></div>' +
        '<div class="volume-percentiles__cell volume-percentiles__cell--p50">' +
        '<span class="volume-percentiles__label">P50</span>' +
        '<span class="volume-percentiles__value">' +
        p50Vol.toFixed(1) +
        "</span>" +
        '<span class="volume-percentiles__unit">MMSTB</span></div>' +
        '<div class="volume-percentiles__cell volume-percentiles__cell--p10">' +
        '<span class="volume-percentiles__label">P10</span>' +
        '<span class="volume-percentiles__value">' +
        p10Vol.toFixed(1) +
        "</span>" +
        '<span class="volume-percentiles__unit">MMSTB</span></div>';
    }
    if (els.stats) els.stats.innerHTML = renderVolumeStatsHtml(p90Vol, p50Vol, p10Vol);

    if (els.plotDiv && typeof Plotly !== "undefined") {
      const trace = {
        x: samples,
        type: "histogram",
        nbinsx: 40,
        marker: { color: "rgba(45, 212, 191, 0.75)", line: { color: "#0f1419", width: 0.5 } },
        name: "STOIIP",
      };
      const layout = JSON.parse(JSON.stringify(PLOT_LAYOUT));
      layout.title = {
        text: "Stochastic STOIIP — Monte Carlo distribution",
        font: { size: 14, color: "#e8eaed" },
      };
      layout.xaxis.title = "STOIIP (MMSTB)";
      layout.yaxis.title = "Frequency";
      layout.bargap = 0.03;
      layout.shapes = [
        { type: "line", x0: p90Vol, x1: p90Vol, y0: 0, y1: 1, yref: "paper", line: { color: "#fbbf24", width: 2, dash: "dot" } },
        { type: "line", x0: p50Vol, x1: p50Vol, y0: 0, y1: 1, yref: "paper", line: { color: "#2dd4bf", width: 2 } },
        { type: "line", x0: p10Vol, x1: p10Vol, y0: 0, y1: 1, yref: "paper", line: { color: "#60a5fa", width: 2, dash: "dot" } },
      ];
      layout.annotations = [
        { x: p90Vol, y: 1.02, xref: "x", yref: "paper", text: "P90", showarrow: false, font: { size: 10, color: "#fbbf24" } },
        { x: p50Vol, y: 1.02, xref: "x", yref: "paper", text: "P50", showarrow: false, font: { size: 10, color: "#2dd4bf" } },
        { x: p10Vol, y: 1.02, xref: "x", yref: "paper", text: "P10", showarrow: false, font: { size: 10, color: "#60a5fa" } },
      ];
      ensurePlotly().then(function () {
        Plotly.newPlot(els.plotDiv, [trace], layout, PLOT_CONFIG);
      });
    }
  }

  function calculateVolume() {
    if (volumeMode === "stochastic") {
      calculateStochasticVolume();
      return;
    }

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
    if (els.volumePercentiles) els.volumePercentiles.hidden = true;
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
      ensurePlotly().then(function () {
        Plotly.newPlot(els.plotDiv, [], layout, PLOT_CONFIG);
      });
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

    const tabs = [
      { el: els.tabCrossplot, panel: els.panelCrossplot, id: "crossplot" },
      { el: els.tabHistogram, panel: els.panelHistogram, id: "histogram" },
      { el: els.tabVolume, panel: els.panelVolume, id: "volume" },
    ];
    tabs.forEach(function (t) {
      if (t.el) {
        const active = mode === t.id;
        t.el.classList.toggle("is-active", active);
        t.el.setAttribute("aria-selected", String(active));
      }
      if (t.panel) t.panel.hidden = mode !== t.id;
    });

    if (els.chartOnlyActions) {
      els.chartOnlyActions.hidden = mode === "volume";
    }
    if (mode === "volume") {
      hideMessage();
      if (els.plotDiv && window.Plotly) {
        calculateVolume();
      } else if (els.plotDiv) {
        ensurePlotly().then(calculateVolume);
      }
    } else if (rawRows.length) {
      buildPlot();
    } else if (els.plotDiv && window.Plotly) {
      Plotly.purge(els.plotDiv);
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
    if (els.plotDiv && window.Plotly) Plotly.purge(els.plotDiv);
    hideMessage();
  }

  function loadSampleFromFile() {
    fetch("../assets/technical/sample-well-data.csv")
      .then(function (r) {
        return r.text();
      })
      .then(function (text) {
        if (typeof Papa === "undefined") return;
        const result = Papa.parse(text, { skipEmptyLines: true });
        const parsed = detectColumns(result.data);
        if (els.fileInfo) {
          els.fileInfo.innerHTML = "<strong>Sample CSV</strong> (well data)";
        }
        loadData(parsed.headers, parsed.data);
        showMessage("Sample loaded. Porosity vs Permeability crossplot ready.", "info");
      })
      .catch(loadSampleData);
  }

  /* Upload handlers */
  if (els.uploadZone && els.fileInput) {
    els.uploadZone.addEventListener("click", function () {
      els.fileInput.click();
    });
    els.uploadZone.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        els.fileInput.click();
      }
    });
    els.fileInput.addEventListener("change", function () {
      const file = els.fileInput.files[0];
      if (file) parseUploadedFile(file);
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
      if (file) parseUploadedFile(file);
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
  if (els.volModeDet)
    els.volModeDet.addEventListener("click", function () {
      setVolumeMode("deterministic");
    });
  if (els.volModeStoch)
    els.volModeStoch.addEventListener("click", function () {
      setVolumeMode("stochastic");
    });

  [els.colX, els.colY, els.colHist, els.colColor, els.bins, els.logX, els.logY].forEach(
    function (el) {
      if (el) el.addEventListener("change", buildPlot);
    }
  );

  const params = new URLSearchParams(window.location.search);
  const modeParam = params.get("mode");
  if (modeParam && ["crossplot", "histogram", "volume"].indexOf(modeParam) >= 0) {
    setChartMode(modeParam);
  } else {
    setChartMode("crossplot");
  }
  if (params.get("stochastic") === "1" || modeParam === "volume") {
    setVolumeMode("stochastic");
  }
  if (params.get("sample") === "1") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", loadSampleFromFile);
    } else {
      setTimeout(loadSampleFromFile, 100);
    }
  }
})();
