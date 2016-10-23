angular.module('exampleModule', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/albums', {
            templateUrl: 'albums.html'
        })
        .when('/details/:id', {
            templateUrl: 'tracks.html'
        })
        .otherwise({redirectTo: '/albums'});
    }])
    .service('MusicService', ['$http', function($http) {
		/****** Private Stuff  ***********************
    	 * (available only for the service instance)
    	 * 
    	 ***********************************/
    	
    	//Parse specific Spotify data, not important.
    	var parseAlbums = function(data) {
    		var items = data.albums.items;
    		var dataFiltered = [];
    		var currentAlbum;
    		for(var i=0; i < items.length; i++ ){
    			currentAlbum = {};
    			currentAlbum.name = items[i].name;
    			currentAlbum.image = items[i].images[1];
    			currentAlbum.id = items[i].id;
    			dataFiltered.push(currentAlbum);
    		}
    		
    		return dataFiltered;
    	}
    	
    	//Parse specific Spotify data, not important.
    	var parseTracks = function(data) {
    		var items = data.items;
    		var dataFiltered = [];
    		var currentTrack;
    		for(var i=0; i < items.length; i++ ){
    			currentTrack = {};
    			currentTrack.number = items[i]["track_number"];
    			currentTrack.name = items[i].name;
    			dataFiltered.push(currentTrack);
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
            	var albums = parseAlbums(response.data);
            	onSuccess(albums)
            }, function(errResponse){
                onError(errResponse.data);
            });
        };
        
        self.getTracks = function(albumId, onSuccess, onError) {
        	console.log('Fetching from spotify');
            var url = 'https://api.spotify.com/v1/albums/' + albumId + '/tracks';
            $http.get(url).then(function(response){
            	var tracks = parseTracks(response.data);
            	onSuccess(tracks)
            }, function(errResponse){
                onError(errResponse.data);
            });
        };
    }])
    .controller('AlbumsController', ['MusicService', "$location", function(MusicService, $location) {
		var self = this;
		
		self.albums = [];
		
		MusicService.getAlbums(function(albums) {
			self.albums = albums;
		}, function(errResponse) {
			alert("Ups, there was an error: " + JSON.stringify(errResponse, null, 4));
		});
		
		self.goDetails = function(id) {
            $location.path("/details/" + id);
        }
	}])
	.controller('TracksController', ['MusicService', '$routeParams', function(MusicService, $routeParams) {
		var self = this;
		self.albumId = $routeParams.id;
		
		self.tracks = [];
		
		MusicService.getTracks(self.albumId, function(tracks) {
			self.tracks = tracks;
		}, function(errResponse) {
			alert("Ups, there was an error: " + JSON.stringify(errResponse, null, 4));
		});
	}])