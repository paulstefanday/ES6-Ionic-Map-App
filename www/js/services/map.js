export default [ 'mapService', function($q, $state, $ionicLoading, $cordovaGeolocation) {

    this.pos = false
    this.loading = () => $ionicLoading.show({ content: 'Getting current location...', showBackdrop: true });
    this.loaded = () => $ionicLoading.hide();
    ;

    this.getGeo = () => {
        let q = $q.defer();
        
        if(this.pos) q.resolve(this.pos);
        else this.setCurrent().then(res => q.resolve(res));
        
        return q.promise;
    }

    this.setCurrent = () => {
        let q = $q.defer();

        this.loading();

        // navigator.geolocation.getCurrentPosition(pos => {
        //     this.pos = pos.coords;
        //     this.loaded();
        //     q.resolve(this.pos);
        // }, error => {
        //     this.loaded();
        //     alert('Unable to get location: ' + error.message);
        //     q.reject(error);
        // });

        $cordovaGeolocation
            .getCurrentPosition({timeout: 10000, enableHighAccuracy: false})
            .then(position => {
                this.pos = {latitude: position.coords.latitude, longitude: position.coords.longitude};
                this.loaded();
                q.resolve(this.pos);
            }, err => {
                this.loaded();
                alert('Unable to get location: ' + err.message);
                q.reject(err)
            });


        return q.promise;
    }

    this.setCustom = loc => {

        this.loading();

        let geocoder = new google.maps.Geocoder();

        geocoder.geocode({ 'address': loc, 'partialmatch': true }, 
            (results, status) => {
                this.loaded();
                if (status == 'OK' && results.length > 0) {
                    this.pos = {latitude: results[0].geometry.location.G, longitude: results[0].geometry.location.K};
                    $state.go('map');
                }
                else alert("Geocode was not successful for the following reason: " + status);
            }
        ); 

    }
 

}]
