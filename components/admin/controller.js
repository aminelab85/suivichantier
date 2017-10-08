'use strict';

angular.module('myApp')
.component('admin', {
  templateUrl: 'components/admin/view.html',
  controller: ['$scope', '$rootScope', '$q', '$indexedDB', '$mdDialog', ($scope, $rootScope, $q, $indexedDB, $mdDialog) => {

    var ctrl = this;

    var Ctrl = {
      dropDb: dropDb
    }

    function dropDb(event)
    {

      var confirm = $mdDialog.confirm()
        .title('Voulez vous supprimer la base de données ?')
        // .textContent(ctrl.selected[0].description)
        .targetEvent(event)
        .ok('Oui')
        .cancel('Non');

      $mdDialog.show(confirm).then(
        () => {
          $indexedDB.deleteDatabase('myIndexedDB');
        },
        () => {}
      );
    };
    return Ctrl;

  }],
  bindings: {
  }
});
