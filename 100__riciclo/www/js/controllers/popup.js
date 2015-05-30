angular.module('rifiuti.controllers.popup',['ionic'])

.controller('PopupCtrl',function($rootScope, $scope, $ionicPopup, $timeout, $http, $cordovaToast) {

    $scope.pushNotificationChange = function() {
        console.log('Push Notification Change', $scope.pushNotification.checked);
        localStorage.setItem('hidePopUp', $scope.pushNotification.checked);
    };
    
    if(localStorage.getItem('hidePopUp') == null) {
        localStorage.setItem('hidePopUp', 'false');
    }
    
    $scope.pushNotification = { 
        checked: localStorage.getItem('hidePopUp')
    };
    
    $scope.showPopup = function(tipo) {
        
        $scope.pushNotification = { checked: localStorage.getItem('hidePopUp') };
        $scope.data = {}

        if($scope.pushNotification.checked == 'false') {

            var myPopup = $ionicPopup.show({

                templateUrl : 'popup-template.html',
                title: 'Invio notifica raccolta: '+tipo,
                subTitle: '<p>Selezionare per inviare direttamente la segnalazione senza confermare ogni volta</p>',
                scope: $scope,
                buttons: [
                    { text: 'Annulla',
                        onTap: function(e) {
                            return false
                        }
                    },
                    { text: '<b>Ok</b>',
                        type: 'button-100r',
                        onTap: function(e) {
                            return true
                        }
                    }
                ]

            });

            myPopup.then(function(res) {

                if(res) {
                    var requestData = {
                        "message": tipo,
                        "position": $rootScope.myPosition
                    }

                $http.post('https://dev.smartcommunitylab.it/riciclo/notifications/TRENTO',
                               requestData)
                                .success(function(responseData) {
                                    console.log(responseData);
                                    $cordovaToast.show('Notifica '+tipo+' inviata con successo!','short','bottom');

                                }).error(function(err) {
                                    console.log(err)
                                    $cordovaToast.show('Invio Notifica '+tipo+' NON riuscito!','short','center');
                                })
                    console.log('Post: '+tipo);
               } else {
                 console.log('Post cancelled');
               }
            });
        }
        else {
            console.log('Post: '+tipo);
            var requestData = {
                "message": tipo,
                "position": $rootScope.myPosition
            }

            $http.post('https://dev.smartcommunitylab.it/riciclo/notifications/TRENTO',
                                   requestData)
                                .success(function(responseData) {
                                    console.log(responseData);
                                    $cordovaToast.show('Notifica '+tipo+' inviata con successo!','short','bottom');

                                }).error(function(err) {
                                    console.log(err)
                                    $cordovaToast.show('Invio Notifica '+tipo+' NON riuscito!','short','center');
                                })
        }
    }
})

