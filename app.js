angular.module('myApp', ['ngMaterial','md.data.table','indexedDB','ng-currency'])

.config(($indexedDBProvider) => {

  $indexedDBProvider
    .connection('myIndexedDB')
    .upgradeDatabase(1, (event, db, tx) => {

      if(!db.objectStoreNames.contains('factures'))
      {
         db.createObjectStore('factures', {keyPath: 'id', autoIncrement: true});
      }

      if(!db.objectStoreNames.contains('postes'))
      {
         db.createObjectStore('postes', {keyPath: 'id', autoIncrement: true});
      }

    });
})

.controller('MainCtrl', ['$scope', '$indexedDB', ($scope, $indexedDB) => {

  $scope.$on('ItemEditedEvent', (evt, args) => {
    $scope.facturesComponent = 'form';
  });

  $scope.editedItem = {};
  $scope.facturesComponent = 'table';

  // var theData = [{"montant":"12","date":"2017-10-06T22:00:00.000Z","description":"amine","id":0},{"montant":"200","date":"2017-10-08T22:00:00.000Z","description":"amine","id":1},{"montant":"4500","date":"2017-10-06T22:00:00.000Z","description":"amine","id":2},{"montant":"23","date":"2017-10-02T22:00:00.000Z","description":"amine","id":3},{"montant":"343","date":"2017-10-23T22:00:00.000Z","description":"amine","id":4},{"montant":"567","date":"2017-10-02T22:00:00.000Z","description":"amine","id":5},{"montant":"34556","date":"2017-10-09T22:00:00.000Z","description":"amine","id":6},{"montant":"353","date":"2017-10-01T22:00:00.000Z","description":"amine","id":7},{"montant":"34534","date":"2017-10-15T22:00:00.000Z","description":"amine","id":8},{"montant":"455","date":"2017-10-14T22:00:00.000Z","description":"amine","id":9},{"montant":"456","date":"2017-10-07T22:00:00.000Z","description":"amine","id":10}];

  $indexedDB.openStore('factures', (store) => {

    // store.upsert(theData).then((e) => {
    //   console.log('store OK');
    // });

    store.getAll().then((facturesItems) => {
      $scope.listFactures = facturesItems;
    });

  });

}]);
