export default [ 'mapService', /*@ngInject*/function($q, $state, $ionicLoading, $cordovaGeolocation, CacheFactory) {
    
    // Vars
    this.mapCache = CacheFactory('mapCache');
    this.oldPos = this.mapCache.get('pos') || false;
    this.pos = false;
    this.loading = () => $ionicLoading.show({ content: 'Getting current location...', showBackdrop: true });
    this.loaded = () => $ionicLoading.hide();

    // Functions
    this.getGeo = () => {
        let q = $q.defer();
        
        if(this.pos) q.resolve(this.pos);
        else this.setCurrent().then(res => q.resolve(res));
        
        return q.promise;
    }

    this.setCurrent = () => {
        let q = $q.defer();
        this.loading();

        $cordovaGeolocation
            .getCurrentPosition({timeout: 10000, enableHighAccuracy: false})
            .then(position => {
                this.setPos({latitude: position.coords.latitude, longitude: position.coords.longitude});
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
        let geocoder = new google.maps.Geocoder(),
            q = $q.defer();

        geocoder.geocode({ 'address': loc, 'partialmatch': true }, 
            (results, status) => {

                if (status == 'OK' && results.length > 0) {
                    this.setPos({latitude: results[0].geometry.location.G, longitude: results[0].geometry.location.K});
                    q.resolve(this.pos);
                }
                else  {
                    this.loaded();
                    alert("Geocode was not successful for the following reason: " + status);
                    q.reject(status);
                }
            }
        ); 

        return q.promise;

    }

    this.setPos = pos => {
        this.pos = pos;
        this.mapCache.put('pos', pos);
        this.loaded();
    }
 

}]


        // navigator.geolocation.getCurrentPosition(pos => {
        //     this.pos = pos.coords;
        //     this.loaded();
        //     q.resolve(this.pos);
        // }, error => {
        //     this.loaded();
        //     alert('Unable to get location: ' + error.message);
        //     q.reject(error);
        // });
