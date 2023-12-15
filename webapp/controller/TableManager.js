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

    getTableControl: function(){
      return this.oTable;
    },
    setTableModel: function(oModel){
        this.oTableModel = oModel;
        this.aTableData = oModel.getData().floorData;
    },

    getFloorUnits: function(){
      var aFloorUnits = [];              

      this.aTableData.forEach((o) => { aFloorUnits.push(
        {
          "Floor": o.Floor,
          "Unitno": o.Unitno
        }
        );
      })
      
      return aFloorUnits;

    },
    getTableModel: function () {
      return this.oTableModel;
    },
    getTableData: function(){
      return this.aTableData;
    },

    getAvgBaseRent: function(oTerm){
      var iTBaserent = 0;
      var iBaseRent = 0;
      var iTCount = 0;
      for(var i = 1; i < 7; i++){
        iBaseRent = parseFloat(oTerm['Baserentyr' + i]);
        iTBaserent = iTBaserent + iBaseRent;

        if (iBaseRent > 0) {
          iTCount = iTCount + 1;
        }        
      }

      if (iTCount > 0)
         return (iTBaserent / iTCount);
      else
        return 0;
    },

    doSaveData: function(oForm){      
      
      var sTermno = oForm.Termno;      
      var aUnitnos = oForm.mainTerm.xUnitnos;
      var oMainTerm = oForm.mainTerm;

      oMainTerm.Avgbaserent = this.getAvgBaseRent(oMainTerm);
      
      for (var i = 0; i < aUnitnos.length; i++) {
        var sFloor = aUnitnos[i].Floor;
        var sUnitno = aUnitnos[i].Unitno;
        var oItem = this.getFloorUnitTerm(sFloor,sUnitno);
        
        if (oItem) {         
          switch(sTermno) {
            case "2":
              oItem.Term2 = oMainTerm;             
              if (i === 0) {
                oItem.Term2mode.Isinput = true;
                oItem.Term2mode.Hasdata = true;
                oItem.Term2mode.Todelete = false;
              } else {
                oItem.Term2mode.Isinput = false;
                oItem.Term2mode.Hasdata = true;
                oItem.Term2mode.Todelete = false;
              }
              break;
            case "3":
              oItem.Term3 = oMainTerm;
              
              if (i === 0) {
                oItem.Term3mode.Isinput = true;
                oItem.Term3mode.Hasdata = true;
                oItem.Term3mode.Todelete = false;
              } else {
                oItem.Term3mode.Isinput = false;
                oItem.Term3mode.Hasdata = true;
                oItem.Term3mode.Todelete = false;
              }
              break;            
          }
        }
      } 
      var aRemoveUnits = oForm.RemoveUnits;     

      for (var i = 0; i < aRemoveUnits.length; i++) {
        var sFloor = aRemoveUnits[i].Floor;
        var sUnitno = aRemoveUnits[i].Unitno;
        var oItem = this.getFloorUnitTerm(sFloor,sUnitno);

        if (oItem) {         
          switch(sTermno) {
            case "2":
              oItem.Term2 = oForm.editTerm;
              oItem.Term2.Company = "";
              oItem.Term2.Tenant = "";
              oItem.Term2.Trade = "";
              oItem.Term2.Tradekey = "";
              oItem.Term2.Areasize = 0;
              oItem.Term2mode.Isinput = false;
              oItem.Term2mode.Hasdata = false;
              oItem.Term2mode.Todelete = true;
            case "3":
              oItem.Term3 = oForm.editTerm;
              oItem.Term3.Company = "";
              oItem.Term3.Tenant = "";
              oItem.Term3.Trade = "";
              oItem.Term3.Tradekey = "";
              oItem.Term3.Areasize = 0;
              oItem.Term3mode.Isinput = false;
              oItem.Term3mode.Hasdata = false;
              oItem.Term3mode.Todelete = true;
          }
        }
      }
      
      this.oTableModel.setProperty("/floorData",this.aTableData);

    },

    getFloorUnitTerm: function(sFloor,sUnitno){      
      return this.aTableData.find((el) => el.Floor === sFloor && el.Unitno === sUnitno);     
    },

    refreshTable: function () {
      this.oTableModel.refresh();     
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
            oItem.Term2mode.Isinput = false;
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
