angular.module('app').component('shipData', {
  templateUrl: 'components/shipData/shipData.html',
  bindings: {
    ship: '@',
  },
  controller($element, shipsAPI) {
    this.isObject = o => angular.isObject(o);

    // Holds the original data (for canceling edits)
    let originalData;

    this.startEdit = () => {
      // Save the data
      originalData = angular.merge({}, this.data);

      this.edit = true;
    };

    this.cancelEdit = () => {
      // Rollback
      this.data = angular.merge({}, originalData);

      this.edit = false;
    };

    this.save = () => {
      shipsAPI.updateShipData(this.data)
        .then(() => {
          // Accept the edited ship data as the true data
          originalData = angular.merge({}, this.data);

          this.edit = false;
        })
        .catch((err) => {
          // TODO: an error can be either a network error or a server validation error

          console.error(`Error saving ship-data, ship=${this.data._id}`, err);
        });
    };

    this.$onInit = () => {
      console.debug('$onInit ship-data of', this.ship);

      shipsAPI.getShipData(this.ship).then((data) => {
        console.debug('ship %s data', this.ship, data);

        this.data = data;
      });
    };
  },
});
