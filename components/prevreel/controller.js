'use strict';

angular.module('myApp')
.component('prevreel', {
  templateUrl: 'components/prevreel/view.html',
  controller: ['$scope', '$q', '$rootScope', '$mdDialog', '$indexedDB', function ($scope, $q, $rootScope, $mdDialog, $indexedDB) {

    var ctrl = {
      editedItem : {},
      postes : [],
      selected : [],
      postesComponent : 'table',
      filter : {
        show:false,
        options: {
          debounce: 500
        }
      },
      styleMarge : function(item)
      {
        if((item.prev - item.reel) < 0)
        {
          return {'color':'red'};
        }
        else
        {
          return {'color':'green'};
        }
      },
      delete: function(ev)
      {
        var ctrl = this;
        var confirm = $mdDialog.confirm()
          .title('Supprimer cet poste ?')
          .textContent(ctrl.selected[0].poste)
          .targetEvent(ev)
          .ok('Oui')
          .cancel('Non');

        $mdDialog.show(confirm).then(
          () => {
            $indexedDB.openStore('postes', (store) => {
              store.delete(ctrl.selected[0].id).then((e) => {
                var idx = _.findIndex(ctrl.postes, { 'id': ctrl.postes[0].id })
                ctrl.postes.splice(idx, 1);
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
       this.editedItem = angular.copy(this.selected[0]);
       this.postesComponent = 'form';
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

    $scope.$on('DBMaj', function(evt, args){
      $indexedDB.openStore('factures', (store) => {
        store.getAll().then((facturesItems) => {
          var sum = _.sumBy(facturesItems, 'montant');
          var poste = _.find(ctrl.postes, { 'poste': 'Fournitures' });
          if(!poste)
          {
            poste = {
              'poste': 'Fournitures',
              'prev' : 0
            };
            ctrl.postes.splice(0,0,poste);
          }
          poste.reel = sum;
          if(!poste.id)
          {
            $indexedDB.openStore('postes', (store) => {
              store.upsert(poste).then((e) => {
                poste['id'] = e[0];
              });
            });
          }
        });
      });
    });

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
