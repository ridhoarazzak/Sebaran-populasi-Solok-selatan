// Inisialisasi peta
var map = L.map('map').setView([-1.55, 101.3], 10);

// Basemap
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
});
var esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles © Esri'
});
osm.addTo(map);

// HRSL tile dari Earth Engine
var hrsl = L.tileLayer(
  'https://earthengine.googleapis.com/v1/projects/ee-mrgridhoarazzak/maps/64010df46c311212d54025fecb61d2e1-53d18af144c6d5806bc3bb5ed7634ee7/tiles/{z}/{x}/{y}',
  {
    attribution: 'HRSL Facebook / GEE',
    opacity: 0.6
  }
).addTo(map);

// Kontrol layer
L.control.layers({ "OSM": osm, "Esri": esri }, { "HRSL": hrsl }).addTo(map);

// CSV + Chart.js
Papa.parse('populasi.csv', {
  header: true,
  download: true,
  complete: function(results) {
    const data = results.data;
    const labels = data.map(d => d.nagari || d.nama_nagari).filter(Boolean);
    const total = data.map(d => parseFloat(d.total_pop || 0)).filter(n => !isNaN(n));

    new Chart(document.getElementById('chartPopulasi'), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total Populasi',
          data: total,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            title: { display: true, text: 'Populasi (jiwa)' }
          },
          y: { ticks: { autoSkip: false } }
        }
      }
    });
  }
});
