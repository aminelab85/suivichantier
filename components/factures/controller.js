'use strict';

angular.module('myApp')
.component('facturesTable', {
  templateUrl: 'components/factures/view.html',
  controller: ['$scope', '$q', '$rootScope', '$mdDialog', '$indexedDB', function ($scope, $q, $rootScope, $mdDialog, $indexedDB) {

    return {
      selected : [],
      filter : {
        show:false,
        options: {
          debounce: 500
        }
      },
      delete: function(ev)
      {
        var ctrl = this;
        var confirm = $mdDialog.confirm()
          .title('Supprimer cette facture ?')
          .textContent(ctrl.selected[0].description)
          .targetEvent(ev)
          .ok('Oui')
          .cancel('Non');

        $mdDialog.show(confirm).then(
          () => {
            $indexedDB.openStore('factures', (store) => {
              store.delete(ctrl.selected[0].id).then((e) => {
                var idx = _.findIndex(ctrl.listFactures, { 'id': ctrl.selected[0].id })
                ctrl.listFactures.splice(idx, 1);
                ctrl.selected = [];
                $rootScope.$broadcast('DBMaj');
              });
            });
          },
          () => {}
        );
      },
      removeFilter : function ()
      {
        this.filter.show = false;
        this.filter.query = '';
      },
      query : {
       order: 'name',
       limit: 5,
       page: 1
     },
     editItem : function(event)
     {
       $rootScope.$broadcast('ItemEditedEvent', {data:angular.copy(this.selected[0])});
     },
     exitSelectionMode : function(event)
     {
       this.selected = [];
     },
     success : function(desserts)
     {
       $scope.desserts = desserts;
     },
     getFactures : function()
     {
        var deffred = $q.defer();
        $scope.promise = deffred.promise;
        deffred.resolve($scope.factures);
     }
    };

  }],
  bindings: {
    facturesComponent: '=',
    listFactures: '=',
    editedItem: '='
  }
});
