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

    // On page load
    $scope.setLocation();

    $scope.onFileSelect = function($files) {
        //$files: an array of files selected, each file has name, size, and type.
        var FR= new FileReader();
        FR.onload = function(e) {
            $scope.$apply(function() {
                $scope.imageData = e.target.result;
                console.log($scope.imageData);
            });
        };
        FR.readAsDataURL($files.files[0]);
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
//        console.log($scope.type);
        $http.post('/save', {
            lat: $scope.coords.lat,
            long: $scope.coords.long,
            picture: $scope.imageData,
            type: angular.element("#type").val()
        }).success(function(data, status, headers, config) {
        // file is uploaded successfully
        console.log(data);
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
        activateButton(this);
        changeView(views.BASIC);
    });

    $('#view-issue-count-heat-map').on('click',function() {
        activateButton(this);
        changeView(views.HEAT_ISSUE_COUNT);
    });

    $('#view-issue-by-town-heat-map').on('click',function() {
        activateButton(this);
        changeView(views.HEAT_ISSUE_BY_TOWN);
    });

    $('#view-issue-by-town-density-heat-map').on('click',function() {
        activateButton(this);
        changeView(views.HEAT_ISSUE_BY_TOWN_DENSITY);
    });


});