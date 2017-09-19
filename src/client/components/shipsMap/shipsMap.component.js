angular.module('app').component('shipsMap', {
  template: '<div class="map"><h1>Loading map...</h1></div>',
  bindings: {
    onMapLoaded: '&?',
    /* A google.maps.MapOptions object */
    options: '<?',
  },
  controller(API_ENDPOINT, $rootScope, $element, googleMapsAPI, shipsAPI, $compile) {
    function generateShipIcon(feature) {
      const defaultIcon = {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        strokeColor: 'black',
        fillColor: '#00F',
        strokeWeight: 2,
        scale: 4,
      };

      return {
        icon: angular.extend(defaultIcon, {
          // Add any relevant feature properties (if any)
          rotation: feature.getProperty('course') || defaultIcon.rotation,
          strokeColor: feature.getProperty('strokeColor') || defaultIcon.strokeColor,
          scale: feature.getProperty('scale') || defaultIcon.scale,
        }),
      };
    }

    const createMap = () => googleMapsAPI.get().then((google) => {
      const mapElem = $element.find('div')[0];

      // Create the map
      const map = new google.maps.Map(mapElem, angular.extend({
        disableDefaultUI: true,
      }, this.options));

      // Fire event
      (this.onMapLoaded || angular.noop)({
        $map: map,
      });

      return map;
    });

    const createInfoWindow = (map) => {
      const infowindow = new google.maps.InfoWindow();

      // Open the infoWindow when a feature is clicked
      map.data.addListener('click', (event) => {
        console.debug('clicked:', event.feature);

        const shipData = $compile(`<ship-data ship="${event.feature.getId()}">`)($rootScope)[0];

        infowindow.setContent(shipData);
        infowindow.setPosition(event.feature.getGeometry().get());
        infowindow.open(map);
      });

      map.addListener('click', () => {
        infowindow.close();
      });
    };

    const loadPointsToDataLayer = (data) => {
      // Clear all data
      data.forEach(feature => data.remove(feature));

      // Add all ships
      data.loadGeoJson(`${API_ENDPOINT}/points`);
    };

    this.$onInit = () => {
      console.debug('$onInit ships-map', $element);

      createMap().then((map) => {
        createInfoWindow(map);
        loadPointsToDataLayer(map.data);
        map.data.setStyle(generateShipIcon);
      });
    };
  },
});
