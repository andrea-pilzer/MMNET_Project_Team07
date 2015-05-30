angular.module('appMaps', ['uiGmapgoogle-maps'])
    .controller('mainCtrl', function($scope, $http) {
    
        $scope.segnalazioni = [];
    
        $http.get('https://dev.smartcommunitylab.it/riciclo/notifications/TRENTO').
            success(function(data, status, headers, config) {
                createMarkers(data);
        }).
            error(function(data, status, headers, config) {
                console.log('error');
        });
        
        $scope.markers = [];
    
        $scope.marker_visible = {
            carta: true,
            imballaggi: true,
            residuo: true,
            potature: true,
            vetro: true,
            umido: true,
            all: true
        };
    
        var createMarkers = function(data) {
            
            var i = 0;
            for (var key in data) {
                var temp = [];
                var segnalazione = data[key];
                
                if (segnalazione.position != null) {
                    
                    var check = false;
                    var iconName = '';
                    var typeName = '';
                    if (segnalazione.message == 'Carta e cartone') {
                        iconName = 'img/yellow_MarkerC.png';
                        typeName = 'carta';
                        check = true;
                    } else if (segnalazione.message == 'Imballaggi leggeri') {
                        iconName = 'img/paleblue_MarkerI.png';
                        typeName = 'imballaggi';
                        check = true;
                    } else if (segnalazione.message == 'Rifiuto residuo') {
                        iconName = 'img/gray_MarkerR.png';
                        typeName = 'residuo';
                        check = true;
                    } else if (segnalazione.message == 'Sfalci e potature') {
                        iconName = 'img/pink_MarkerS.png';
                        typeName = 'potature';
                        check = true;
                    } else if (segnalazione.message == 'Vetro') {
                        iconName = 'img/darkgreen_MarkerV.png';
                        typeName = 'vetro';
                        check = true;
                    } else if (segnalazione.message == 'Umido - organico') {
                        iconName = 'img/brown_MarkerU.png';
                        typeName = 'umido';
                        check = true;
                    } 
                    temp = {
                        title: 'm'+i,
                        id: i,
                        text: typeName,
                        latitude: segnalazione.position[0],
                        longitude: segnalazione.position[1],
                        icon: iconName,
                        markerOptions: {
                            visible: true
                        }
                    }
                    i++;
                    if (check) {
                        $scope.markers.push(temp);
                    }
                }
            }   
        }
        
        $scope.pushChange = function(tipo) {
            for (var key in $scope.markers) {
                
                if (tipo == 'all') {
                    $scope.markers[key].markerOptions.visible = $scope.marker_visible.all;
                    for (var m in $scope.marker_visible) {
                        $scope.marker_visible[m] = $scope.marker_visible.all;
                    }
                
                } else if ($scope.markers[key].text == tipo) {
                    $scope.markers[key].markerOptions.visible = $scope.marker_visible[tipo];
                }
            }
        }
        
        $scope.map = {center: {latitude: 46.066667, longitude: 11.116667 }, zoom: 13 };
        $scope.options = {scrollwheel: true};
    
        $scope.marker = {
            id: 0,
            coords: {
                latitude: 46.066676,
                longitude: 11.116667
            },
            options: { draggable: false },
            icon: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png'
        };
})
