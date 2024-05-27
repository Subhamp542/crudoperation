angular.module('myApp', [])
    .controller('MainController', function($scope) {
        // Initialize variables
        $scope.currentPage = 1;
        $scope.pageSize = 10;

        // Function to get total number of pages
        $scope.numPages = function() {
            return Math.ceil($scope.products.length / $scope.pageSize);
        };

        // Function to go to the previous page
        $scope.prevPage = function() {
            $scope.currentPage--;
        };

        // Function to go to the next page
        $scope.nextPage = function() {
            $scope.currentPage++;
        };

        // Function to show only the products for the current page
        $scope.filteredProducts = function() {
            var begin = (($scope.currentPage - 1) * $scope.pageSize);
            var end = begin + $scope.pageSize;
            return $scope.products.slice(begin, end);
        };

        // Other functions...
    });
