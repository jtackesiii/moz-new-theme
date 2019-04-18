import L from 'leaflet'
import 'leaflet-fullscreen'
// import leafletImage from 'leaflet-image'

class Map {
  constructor(id) {

    // remove and refresh before init
    if (figureModal) {
      if (window.mapID != undefined || window.mapID != undefined) {
        window.mapID.off()
        window.mapID.remove()
      }
      let node = document.getElementById(id);
      if (node) {
        while (node.firstChild) {
          node.removeChild(node.firstChild)
        }
      }
    }


    if (id) {
      this.el = id
      this.tiles = 'http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg'
      this.attribution =
      '<a href="http://maps.stamen.com">Map tiles</a> by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="https://creativecommons.org/licenses/by/3.0">CC BY SA</a>'
      this.data = $(`#${this.el}`).data('geojson')
      this.center = this.getCoordinates()
      this.defaultZoom = 3
      this.map = this.createMap()
      window.mapID = this.map
      this.addTiles()

      this.map.on('fullscreenchange', function () {
          this.invalidateSize(true)
      })

      if (this.data) {
        this.getData()
      }

      setTimeout(() => {
        this.map.invalidateSize()
      }, 100)
    }
  }

  createMap() {
    return L.map(this.el, {
      fullscreenControl: {
          pseudoFullscreen: false // if true, fullscreen to page width and height
      }
    })
    .setView(this.center, this.defaultZoom)
  }

  addTiles() {
    L.tileLayer(this.tiles, {
      // options
      attribution: this.attribution
    }).addTo(this.map)
  }

  getCoordinates() {
    let lat = $('#' + this.el).data('lat')
    let long = $('#' + this.el).data('long')
    return [lat, long]
  }

  getData() {
    $.getJSON(this.data, json => {
      L.geoJson(json, {
        // Change the style here as desired
        pointToLayer: (feature, latlng) => {
          return L.circleMarker(latlng, {
            radius: 8,
            fillColor: '#CF4747',
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.75
          })
        },

        // Change styles here as desired
        onEachFeature: (feature, layer) =>  {
          let options = { minWidth: 100, maxHeight: 250 }
          var layerType = layer.feature.geometry.type
          if (layerType === 'Point') {
            layer.bindPopup(feature.properties.description, options)
            layer.on('mouseover', function (e) {
              this.openPopup()
            })
            layer.on('mouseout', function (e) {
              this.closePopup()
            })
            layer.on('click', function (e) {
              window.location.replace(feature.properties.link, '_self')
              return false
            })
          }
        }
      }).addTo(this.map)
    })
  }
}

export default Map
