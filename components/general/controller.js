'use strict';

angular.module('myApp')
.component('general', {
  templateUrl: 'components/general/view.html',
  controller: ['$scope', '$rootScope', '$q', '$indexedDB', ($scope, $rootScope, $q, $indexedDB) => {

    var ctrl = this;

    var Ctrl = {
      save: save,
      editedItem: {}
    }

    function save()
    {
      $indexedDB.openStore('general', (store) => {
        store.upsert(Ctrl.editedItem).then((e) => {
          Ctrl.editedItem['id'] = e[0];
        });
      });
    };

    $indexedDB.openStore('general', (store) => {
      store.getAll().then((generalItems) => {
        Ctrl.editedItem = generalItems[0];
      });
    });

    return Ctrl;

  }],
  bindings: {
  }
});
