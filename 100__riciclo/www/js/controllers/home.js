angular.module('rifiuti.controllers.home', [])

.controller('HomeCtrl', function ($scope, $rootScope, $ionicSideMenuDelegate, DataManager, $ionicLoading, $ionicScrollDelegate, Conf) {
   // $rootScope.noteSelected = false;
    $scope.showNews = Conf.showNews;

    $scope.height = window.innerHeight;
    $scope.width = window.innerWidth;

    $scope.rifiuti = [];
    $scope.f = [];
    $scope.listaRifiuti = [];

    DataManager.get('data/db/riciclabolario.json').then(function (results) {
        $scope.listaRifiuti = results.data;
    });

    DataManager.get('data/db/tipologiaRifiuto.json').then(function (results) {
        for (var i = 0; i < results.data.length; i++) {
            results.data[i].valore = results.data[i].nome.substr(0, 1) + results.data[i].nome.substr(1).toLowerCase();
        }
        $scope.rifiuti = results.data;
        DataManager.get('data/support/tipologiaRifiutoImmagini.json').then(function (results) {
            var tdri = results.data;
            for (var i = 0; i < $scope.rifiuti.length; i++) {
                for (var j = 0; j < tdri.length; j++) {
                    if ($scope.rifiuti[i].valore == tdri[j].valore) {
                        $scope.rifiuti[i].immagine = tdri[j].immagine;
                    }
                }
            }
            $scope.f = $scope.oneInThree($scope.rifiuti);
        });
    });

    $scope.titleText = function () {
//        if (!$rootScope.noteSelected) {
            return APP_NAME;
//        } else {
//            return '';
//        }
    };

    $scope.subTitleText = function () {
//        if (!$rootScope.noteSelected) {
            return ($scope.selectedProfile ? $scope.selectedProfile.name : '');
//        } else {
//            return '';
//        }
    };

    $scope.leftClick = function () {
//        if (!$rootScope.noteSelected) {
            $ionicSideMenuDelegate.toggleLeft();
//        } else {
//            $rootScope.noteSelected = false;
//        }
    };

    $scope.oneInThree = function (v) {
        var f = [];
        for (var i = 0; i < v.length; i = i + 3) {
            f[i / 3] = v[i];
        }
        return f;
    };

    $scope.reset = function () {
        alert("Resetting!");
        localStorage.clear();
    };

    $rootScope.showTutorial = false;
    var stringTutorial = localStorage.getItem("tutorial");

    if (stringTutorial == "false" || !!$rootScope.promptedToProfile) {
        $rootScope.showTutorial = false;
    } else {
        $rootScope.showTutorial = true;
    }

    $scope.stopTutorial = function () {
        localStorage.setItem("tutorial", "false");
    };

    $scope.show = function () {
        if (!!!$rootScope.showTutorial) {
            return;
        }
        $ionicScrollDelegate.scrollTop();
        $ionicLoading.show({
            templateUrl: 'templates/tutorial.html',
        });
        $rootScope.showTutorial = false;
        $scope.stopTutorial();
    };

    $rootScope.$watch('showTutorial', function (newValue, oldValue) {
        if (!!newValue) {
            $scope.show();
        }
    });
})

