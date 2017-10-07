'use strict';

angular.module('myApp')
.component('addFacture', {
  templateUrl: 'components/addFacture/view.html',
  controller: ['$scope', '$q', '$indexedDB', ($scope, $q, $indexedDB) => {

    var ctrl = this;

    var Ctrl = {
      addItem: addItem,
      cancelEdition: cancelEdition,
      createNew: createNew
    }

    $scope.$on('ItemEditedEvent', function(evt, args){
      Ctrl.editedItem = args.data;
    });

    function addItem()
    {
      var theData = this.editedItem;
      var ctrl = this;
      $indexedDB.openStore('factures', (store) => {
        store.upsert(theData).then((e) => {
          theData['id'] = e[0];
          var idx = _.findIndex(ctrl.listFactures, { 'id': e[0] })
          ctrl.listFactures.splice((idx == -1) ? ctrl.listFactures.length : idx, (idx == -1) ? 0 : 1, theData);
          ctrl.editedItem = {};
        });
      });

    };

    function cancelEdition()
    {
      this.facturesComponent = 'table';
      this.editedItem = {};
    };

    function createNew(event)
    {
      this.editedItem = {};
    };

    // this.cancel = $mdDialog.cancel;
    //
    // function success(dessert) {
    //   $mdDialog.hide(dessert);
    // }

  /*  this.addItem = function () {
      $scope.item.form.$setSubmitted();

      if($scope.item.form.$valid) {
        $nutrition.desserts.save({dessert: $scope.dessert}, success);
      }
    };*/
    return Ctrl;

  }],
  bindings: {
    facturesComponent: '=',
    listFactures: '=',
    editedItem: '='
  }
});
