'use strict';

angular.module('myApp')
.component('tabsOverview', {
  templateUrl: 'components/tabsOverview/view.html',
  controller: ['$scope', function ($scope) {

  }],
  bindings: {
    listFactures: '='
  }
});
