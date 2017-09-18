angular.module('app').service('shipsAPI', function shipsAPI($http, API_ENDPOINT) {
  /**
    * All api calls to the server
    */

  this.getBiggestShip = () => $http.get(`${API_ENDPOINT}/biggest`).then(res => res.data);
  this.getShipData = id => $http.get(`${API_ENDPOINT}/${id}/data`).then(res => res.data);
  this.updateShipData = data => $http.post(`${API_ENDPOINT}/${data._id}/data`, data).then(res => res.data);
});
