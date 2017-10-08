'use strict';

angular.module('myApp')
.component('admin', {
  templateUrl: 'components/admin/view.html',
  controller: ['$scope', '$rootScope', '$q', '$indexedDB', '$mdDialog', 'jsonViewerService', ($scope, $rootScope, $q, $indexedDB, $mdDialog, jsonViewerService) => {

    var Ctrl = {
      dropDb: dropDb,
      exportDb: exportDb,
      importDb: importDb,
      jsonValue: undefined
    };



    function importDb(event)
    {
      var confirm = $mdDialog.confirm()
        .title('Voulez vous supprimer la base de données existante ?')
        .targetEvent(event)
        .ok('Oui')
        .cancel('Non');

      $mdDialog.show(confirm).then(
        () => {

          $indexedDB.openStore('general', (store) => {
            store.clear().then(() => {
              $indexedDB.openStore('factures', (store) => {
                store.clear().then(() => {
                  $indexedDB.openStore('postes', (store) => {
                    store.clear().then(() => {
                      var importedData = JSON.parse(jsonViewerService.jsonString);

                      $indexedDB.openStore('general', (store) => {
                        store.upsert(importedData.general).then((e) => {
                          $rootScope.$broadcast('DBMaj');
                        });
                      });

                      $indexedDB.openStore('factures', (store) => {
                        store.upsert(importedData.factures).then((e) => {
                          $rootScope.$broadcast('DBMaj');
                        });
                      });

                      $indexedDB.openStore('postes', (store) => {
                        store.upsert(importedData.postes).then((e) => {
                          $rootScope.$broadcast('DBMaj');
                        });
                      });

                    });
                  });
                });
              });
            });
          });

      });

    };

    function exportDb(event)
    {
      var ObjToExport = {};
      $indexedDB.openStore('general', (store1) => {
        store1.getAll().then((generalItems) => {
          ObjToExport.general = generalItems;
          $indexedDB.openStore('factures', (store2) => {
            store2.getAll().then((facturesItems) => {
              ObjToExport.factures = facturesItems;
              $indexedDB.openStore('postes', (store3) => {
                store3.getAll().then((postesItems) => { // general.client.replace(/ /g, '_')
                  ObjToExport.postes = postesItems;
                  document.getElementById('editor').value = JSON.stringify(ObjToExport, null, ' ');
                  jsonViewerService.jsonString = JSON.stringify(ObjToExport);
                  jsonViewerService.parseJson();
                });
              });
            });
          });
        });
      });
    };

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
