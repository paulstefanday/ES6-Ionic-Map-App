export default /*@ngInject*/ ($scope, mapService, $state) => {

  $scope.setCurrent = () => {
    mapService.getGeo().then(res => $state.go('map'));
  }

  $scope.setCustom = (loc) => {
  	mapService.setCustom(loc).then(res => $state.go('map'));
  }
  
}
