var app = angular.module('ifixvt', ['angularFileUpload']);

app.directive('fileButton', function() {
    return {
        link: function(scope, element, attributes) {

            var el = angular.element(element);

            el.css({
                position: 'relative',
                overflow: 'hidden'
//                width: attributes.width,
//                height: attributes.height
            });

            var fileInput = angular.element('<input type="file" onchange="angular.element(this).scope().onFileSelect(this)" capture="camera" />');
            fileInput.css({
                position: 'absolute',
                top: 0,
                left: 0,
                'z-index': '2',
                width: '100%',
                height: '100%',
                opacity: '0',
                cursor: 'pointer'
            });

            el.append(fileInput);
        }
    }
});

app.service("IssueService", function() {
    var that = this;
    that.issueTypeMap = {};
    $.get('/issue/issueTypeMap', function(data) {
        that.issueTypeMap = angular.fromJson(data);
        issueTypeMap = angular.fromJson(data);
    });
    this.getIssueTypeMap = function() {
        return that.issueTypeMap;
    }
});

app.filter('getTypeName', ['IssueService', function(IssueService) {
    return function(id) {
        return IssueService.getIssueTypeMap()[id].description;
    };
}]);

app.directive('changeActive', function() {
    return function (scope, element, attrs) {
        angular.element(element).find('a').on('click', function() {
            angular.element(element).find('a').removeClass('active');
            $(this).addClass('active');
        });
    }
});

app.controller('FixItController', ['$scope', 'IssueService', function($scope, IssueService) {
    $scope.pageLoading = false;
    $scope.town = '';
    $scope.currenttype = '';
    $scope.reportType = 'all';
    $scope.allIssueTableHead = {

    };
    $scope.issues = [];
    $scope.issuesByTown = [];
    $scope.issuesByType = [];

    $scope.setType = function(type) {
        $scope.reportType = type;
    };

    $scope.onTownChange = function($town) {
        setTimeout(function(){
            $scope.$apply(function() {
                $scope.town = angular.element("#town").val();
                $.get('/report/issueByTown/'+angular.element("#town").val(), function(data) {
                    $scope.$apply(function() {
                        $scope.issuesByTown = angular.fromJson(data).slice(0, 14);
                    });
                });
            });
        },10);
    };

    $scope.onIssueTypeChange = function($issuetype) {
        setTimeout(function(){
            $scope.$apply(function() {
                $scope.currenttype = angular.element("#issuetype").val();
                $.get('/report/issueByType/'+angular.element("#issuetype").val(), function(data) {
                    $scope.$apply(function() {
                        $scope.issuesByType = angular.fromJson(data).slice(0, 14);
                    });
                });
            });
        },10);
    };

    $scope.showStats = function() {
        $.get('/report/basic', function(data) {
            $scope.$apply(function() {
                $scope.issues = angular.fromJson(data).slice(0, 14);
                setTimeout(function() {
                    angular.element('#stats-modal').modal('show');
                }, 0);
            });
        });
    };

    $scope.goToIssue = function(issue) {
//        $scope.pageLoading = false;
//        angular.element('#stats-modal').modal('hide');
        $('.ui.dimmer').trigger('click');
        setTimeout(function(){
            map.setCenter(new google.maps.LatLng(issue.latitude, issue.longitude));
            map.setZoom(15);
//            openMarkerById(issue.id);
        },100);
    };

    $scope.closeModal = function() {
        angular.element('#stats-modal').modal('close');
    }
}]);

app.controller('AddIssueController', ['$scope', '$http', function($scope, $http) {
    $scope.locationSet = false;
    $scope.coords = {};
    $scope.imageData = '';
    $scope.type = '';
    $scope.filedata = '';

    $scope.setLocation = function() {
        navigator.geolocation.getCurrentPosition(function(pos) {
            $scope.$apply(function(){
                $scope.coords.lat = pos.coords.latitude;
                $scope.coords.long = pos.coords.longitude;
                $scope.locationSet = true;
            });
        });
    };

    // On page load
//    $scope.setLocation();

    $scope.onFileSelect = function($files) {
        var file = $files.files[0];
        canvasResize(file, {
            width:  0,
            height: 300,
            crop: false,
            quality: 80,
            //rotate: 90,
            callback: function(data, width, height) {
                $scope.$apply(function() {
                    $scope.imageData = data;
                });
            }
        });
    };

    $scope.saveIssue = function() {
        $.ajax({
            url: '/issue/save',
            data: {
                lat: $scope.coords.lat,
                long: $scope.coords.long,
                picture: $scope.imageData,
                type: angular.element("#type").val()
            },
            type: 'post'
        }).done(function(data) {
            // file is uploaded successfully
            $('#save-success').modal('show');
        });
    };
}]);

$(function(){
    $('.ui.dropdown').dropdown({action: 'updateForm'});

    $('#report-issue-btn').on('click',function() {
        $('#add-issue-modal')
            .modal('setting', 'transition', 'vertical flip')
            .modal('show')
        ;
    });

    $('#view-plain-issue-data').on('click',function() {
        changeView(views.BASIC);
    });

    $('#view-issue-count-heat-map').on('click',function() {
        changeView(views.HEAT_ISSUE_COUNT);
    });

    $('#view-issue-by-town-heat-map').on('click',function() {
        changeView(views.HEAT_ISSUE_BY_TOWN);
    });

    $('#view-issue-by-town-density-heat-map').on('click',function() {
        changeView(views.HEAT_ISSUE_BY_TOWN_DENSITY);
    });


});