export default ($scope, mapService) => {

  $scope.setCurrent = () => {
    mapService.getGeo();
  }

  $scope.setCustom = (loc) => {
  	mapService.setCustom(loc);
  }
  
}
