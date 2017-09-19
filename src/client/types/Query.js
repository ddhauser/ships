angular.module('app').constant(
  'Query',
  /**
     * color:       The color for the features that match the query
     * text:        The query description
     * getFeatures: A function for getting the features that match the query
     * zoomTo:      optional, a function for zooming to the features
     */
  function Query({
    color, text, getFeatures, zoomTo = angular.noop,
  }) {
    /**
        * Are the query results displayed on the map
        */
    this.active = false;

    this.color = color;
    this.text = text;

    this.toggle = () => {
      const newState = !this.active;

      getFeatures().then((features) => {
        features.forEach((feature) => {
          if (newState) {
            feature.setProperty('strokeColor', this.color);
            feature.setProperty('scale', 5);
          } else {
            feature.removeProperty('strokeColor');
            feature.removeProperty('scale');
          }
        });

        return features;
      })
        .then((features) => {
          this.active = newState;

          if (this.active) zoomTo(features);
        });
    };
  },
);
