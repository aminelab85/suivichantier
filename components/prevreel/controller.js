'use strict';

angular.module('myApp')
.component('prevreel', {
  templateUrl: 'components/prevreel/view.html',
  controller: ['$scope', '$q', '$rootScope', '$mdDialog', '$indexedDB', function ($scope, $q, $rootScope, $mdDialog, $indexedDB) {

    var ctrl = {
      postes : [],
      selected : [],
      postesComponent : 'table',
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
     getPostes : function()
     {
        var deffred = $q.defer();
        $scope.promise = deffred.promise;
        deffred.resolve('postesItems');
     }
    };

    var postesDeffred = $q.defer();
    ctrl.promise = postesDeffred.promise;

    $indexedDB.openStore('postes', (store) => {
      store.getAll().then((postesItems) => {
        ctrl.postes = postesItems;
        postesDeffred.resolve(postesItems);
      });
    });

    return ctrl;

  }],
  bindings: {
  }
});
