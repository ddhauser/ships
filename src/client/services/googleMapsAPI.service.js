angular.module('app').service('googleMapsAPI', function googleMapsAPI($window, $q, API_KEY) {
    /**
     *  Loads the google maps api async
     */

    function load() {
        const s = document.createElement('script');
        s.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initMap`;
        document.body.appendChild(s);
    }

    const loaded = $q.defer();

    window.initMap = () => {
        loaded.resolve(window.google);
    };

    this.get = () => loaded.promise;

    load();
});