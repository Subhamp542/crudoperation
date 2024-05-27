var app = angular.module('myApp', [])
    .service('ProductService', function($http) {
        var baseUrl = 'https://localhost:7260/api'; 
        
        this.getProducts = function() {
            return $http.get(baseUrl + '/Products/GetProducts');
        };
        
        this.UpsertProduct = function(productDto) {
            console.log("productsss:", productDto);

            return $http({
                method: 'POST',
                url: baseUrl + '/Products/PostProducts',
                data: productDto,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .catch(function(error) {
                    console.log("Error adding product:", error);
                    throw error;
                });
        };


        this.deleteProduct = function(id) {
            return $http.delete(baseUrl + '/Products/' + id)
                .catch(function(error) {
                    console.log("Error deleting product:", error);
                    throw error;
                });
        };

        this.getProductById = function(Id) {
            return $http.get(baseUrl + '/Products/' + Id)


              .catch(function(error) {
                console.log("Error editing product:", error);
                throw error;
              });
          };
    })
        this.submitProduct = function(){
            return $http.put(baseUrl + '/Products/PostProducts')
            .catch(function(error){
                console.log("Error submitting productsss:", error);
            })
        }




        app.controller('MainController', function($scope, ProductService, $filter) {
            $scope.products = []; // Array to store products
            $scope.newProduct = {}; // Object to store new product data
            $scope.showPopup = false; // Boolean to control popup visibility
            $scope.editMode = false; // Boolean to control edit mode
        
            $scope.currentPage = 1;
            $scope.pageSize = 5;
            $scope.pages = [];
        
            // Load products from the server
            ProductService.getProducts()
                .then(function(response) {
                    $scope.products = response.data;
                    console.log("Products loaded:", response.data);
                    $scope.updatePages();
                })
                .catch(function(error) {
                    console.log("Error loading products:", error);
                });
        
            $scope.updatePages = function() {
                $scope.pages = [];
                for (var i = 1; i <= Math.ceil($scope.products.length / $scope.pageSize); i++) {
                    $scope.pages.push(i);
                }
            };
        
            $scope.setPage = function(page) {
                if (page >= 1 && page <= $scope.pages.length) {
                    $scope.currentPage = page;
                }
            };
        
            $scope.prevPage = function() {
                if ($scope.currentPage > 1) {
                    $scope.currentPage--;
                }
            };
        
            $scope.nextPage = function() {
                if ($scope.currentPage < $scope.pages.length) {
                    $scope.currentPage++;
                }
            };
        
            $scope.paginatedProducts = function() {
                var start = ($scope.currentPage - 1) * $scope.pageSize;
                var end = start + $scope.pageSize;
                return $scope.products.slice(start, end);
            };
        
            // Function to open the popup for editing a product
            $scope.editProduct = function(Id) {
                console.log("editing product:", Id);
                ProductService.getProductById(Id)
                    .then(function(response) {
                        console.log("editing product:", response);
                        $scope.newProduct = angular.copy(response.data); // Set the product for editing
                        $scope.showPopup = true; // Open the popup
                        $scope.editMode = true; // Set edit mode
                    })
                    .catch(function(error) {
                        console.log("Error editing product:", error);
                    });
            };
        
            // Function to delete a product
            $scope.deleteProduct = function(product) {
                ProductService.deleteProduct(product.id)
                    .then(function() {
                        var index = $scope.products.findIndex(p => p.id === product.id);
                        if (index !== -1) {
                            $scope.products.splice(index, 1); // Remove the product from the array
                            console.log("Deleted product:", product);
                            $scope.updatePages(); // Update pagination after deletion
                        }
                    })
                    .catch(function(error) {
                        console.log("Error deleting product:", error);
                    });
            };
        
            // Function to open the popup for adding a new product
            $scope.openPopup = function() {
                $scope.newProduct = {}; // Reset new product data
                $scope.showPopup = true; // Open the popup
                $scope.editMode = false; // Set add mode
            };
        
            // Function to close the popup
            $scope.closePopup = function() {
                $scope.showPopup = false;
            };
        
            $scope.addProduct = function() {
                $scope.openPopup();
            };
        
            $scope.submitProduct = function() {
                if (!$scope.newProduct.createdAt) {
                    $scope.newProduct.createdAt = new Date();
                }
                ProductService.UpsertProduct($scope.newProduct)
                    .then(function(response) {
                        console.log("Product added/updated successfully", response);
                        $scope.showPopup = false; // Close the popup after adding/updating the product
                        ProductService.getProducts()
                            .then(function(response) {
                                $scope.products = response.data;
                                console.log("Products loaded:", response.data);
                                $scope.updatePages(); // Update pagination after loading products
                            })
                            .catch(function(error) {
                                console.log("Error loading products:", error);
                            });
                    })
                    .catch(function(error) {
                        console.log("Error adding/updating product:", error);
                    });
            };
        
            // Function to arrange the new or edited product
            $scope.sortOrder = {}; // Object to store the current sort order of each property
        
            $scope.arrange = function(property) {
                if ($scope.sortOrder[property] === undefined) {
                    $scope.sortOrder[property] = 1; // Default to ascending order
                } else {
                    $scope.sortOrder[property] = -$scope.sortOrder[property]; // Toggle the order
                }
        
                const order = $scope.sortOrder[property];
        
                $scope.products.sort(function(a, b) {
                    if (a[property] < b[property]) {
                        return -1 * order;
                    } else if (a[property] > b[property]) {
                        return 1 * order;
                    } else {
                        return 0;
                    }
                });
            };
        
            // Searching method
            $scope.search = function() {
                if ($scope.searchQuery === '') {
                    $scope.products = angular.copy($scope.originalProducts);
                } else {
                    $scope.products = $scope.products.filter(function(product) {
                        return product.name.toLowerCase().includes($scope.searchQuery.toLowerCase()) ||
                            product.brand.toLowerCase().includes($scope.searchQuery.toLowerCase()) ||
                            product.category.toLowerCase().includes($scope.searchQuery.toLowerCase()) ||
                            product.price.toString().toLowerCase().includes($scope.searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes($scope.searchQuery.toLowerCase()) ||
                            product.createdAt.toLowerCase().includes($scope.searchQuery.toLowerCase());
                    });
                }
                $scope.updatePages(); // Update pages after search
            };
        
            $scope.originalProducts = angular.copy($scope.products);
        });
        