.controller('noteCtrl', function ($scope, $rootScope, $ionicPopup, $filter, Profili) {
    $scope.noteSelected = false;

    $scope.variableIMG = "img/ic_add.png";
    var updateIMG = function () {
        $scope.variableIMG = !$scope.noteSelected ? "img/ic_add.png" : "img/ic_menu_delete.png";
    };

    $rootScope.$watch('noteSelected', function () {
        if (!$scope.noteSelected) {
            $scope.selectedNotes = [];
            $scope.multipleNoteSelected = false;
        }
        updateIMG();
    });

    var init = function () {
        $scope.notes = Profili.getNotes();
        $scope.selectedNotes = [];
        $scope.multipleNoteSelected = false;
    };

    $rootScope.$watch('selectedProfile', function (a, b) {
        if (b == null || a.id != b.id) {
            init();
        }
    });

    init();

    $scope.addNote = function (nota) {
        $scope.notes = Profili.addNote(nota);
    };

    $scope.removeNotes = function (idx) {
        $ionicPopup.show(popupDelete()).then(function (res) {
            if (res) {
                $scope.notes = Profili.deleteNotes(idx);
                $scope.selectedNotes = [];
                $scope.multipleNoteSelected = false;
                $scope.noteSelected = false;
                updateIMG();
            }
        });
    };

    $scope.noteSelect = function (idx) {
        var p = $scope.selectedNotes.indexOf(idx);
        if (p == -1) {
            $scope.selectedNotes.push(idx);
            $scope.noteSelected = true;
            if ($scope.selectedNotes.length > 1) $scope.multipleNoteSelected = true;
        } else {
            $scope.selectedNotes.splice(p, 1);
            if ($scope.selectedNotes.length <= 1) {
                $scope.multipleNoteSelected = false;
                if ($scope.selectedNotes.length < 1) $scope.noteSelected = false;
            }
        }
        updateIMG();
    };

    var popupDelete = function () {
        return {
            template: "Confermi l'eleminazione della nota?",
            title: 'Avviso',
            scope: $scope,
            buttons: [
                {
                    text: 'Cancel'
                },
                {
                    text: 'Conferma',
                    onTap: function (e) {
                        return true;
                    }
          }
        ]
        }
    };
    var popupCreate = function () {
        return {
            template: '<input type="text" ng-model="data.nota">',
            title: $filter('translate')('what_remember'),
            scope: $scope,
            buttons: [
                {
                    text: $filter('translate')('cancel')
              },
                {
                    text: '<b>' + $filter('translate')('save') + '</b>',
                    type: 'button-100r',
                    onTap: function (e) {
                        if (!$scope.data.nota) {
                            return null;
                        } else {
                            return $scope.data.nota;
                        }
                    }
              }
          ]
        };
    };
    $scope.click = function () {
        if ($scope.noteSelected) {
            $scope.removeNotes($scope.selectedNotes);
        } else {
            $scope.data = {};
            $ionicPopup.show(popupCreate()).then(function (res) {
                if (res != null && res != undefined) {
                    $scope.addNote(res);
                }
            });
        }
    };

    $scope.edit = function () {
        $scope.data = {
            'nota': $scope.notes[$scope.selectedNotes[0]],
            idx: $scope.selectedNotes[0]
        };

        var popup = $ionicPopup.show(popupCreate()).then(function (res) {
            if (res != null && res != undefined) {
                $scope.notes = Profili.updateNote($scope.data.idx, res);
                $scope.selectedNotes = [];
                $scope.multipleNoteSelected = false;
                $scope.noteSelected = false;
            }
        });
    };
})

.controller('newsCtrl', function($scope, $rootScope) {
    
})

