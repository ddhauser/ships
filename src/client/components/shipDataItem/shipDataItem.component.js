angular.module('app').component('shipDataItem', {
  templateUrl: 'components/shipDataItem/shipDataItem.html',
  require: {

  },
  bindings: {
    inEditMode: '<',
    name: '<',
    value: '<',
    onValueChanged: '&',
  },
  controller($scope) {
    this.isObject = o => angular.isObject(o);

    this.valueExists = v => angular.isDefined(v) && v !== null;

    this.$onInit = () => {
      /**
             * Notify when value changes
             */
      $scope.$watch(
        () => this.value,
        (value) => {
          this.onValueChanged({
            $newValue: value,
          });
        },
        true,
      );
    };
  },
});
