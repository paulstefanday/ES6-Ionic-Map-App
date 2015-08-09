export default [ 'mapService', function($q, $state, $ionicLoading) {

    this.pos = false
    this.loading = () => $ionicLoading.show({ content: 'Getting current location...', showBackdrop: true });
    this.loaded = () => $ionicLoading.hide();
    ;

    this.getGeo = () => {
        let q = $q.defer();
        
        if(this.pos) q.resolve(this.pos);
        else this.setCurrent().then(res => q.resolve(res.coords));
        
        return q.promise;
    }

    this.setCurrent = () => {
        let q = $q.defer();

        this.loading();

        navigator.geolocation.getCurrentPosition(pos => {
            this.pos = pos;
            $state.go('map');
            this.loaded();
            q.resolve(this.pos);
        }, error => {
            this.loaded();
            alert('Unable to get location: ' + error.message);
            q.reject(error);
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
