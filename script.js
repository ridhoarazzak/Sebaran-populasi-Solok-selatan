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

// Tile HRSL dari Earth Engine
var hrsl = L.tileLayer(
  'https://earthengine.googleapis.com/v1/projects/ee-mrgridhoarazzak/maps/64010df46c311212d54025fecb61d2e1-53d18af144c6d5806bc3bb5ed7634ee7/tiles/{z}/{x}/{y}',
  {
    attribution: 'HRSL Facebook / Earth Engine',
    opacity: 0.6
  }
).addTo(map);

// Layer Control
L.control.layers({ "OpenStreetMap": osm, "Esri": esri }, { "HRSL": hrsl }).addTo(map);

// CSV dari GitHub langsung
Papa.parse('https://raw.githubusercontent.com/ridhoarazzak/Sebaran-populasi-Solok-selatan/main/Populasi_Kategori_PerNagari.csv', {
  header: true,
  download: true,
  complete: function(results) {
    const data = results.data;

    // Ambil nama nagari dan nilai pop_rendah dari CSV
    const labels = data.map(row => row.nagari).filter(x => x);
    const popRendah = data.map(row => parseFloat(row.pop_rendah)).filter(x => !isNaN(x));

    console.log('Populasi Rendah per Nagari:', popRendah);

    new Chart(document.getElementById('chartPopulasi'), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Populasi Kategori Rendah',
          data: popRendah,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        indexAxis: 'y',
        scales: {
          x: { title: { display: true, text: 'Jumlah Jiwa (Kategori Rendah)' }},
          y: { ticks: { autoSkip: false } }
        }
      }
    });
  }
});
