var app = angular.module('ifixvt', ['angularFileUpload']);

app.controller('AddIssueController', ['$scope', '$http', function($scope, $http) {
    $scope.locationSet = false;
    $scope.coords = {
        lat: 0,
        long: 0
    };
    $scope.imageData = '';
    $scope.type = '';

    $scope.setLocation = function() {
        navigator.geolocation.getCurrentPosition(function(pos) {
            $scope.$apply(function(){
                $scope.coords.lat = pos.coords.latitude;
                $scope.coords.long = pos.coords.longitude;
                $scope.locationSet = true;
            });
        });
    };

    $scope.onFileSelect = function($files) {
        //$files: an array of files selected, each file has name, size, and type.
        console.log($files[0]);
        var FR= new FileReader();
        FR.onload = function(e) {
            $scope.$apply(function() {
                $scope.imageData = e.target.result;
            });
        };
        FR.readAsDataURL($files[0]);
//        for (var i = 0; i < $files.length; i++) {
//            var $file = $files[i];
//            $http.uploadFile({
//                url: 'server/upload/url', //upload.php script, node.js route, or servlet upload url)
//                data: {myObj: $scope.myModelObj},
//                file: $file
//            }).then(function(data, status, headers, config) {
//                // file is uploaded successfully
//                console.log(data);
//            });
//        }
    };

    $scope.saveIssue = function() {
        $http.uploadFile({
            url: '/saveIssue', //upload.php script, node.js route, or servlet upload url)
            data: {
                lat: $scope.coords.lat,
                long: $scope.coords.long,
                picture: $scope.imageData,
                type: $scope.type
            }
        }).then(function(data, status, headers, config) {
            // file is uploaded successfully
            console.log(data);
        });
    };
}]);

$(function(){
    $('.ui.dropdown').dropdown();

    $('#report-issue-btn').on('click',function() {
        $('#add-issue-modal')
            .modal('setting', 'transition', 'vertical flip')
            .modal('show')
        ;
    });

    $('#view-plain-issue-data').on('click',function() {
        activateButton(this);
    });

    $('#view-issue-count-heat-map').on('click',function() {
        activateButton(this);
    });

    $('#view-issue-density-heat-map').on('click',function() {
        activateButton(this);
    });

});