// Inisialisasi peta
var map = L.map('map').setView([-1.55, 101.3], 12);

// Basemap
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
});
var esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles © Esri'
});
osm.addTo(map);

// HRSL Tile
var hrsl = L.tileLayer(
  'https://earthengine.googleapis.com/v1/projects/ee-mrgridhoarazzak/maps/64010df46c311212d54025fecb61d2e1-53d18af144c6d5806bc3bb5ed7634ee7/tiles/{z}/{x}/{y}',
  {
    attribution: 'HRSL Facebook / Earth Engine',
    opacity: 0.6
  }
).addTo(map);

// Layer control
L.control.layers({ "OpenStreetMap": osm, "Esri": esri }, { "HRSL": hrsl }).addTo(map);

// 1. Ambil CSV pop_rendah lalu join ke GeoJSON
let popData = {};

Papa.parse('https://raw.githubusercontent.com/ridhoarazzak/Sebaran-populasi-Solok-selatan/main/Populasi_Kategori_PerNagari.csv', {
  header: true,
  download: true,
  complete: function(results) {
    results.data.forEach(row => {
      const nama = row.NAMOBJ?.trim();
      const pop = parseFloat(row.pop_rendah);
      if (nama && !isNaN(pop)) {
        popData[nama] = pop;
      }
    });

    // Ambil GeoJSON setelah CSV siap
    fetch('https://raw.githubusercontent.com/ridhoarazzak/Sebaran-populasi-Solok-selatan/main/geojson_shp_desa.geojson')
      .then(res => res.json())
      .then(geojsonData => {
        L.geoJSON(geojsonData, {
          style: {
            color: 'blue',
            weight: 1,
            fillOpacity: 0
          },
          onEachFeature: function (feature, layer) {
            const nama = feature.properties.NAMOBJ?.trim();
            const pop = popData[nama] ? popData[nama].toFixed(0) : '-';

            layer.bindTooltip(`${nama}: ${pop} jiwa`, {
              sticky: true,
              direction: 'top'
            });

            layer.bindPopup(`<strong>${nama}</strong><br>Populasi Rendah: ${pop} jiwa`);
          }
        }).addTo(map);
      });
  }
});

// 2. Buat chart populasi per nagari dari CSV
Papa.parse('https://raw.githubusercontent.com/ridhoarazzak/Sebaran-populasi-Solok-selatan/main/Populasi_Kategori_PerNagari.csv', {
  header: true,
  download: true,
  complete: function(results) {
    const data = results.data;
    const validData = data.filter(row => row.NAMOBJ && !isNaN(parseFloat(row.pop_rendah)));

    const labels = validData.map(row => row.NAMOBJ.trim());
    const popRendah = validData.map(row => parseFloat(row.pop_rendah));

    new Chart(document.getElementById('chartPopulasi'), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Populasi per Nagari',
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
          x: {
            title: {
              display: true,
              text: 'Jumlah Jiwa'
            }
          },
          y: {
            ticks: { autoSkip: false },
            title: {
              display: true,
              text: 'Nagari'
            }
          }
        }
      }
    });
  }
});