.controller('calendarioCtrl', function ($scope, $rootScope, $ionicScrollDelegate, $location, Calendar, Utili, $timeout, $filter, $document) {
    $scope.calendarView = false;

	$location.hash = function(val) {
		if (!!val) {
			window._globalscrollid = val;
		}
		return window._globalscrollid;
	};

    $scope.noteSelected = false;

    $scope.switchView = function () {
        $scope.calendarView = !$scope.calendarView;
        $scope.updateIMG2();
        $ionicScrollDelegate.scrollTop();
    }

    $scope.selectDay = function (i) {
        if (i.colors.length == 0) return;
        $scope.currListItem = i;
        $scope.showDate = i.date;
        $scope.daySubList = Calendar.toWeek($scope.dayList, $scope.showDate, $scope.daySubListRunningEnd);

        $timeout(function () {
            $location.hash('id' + i.date.getTime());
            //window._globalscrollid = 'id' + i.date.getTime();
            $ionicScrollDelegate.anchorScroll(true);
        }, 200);

        $scope.calendarView = !$scope.calendarView;
        $scope.updateIMG2();
    }

    $scope.variableIMG2 = "img/listView.png";

    $scope.updateIMG2 = function () {
        $scope.variableIMG2 = $scope.calendarView ? "img/tableView.png" : "img/listView.png";
    };

    $scope.firstDayIndex = function (week) {
        return Utili.DOWTextToDOW(week[0].day);
    };

    $scope.lastDayIndex = function (week) {
        return Utili.DOWTextToDOW(week[week.length - 1].day);
    };

    $scope.getEmptyArrayByLength = function (length) {
        var array = [];
        if (length > 100) length = 100;
        for (var i = 0; i < length; i++) {
            array.push(i - 1);
        }
        return array;
    };

    var scrollToday = function () {
        // TODO
        //return;

        if ($scope.calendarView == true) {
            var time = 0;
            var i = 0;
            while (i < $scope.dayList.length && time < $scope.currDate.getTime()) {
                time = $scope.dayList[i++].date.getTime();
            }
            if (i - 2 >= 0 && i - 2 <= $scope.dayList.length) {
                $location.hash('id' + $scope.dayList[i - 2].date.getTime());
                $scope.currListItem = $scope.dayList[i - 2];
                //window._globalscrollid = 'id' + $scope.currListItem.date.getTime();
                $ionicScrollDelegate.anchorScroll(true);
            } else {
                $ionicScrollDelegate.scrollTop();
            }
        }
    };

    var buildMonthData = function (gotoday) {
        if (!$scope.month || $scope.month.name != Utili.monthYear($scope.showDate.getMonth(), $scope.showDate.getFullYear())) {
            $scope.loaded = false;
            Calendar.fillWeeks($scope.showDate, $rootScope.selectedProfile.utenza.tipologiaUtenza, $rootScope.selectedProfile.aree).then(function (data) {
                $scope.month = {
                    name: Utili.monthYear($scope.showDate.getMonth(), $scope.showDate.getFullYear()),
                    weeks: data
                };
                $scope.dayList = Calendar.toListData($scope.month.weeks);
                $scope.daySubListRunningEnd = null;
                $scope.daySubList = Calendar.toWeek($scope.dayList, $scope.showDate, $scope.daySubListRunningEnd);

                $scope.loaded = true;
                if (gotoday) {
                    $timeout(scrollToday, 200);
                }
            });
        } else {
            $scope.daySubList = Calendar.toWeek($scope.dayList, $scope.showDate, $scope.daySubListRunningEnd);
            if (gotoday) {
                scrollToday();
            }
        }
    };

    var init = function () {
        $scope.month = {};
        $scope.calendarView = false;
        $scope.loaded = false;
        $scope.currDate = new Date();
        $scope.currListItem = null;
        $scope.daySubList = null;
        $scope.dayList = []; //$scope.getEmptyArrayByLength(Calendar.dayArrayHorizon($scope.currDate.getFullYear(),$scope.currDate.getMonth(), $scope.currDate.getDate()));
        $scope.showDate = new Date();
        $scope.daySubListRunningEnd = null;
        buildMonthData();
    }

    init();

    $rootScope.$watch('selectedProfile', function (a, b) {
        if (b == null || a.id != b.id) {
            init();
        }
    });

    $scope.fullDate = function (d) {
            return Utili.fullDateFormat(d, $filter('translate'));
        }
        /*$scope.$watch('month', function (a, b) {
            if (a != null && (b == null || a.name !== b.name || $scope.dayList.length == 0)) {
                $scope.dayList = Calendar.toListData($scope.month.weeks);
                $scope.dayListLastMonth = Utili.lastDateOfMonth($scope.showDate);
            }
        });*/

    $scope.loadMoreDays = function () {
        if ($scope.daySubListRunningEnd <= $scope.dayList.length) {
            $scope.daySubListRunningEnd += 7;
            $scope.daySubList = Calendar.toWeek($scope.dayList, $scope.showDate, $scope.daySubListRunningEnd);
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    $scope.getColor = function (colorString) {
        return Utili.getRGBColor(colorString);
    };

    $scope.getIcon = function (item) {
        return Utili.icon(item.tipologiaPuntiRaccolta, item.colore);
    }

    $scope.goToToday = function () {
        $scope.showDate = new Date();
        buildMonthData(true);
    };

    $scope.nextMonth = function () {
        $scope.showDate.setDate(1);
        $scope.showDate.setMonth($scope.showDate.getMonth() + 1);
        buildMonthData();
    };

    $scope.lastMonth = function () {
        $scope.showDate.setDate(1);
        $scope.showDate.setMonth($scope.showDate.getMonth() - 1);
        buildMonthData();
    };

})
