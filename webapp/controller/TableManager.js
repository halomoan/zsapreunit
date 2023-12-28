sap.ui.define(["sap/ui/base/ManagedObject"], function (ManagedObject) {
  "use strict";

  return ManagedObject.extend("zsapreunit.controller.TableManager", {
    aTableData: null,
    oTableModel: null,
    oTable: null,

    aUploadData: [],
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

    getUploadData: function(){
      return this.aUploadData;
    },

    saveFormData: function(oForm){      
      
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


                this._recordDirty(sFloor,sUnitno,sTermno,oMainTerm);

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

                this._recordDirty(sFloor,sUnitno,sTermno,oMainTerm);
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

    _recordDirty: function(sFloor,sUnitNo,sTermno,oTerm){
      var oRecord = this.aUploadData.find((el,idx) => el.Floor === sFloor && el.Unitno === sUnitNo && el.Termno === sTermno);      
      

      if (!oRecord){
        this.aUploadData.push({ "Floor" : sFloor, "Unitno" : sUnitNo, "Termno" : sTermno, "Term" : oTerm});        
      } else {
        oRecord.Term = oTerm;
      }      
    },

    getUploadData : function(Bukrs,Busentity,Contrtype,Keydate){
      var oData = {
        "Bukrs": Bukrs,
        "Busentity" : Busentity,
        "Contrtype": Contrtype,
        "Keydate": Keydate,
        "Floor": '',
        "Unitno" : '',
        "Term1" : null,
        "Term2" : null,
        "Term3" : null,
        "Term1mode" : null,
        "Term2mode" : null,
        "Term3mode" : null
      };

      var result = [];

      for(var i = 0; i < this.aUploadData.length; i++){
        var rec = this.aUploadData[i];
        oData.Floor = rec.Floor;
        oData.Unitno = rec.Unitno;
        switch(rec.Termno) {
          case "2":
              oData.Term2.Company = rec.Company;
              oData.Term2.Tenant = rec.Tenant;
              oData.Term2.Areasize = rec.Areasize;
              oData.Term2.Uom = rec.Uom;
              oData.Term2.Tradekey = rec.Tradekey;
              oData.Term2.Trade = rec.Trade;
              oData.Term2.Startdate = rec.Startdate;
              oData.Term2.Enddate = rec.Enddate;
              oData.Term2.Noofyears = rec.Noofyears;
              oData.Term2.Currency = rec.Currency;
              oData.Term2.Avgbaserent = rec.Avgbaserent;
              oData.Term2.Baserentyr1 = rec.Baserentyr1;
              oData.Term2.Baserentyr2 = rec.Baserentyr2;
              oData.Term2.Baserentyr3 = rec.Baserentyr3;
              oData.Term2.Baserentyr4 = rec.Baserentyr4;
              oData.Term2.Baserentyr5 = rec.Baserentyr5;
              oData.Term2.Baserentyr6 = rec.Baserentyr6;
              oData.Term2.Svcrentyr1 = rec.Svcrentyr1;
              oData.Term2.Svcrentyr2 = rec.Svcrentyr2;
              oData.Term2.Svcrentyr3 = rec.Svcrentyr3;
              oData.Term2.Svcrentyr4 = rec.Svcrentyr4;
              oData.Term2.Svcrentyr5 = rec.Svcrentyr5;
              oData.Term2.Svcrentyr6 = rec.Svcrentyr6;
              oData.Term2.Anprentyr1 = rec.Anprentyr1;
              oData.Term2.Anprentyr2 = rec.Anprentyr2;
              oData.Term2.Anprentyr3 = rec.Anprentyr3;
              oData.Term2.Anprentyr4 = rec.Anprentyr4;
              oData.Term2.Anprentyr5 = rec.Anprentyr5;
              oData.Term2.Anprentyr6 = rec.Anprentyr6;
              oData.Term2.Unitnos = rec.Unitnos;
            break;
          case "3":
              oData.Term3.Company = rec.Company;
              oData.Term3.Tenant = rec.Tenant;
              oData.Term3.Areasize = rec.Areasize;
              oData.Term3.Uom = rec.Uom;
              oData.Term3.Tradekey = rec.Tradekey;
              oData.Term3.Trade = rec.Trade;
              oData.Term3.Startdate = rec.Startdate;
              oData.Term3.Enddate = rec.Enddate;
              oData.Term3.Noofyears = rec.Noofyears;
              oData.Term3.Currency = rec.Currency;
              oData.Term3.Avgbaserent = rec.Avgbaserent;
              oData.Term3.Baserentyr1 = rec.Baserentyr1;
              oData.Term3.Baserentyr2 = rec.Baserentyr2;
              oData.Term3.Baserentyr3 = rec.Baserentyr3;
              oData.Term3.Baserentyr4 = rec.Baserentyr4;
              oData.Term3.Baserentyr5 = rec.Baserentyr5;
              oData.Term3.Baserentyr6 = rec.Baserentyr6;
              oData.Term3.Svcrentyr1 = rec.Svcrentyr1;
              oData.Term3.Svcrentyr2 = rec.Svcrentyr2;
              oData.Term3.Svcrentyr3 = rec.Svcrentyr3;
              oData.Term3.Svcrentyr4 = rec.Svcrentyr4;
              oData.Term3.Svcrentyr5 = rec.Svcrentyr5;
              oData.Term3.Svcrentyr6 = rec.Svcrentyr6;
              oData.Term3.Anprentyr1 = rec.Anprentyr1;
              oData.Term3.Anprentyr2 = rec.Anprentyr2;
              oData.Term3.Anprentyr3 = rec.Anprentyr3;
              oData.Term3.Anprentyr4 = rec.Anprentyr4;
              oData.Term3.Anprentyr5 = rec.Anprentyr5;
              oData.Term3.Anprentyr6 = rec.Anprentyr6;
              oData.Term3.Unitnos = rec.Unitnos;
            break;
        }
        result.push(oData);
      }
      return result;
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
    
      console.log(sUnitNos,aUnitNos);

      for (var i = 0; i < aUnitNos.length; i++) {

        var sUnitno = aUnitNos[i].substring(4,7);

        if (i === 0) {
          var idx = this.aUploadData.findIndex((el,idx) => el.Floor === sFloor && el.Unitno === sUnitno && el.Termno === sTermno); 
          if (idx >= 0)
            this.aUploadData.splice(idx,1);
        }

        for (var idx = 0; idx < this.aTableData.length; idx++) {

          //console.log(sFloor,aUnitNos[i],this.aTableData[idx])
          if (
            this.aTableData[idx].Floor === sFloor &&
            this.aTableData[idx].Unitno === sUnitno
          ) {
            bDone = true;
            var oItem = this.aTableData[idx];
            
            if (sTermno === "2"){
              oItem.Term2mode.Isinput = false;
              oItem.Term2mode.Hasdata = false;
              oItem.Term2mode.Todelete = true;
            } else if (sTermno === "3") {
              oItem.Term3mode.Isinput = false;
              oItem.Term3mode.Hasdata = false;
              oItem.Term3mode.Todelete = true;
            }
            break;
          }
        }
      }
      return bDone;
    },
  });
});
