'use strict';

angular.module('myApp')
.component('repartLot', {
  templateUrl: 'components/repartLot/view.html',
  controller: ['$scope', '$q', '$rootScope', '$indexedDB', function ($scope, $q, $rootScope, $indexedDB) {

    var ctrl = {
      parlots: []
    };

    function updateDate()
    {
      $indexedDB.openStore('factures', (store) => {

        store.getAll().then((factures) => {

          ctrl.parlots = _(factures)
                          .flatMap((n) => {return n.lots;})
                          .groupBy('lot')
                          .map((objs, key) => ({
                              'lot': key,
                              'montant': _.sumBy(objs, 'montant') }))
                          .value();
        });
      });
    };

    updateDate();

    $scope.$on('DBMaj', function(evt, args){
      updateDate();
    });

    return ctrl;

  }],
  bindings: {
  }
});
