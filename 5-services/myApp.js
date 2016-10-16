angular.module('exampleModule', [])
	.service('MusicService', ['$http', function($http) {
		/****** Private Stuff  ***********************
    	 * (available only for the service instance)
    	 * 
    	 ***********************************/
    	
    	//Parse specific Spotify data, not important.
    	var parseData = function(data) {
    		var items = data.albums.items;
    		var dataFiltered = [];
    		var currentAlbum;
    		for(var i=0; i < items.length; i++ ){
    			currentAlbum = {};
    			currentAlbum.name = items[i].name;
    			currentAlbum.image = items[i].images[1];
    			currentAlbum.href = items[i].href;
    			dataFiltered.push(currentAlbum);
    		}
    		
    		return dataFiltered;
    	}
    	
    	/****** Public Stuff  ***********************
    	 * (available for controllers and other services)
    	 * 
    	 ***********************************/
    	var self = this;

        self.getAlbums = function(onSuccess, onError) {
        	console.log('Fetching from spotify');
            var url = 'https://api.spotify.com/v1/search?q=metallica&type=album&limit=5';
            $http.get(url).then(function(response){
            	albumsCache = parseData(response.data);
            	onSuccess(albumsCache)
            }, function(errResponse){
                onError(errResponse.data);
            });
        };
    }])
	.controller('MusicController', ['MusicService', function(MusicService) {
		var self = this;
		
		self.albums = [];
		
		MusicService.getAlbums(function(albums) {
			self.albums = albums;
		}, function(errResponse) {
			alert("Ups, there was an error: " + JSON.stringify(errResponse, null, 4));
		});
	}])