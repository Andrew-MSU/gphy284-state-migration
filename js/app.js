(() => {
  const CENTROIDS = {
    Alabama:[-86.9023,32.3182],Alaska:[-152.4044,61.3707],Arizona:[-111.4312,33.7298],
    Arkansas:[-92.3731,34.9697],California:[-119.6816,36.1162],Colorado:[-105.3111,39.0598],
    Connecticut:[-72.7554,41.5978],Delaware:[-75.5071,39.3185],'District of Columbia':[-77.0268,38.9072],
    Florida:[-81.6868,27.7663],Georgia:[-83.6431,33.0406],Hawaii:[-157.4983,21.0943],
    Idaho:[-114.4788,44.2405],Illinois:[-88.9861,40.3495],Indiana:[-86.2816,39.8494],
    Iowa:[-93.2105,42.0115],Kansas:[-98.3804,38.5266],Kentucky:[-84.6701,37.6681],
    Louisiana:[-91.8678,31.1695],Maine:[-69.3819,44.6939],Maryland:[-76.8021,39.0639],
    Massachusetts:[-71.5301,42.2302],Michigan:[-84.5361,43.3266],Minnesota:[-93.9002,45.6945],
    Mississippi:[-89.6787,32.7416],Missouri:[-92.2884,38.4561],Montana:[-110.4544,46.9219],
    Nebraska:[-99.9018,41.1254],Nevada:[-117.0554,38.3135],'New Hampshire':[-71.5639,43.4525],
    'New Jersey':[-74.521,40.2989],'New Mexico':[-106.2485,34.8405],'New York':[-74.9481,42.1657],
    'North Carolina':[-79.8064,35.6301],'North Dakota':[-99.784,47.5289],Ohio:[-82.7649,40.3888],
    Oklahoma:[-96.9289,35.5653],Oregon:[-122.0709,44.572],Pennsylvania:[-77.2098,40.5908],
    'Rhode Island':[-71.5118,41.6809],'South Carolina':[-80.9066,33.8569],'South Dakota':[-99.4388,44.2998],
    Tennessee:[-86.6923,35.7478],Texas:[-97.5635,31.0545],Utah:[-111.8624,40.15],
    Vermont:[-72.7107,44.0459],Virginia:[-78.1699,37.7693],Washington:[-121.4905,47.4009],
    'West Virginia':[-80.9696,38.4912],Wisconsin:[-89.6165,44.2685],Wyoming:[-107.3025,42.7559]
  };

  const map = L.map('map', { zoomControl: true, attributionControl: true })
    .setView([39.8, -98.5], 4);
  // Esri Canvas Dark Gray — public tiles, no API key
  L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    {
      attribution: 'Tiles &copy; Esri — Esri, HERE, Garmin, FAO, NOAA, USGS',
      maxZoom: 8
    }
  ).addTo(map);

  let flows = [];
  let meta = {};
  let selected = null;
  let highlightFlow = null;
  const flowLayer = L.layerGroup().addTo(map);
  let statesLayer = null;

  const el = {
    direction: document.getElementById('direction'),
    topn: document.getElementById('topn'),
    clearBtn: document.getElementById('clearBtn'),
    panelTitle: document.getElementById('panelTitle'),
    panelHint: document.getElementById('panelHint'),
    stats: document.getElementById('stats'),
    rankBody: document.querySelector('#rankTable tbody'),
    colPartner: document.getElementById('colPartner'),
    citation: document.getElementById('citation'),
    footnote: document.getElementById('footnote')
  };

  function fmt(n) {
    return n == null ? '—' : Number(n).toLocaleString('en-US');
  }

  function stateStyle(feature) {
    const name = feature.properties.name;
    const isSel = selected === name;
    return {
      color: isSel ? '#22d3ee' : '#475569',
      weight: isSel ? 2.5 : 1,
      fillColor: isSel ? '#0891b2' : '#1e293b',
      fillOpacity: isSel ? 0.55 : 0.35
    };
  }

  function filteredFlows() {
    if (!selected) return [];
    const dir = el.direction.value;
    let rows = flows.filter(f => dir === 'out' ? f.o === selected : f.d === selected);
    rows = rows.slice().sort((a, b) => b.n - a.n);
    const topn = Number(el.topn.value);
    if (topn > 0) rows = rows.slice(0, topn);
    return rows;
  }

  function flowPopupHtml(f, rank) {
    return `<strong>${f.o} → ${f.d}</strong><br>` +
      `Movers: <strong>${fmt(f.n)}</strong>` +
      (f.m != null ? `<br>±MOE (90%): ${fmt(f.m)}` : '') +
      (rank != null ? `<br>Rank #${rank} for ${selected}` : '');
  }

  function drawFlows() {
    flowLayer.clearLayers();
    const rows = filteredFlows();
    if (!rows.length) return;
    const maxN = rows[0].n;
    rows.forEach((f, idx) => {
      const from = CENTROIDS[f.o];
      const to = CENTROIDS[f.d];
      if (!from || !to) return;
      const t = Math.max(0.15, f.n / maxN);
      const weight = 1 + t * 7;
      const isHi = highlightFlow && highlightFlow.o === f.o && highlightFlow.d === f.d;
      const latlngs = [[from[1], from[0]], [to[1], to[0]]];
      const line = L.polyline(latlngs, {
        color: isHi ? '#f472b6' : '#f59e0b',
        weight: isHi ? weight + 1.5 : weight,
        opacity: isHi ? 0.95 : 0.4 + t * 0.5,
        lineCap: 'round'
      });
      const partner = el.direction.value === 'out' ? f.d : f.o;
      line.bindTooltip(
        `${partner}: ${fmt(f.n)} movers`,
        { sticky: true, direction: 'top', opacity: 0.95, className: 'state-tip' }
      );
      line.bindPopup(flowPopupHtml(f, idx + 1));
      line.on('click', () => {
        highlightFlow = f;
        renderTable(rows);
        drawFlows();
        line.openPopup();
      });
      line.addTo(flowLayer);

      // Number badge on top 8 flows so mobile users see counts without opening the table
      if (idx < 8) {
        const mid = [(from[1] + to[1]) / 2, (from[0] + to[0]) / 2];
        const marker = L.marker(mid, {
          interactive: false,
          icon: L.divIcon({
            className: '',
            html: `<div class="flow-label">${partner}: ${fmt(f.n)}</div>`,
            iconSize: null
          })
        });
        marker.addTo(flowLayer);
      }
    });
  }

  function renderTable(rows) {
    el.colPartner.textContent = el.direction.value === 'out' ? 'Destination' : 'Origin';
    el.rankBody.innerHTML = '';
    if (!rows.length) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="4" style="color:#9ca3af">No flows for this selection.</td>`;
      el.rankBody.appendChild(tr);
      return;
    }
    rows.forEach((f, i) => {
      const partner = el.direction.value === 'out' ? f.d : f.o;
      const tr = document.createElement('tr');
      if (highlightFlow && highlightFlow.o === f.o && highlightFlow.d === f.d) tr.classList.add('active');
      tr.innerHTML =
        `<td>${i + 1}</td>` +
        `<td>${partner}</td>` +
        `<td class="num"><strong>${fmt(f.n)}</strong></td>` +
        `<td class="num">${f.m == null ? '—' : '±' + fmt(f.m)}</td>`;
      tr.addEventListener('click', () => {
        highlightFlow = f;
        renderTable(rows);
        drawFlows();
        const from = CENTROIDS[f.o];
        const to = CENTROIDS[f.d];
        if (from && to) {
          L.popup()
            .setLatLng([(from[1] + to[1]) / 2, (from[0] + to[0]) / 2])
            .setContent(flowPopupHtml(f, i + 1))
            .openOn(map);
        }
        // Keep table in view on mobile
        tr.scrollIntoView({ block: 'nearest' });
      });
      el.rankBody.appendChild(tr);
    });
  }

  function updatePanel() {
    if (!selected) {
      el.panelTitle.textContent = 'Click a state';
      el.panelHint.textContent = 'Select a state to list top destinations/sources with mover counts. Scroll this panel on phones to see the full table.';
      el.stats.classList.add('hidden');
      el.rankBody.innerHTML = '';
      flowLayer.clearLayers();
      return;
    }
    const dir = el.direction.value;
    const all = flows.filter(f => dir === 'out' ? f.o === selected : f.d === selected)
      .sort((a, b) => b.n - a.n);
    const shown = filteredFlows();
    const total = all.reduce((s, f) => s + f.n, 0);
    el.panelTitle.textContent = `${selected} — ${dir === 'out' ? 'outflows' : 'inflows'}`;
    el.panelHint.textContent = dir === 'out'
      ? `Top destinations from ${selected} (ACS 2024). Counts are in the table and on map labels.`
      : `Top sources into ${selected} (ACS 2024). Counts are in the table and on map labels.`;
    el.stats.classList.remove('hidden');
    el.stats.innerHTML = `
      <div><div class="k">Total ${dir === 'out' ? 'out-movers' : 'in-movers'}</div><div class="v">${fmt(total)}</div></div>
      <div><div class="k">Showing</div><div class="v">${fmt(shown.length)} of ${fmt(all.length)}</div></div>`;
    renderTable(shown);
    drawFlows();
    // On mobile, nudge panel into view after select
    if (window.matchMedia('(max-width: 900px)').matches) {
      document.querySelector('.panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function selectState(name) {
    selected = name;
    highlightFlow = null;
    if (statesLayer) statesLayer.setStyle(stateStyle);
    updatePanel();
  }

  el.direction.addEventListener('change', () => { highlightFlow = null; updatePanel(); });
  el.topn.addEventListener('change', () => { highlightFlow = null; updatePanel(); });
  el.clearBtn.addEventListener('click', () => {
    selected = null;
    highlightFlow = null;
    if (statesLayer) statesLayer.setStyle(stateStyle);
    updatePanel();
  });

  Promise.all([
    fetch('data/flows_2024.json').then(r => r.json()),
    fetch('data/meta.json').then(r => r.json()),
    fetch('data/states.geojson').then(r => r.json())
  ]).then(([flowData, metaData, states]) => {
    flows = flowData;
    meta = metaData;
    el.citation.textContent = `${meta.vintage || '2024'} ACS state-to-state · Census Bureau`;
    el.footnote.textContent = `${meta.citation || ''} Lines are schematic (centroid→centroid), not travel paths. MOE = 90% margin of error.`;

    statesLayer = L.geoJSON(states, {
      style: stateStyle,
      filter: f => f.properties && f.properties.name && CENTROIDS[f.properties.name],
      onEachFeature: (feature, layer) => {
        const name = feature.properties.name;
        layer.on({
          mouseover: e => {
            if (selected === name) return;
            e.target.setStyle({ weight: 2, fillOpacity: 0.5 });
          },
          mouseout: e => e.target.setStyle(stateStyle(feature)),
          click: () => selectState(name)
        });
        layer.bindTooltip(name, { sticky: true, direction: 'top', className: 'state-tip' });
      }
    }).addTo(map);
  }).catch(err => {
    el.panelHint.textContent = 'Failed to load data: ' + err;
  });
})();
