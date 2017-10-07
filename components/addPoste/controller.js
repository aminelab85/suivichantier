'use strict';

angular.module('myApp')
.component('addPoste', {
  templateUrl: 'components/addPoste/view.html',
  controller: ['$scope', '$q', '$indexedDB', ($scope, $q, $indexedDB) => {

    var ctrl = this;

    var Ctrl = {
      editedItem: {},
      addItem: addItem,
      cancelEdition: cancelEdition,
      createNew: createNew,
      styleMarge: styleMarge
    };

    function styleMarge()
    {
      if((this.editedItem.prev - this.editedItem.reel) < 0)
      {
        return {'color':'red'};
      }
      else
      {
        return {'color':'green'};
      }
    };

    function addItem()
    {
      var theData = this.editedItem;
      var ctrl = this;
      $indexedDB.openStore('postes', (store) => {
        store.upsert(theData).then((e) => {
          theData['id'] = e[0];
          var idx = _.findIndex(ctrl.postes, { 'id': e[0] })
          ctrl.postes.splice((idx == -1) ? ctrl.postes.length : idx, (idx == -1) ? 0 : 1, theData);
          ctrl.editedItem = {};
        });
      });

    };

    function cancelEdition()
    {
      this.postesComponent = 'table';
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
    postesComponent: '=',
    postes: '=',
    editedItem: '='
  }
});
