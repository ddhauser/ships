angular.module('app').component('shipsQueries', {
  templateUrl: 'components/shipsQueries/shipsQueries.html',
  bindings: {
    map: '<',
  },
  controller($q, shipsAPI, googleMapsAPI, Query) {
    this.queries = [];

    /**
         * Add a new query
         */
    this.addQuery = query => query instanceof Query && this.queries.push(query);

    this.$onInit = () => {
      googleMapsAPI.get().then((google) => {
        this.addQuery(new Query({
          color: 'green',
          text: 'find biggest ship',
          getFeatures: () => shipsAPI.getBiggestShip().then(ship => [this.map.data.getFeatureById(ship._id)]),
          zoomTo: features => this.map.setCenter(features[0].getGeometry().get()),
        }));

        const bounds = new google.maps.LatLngBounds({ lng: 28, lat: 40 }, { lng: 30, lat: 42 });
        this.addQuery(new Query({
          color: 'blue',
          text: `ships in area ${bounds.toString()}`,
          getFeatures: () => {
            const features = [];

            // Get all ships if the area
            this.map.data.forEach((feature) => {
              const geom = feature.getGeometry().get();
              if (bounds.contains(geom)) features.push(feature);
            });

            return $q.resolve(features);
          },
          zoomTo: () => this.map.fitBounds(bounds),
        }));
      });
    };
  },
});
