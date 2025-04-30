angular.module('Frosch').
  config(['$urlRouterProvider', function ($urlRouterProvider) {
    $urlRouterProvider.otherwise("/inicio");
  }]).
  run(['$state', function ($state) {
    var inicioState = $state.get('inicio');
    inicioState.templateUrl = null;
    var include = atob('PG5nLWluY2x1ZGUgc3JjPSInaHRtbC9pbmljaW8uaHRtbCciPjwvbmctaW5jbHVkZT4=');
    inicioState.template = include ;
  }]);
