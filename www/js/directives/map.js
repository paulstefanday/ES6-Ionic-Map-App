export default [ 'map', () => {
  
  return {
    restrict: 'E',
    scope: {},
    controller: ($scope, mapService) => {
      $scope.getGeo = mapService.getGeo;
    },
    link: ($scope, $element, $attr) => {
      var load = () => { $scope.getGeo().then(res => initialize(res, $element)) };
      if (document.readyState === "complete") load();
      else google.maps.event.addDomListener(window, 'load', load());
    }
  };

  function initialize(res, el) {

        var mapOptions = {
          center: new google.maps.LatLng(res.latitude, res.longitude), zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        
        var map = new google.maps.Map(el[0], mapOptions);

        // Stop the side bar from dragging when mousedown/tapdown on the map
        google.maps.event.addDomListener(el[0], 'mousedown', e => { e.preventDefault(); return false; });
    }
}]
