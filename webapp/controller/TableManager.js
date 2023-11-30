sap.ui.define(["sap/ui/base/ManagedObject"], function (ManagedObject) {
  "use strict";

  return ManagedObject.extend("zsapreunit.controller.TableManager", {
    aTableData: null,
    oTableModel: null,
    oTable: null,
    constructor: function (oTable) {
      ManagedObject.prototype.constructor.apply(this, []);
      this.oTable = oTable;      

      return this;
    },

    setTableModel: function(oModel){
        this.oTableModel = oModel;
        this.aTableData = oModel.getData().floorData;
    },
    getTableModel: function () {
      return this.oTableModel;
    },
    getTableData: function(){
      return this.aTableData;
    },

    refreshTable: function () {
      this.oTableModel.refresh();
      return null;
    },

    clearTableSelection: function () {      
      var oPlugin = this.oTable.getPlugins()[0];
      oPlugin.clearSelection();
    },

    deleteTerm: function (oTerm, sTermno) {
      var sFloor = oTerm.Floor;
      var sUnitNos = "";

      if (sTermno === "2") {
        sUnitNos = oTerm.Term2.Unitnos;
      } else if (sTermno === "3") {
        sUnitNos = oTerm.Term3.Unitnos;
      }
      var aUnitNos = sUnitNos.split("/");
      var bDone = false;

      for (var i = 0; i < aUnitNos.length; i++) {
        for (var idx = 0; idx < this.aTableData.length; idx++) {
          if (
            this.aTableData[idx].Floor === sFloor &&
            this.aTableData[idx].Unitno === aUnitNos[i]
          ) {
            bDone = true;
            var oItem = this.aTableData[idx];

            //console.log(oItem);

            oItem.Term2mode.Hasdata = false;
            oItem.Term2mode.Todelete = true;
            break;
          }
        }
      }
      return bDone;
    },
  });
});
