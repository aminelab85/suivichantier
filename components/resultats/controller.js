'use strict';

angular.module('myApp')
.component('resultats', {
  templateUrl: 'components/resultats/view.html',
  controller: ['$scope', '$rootScope', '$q', '$indexedDB', ($scope, $rootScope, $q, $indexedDB) => {

    var ctrl = this;


    var Ctrl = {
      totalTva: 0,
      tvaRecuperee: 0,
      tvaApayer: 0,
      resultat: 0,
      differentiel: 0,
      beneficePrev: 0,
      beneficeReel: 0
    }

    function updateData()
    {
      $indexedDB.openStore('general', (store) => {
        store.getAll().then((generalItems) => {
          Ctrl.totalTva = ((generalItems[0].htDixTva*10)/100) + ((generalItems[0].htVingtTva*20)/100);
          Ctrl.tvaApayer = Ctrl.totalTva - Ctrl.tvaRecuperee;
          $indexedDB.openStore('factures', (store) => {
            store.getAll().then((facturesItems) => {
              var sum = _.sumBy(facturesItems, 'montant');
              Ctrl.tvaRecuperee = (sum*20)/120;
              Ctrl.tvaApayer = Ctrl.totalTva - Ctrl.tvaRecuperee;
              $indexedDB.openStore('postes', (store) => {
                store.getAll().then((postesItems) => {
                  var sumPrev = _.sumBy(postesItems, 'prev');
                  var reel = _.sumBy(postesItems, 'reel');
                  var posteMoi = _.find(postesItems, { 'poste': 'Moi' });
                  Ctrl.differentiel = sumPrev - reel;
                  Ctrl.beneficePrev = posteMoi.prev + Ctrl.tvaRecuperee;
                  Ctrl.beneficeReel = posteMoi.reel + Ctrl.tvaRecuperee;
                });
              });
            });
          });
        });
      });
    };

    updateData();

    $scope.$on('DBMaj', function(evt, args){
      updateData();
    });


    return Ctrl;

  }],
  bindings: {
  }
});
