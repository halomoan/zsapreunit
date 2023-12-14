sap.ui.define(["sap/ui/base/ManagedObject"], function (ManagedObject) {
  "use strict";

  return ManagedObject.extend("zsapreunit.controller.FloorUnitForm", {
   
    oForm : {
      mainTerm: null,            
      editTerm: null,      
      termModes: [],
      //floorUnits: null,
      RemoveUnits: [],                  
      Editmode: true,
      HasError: false,
      Termno: "2",      
    },

    constructor: function (sTermno,sMode) {
      ManagedObject.prototype.constructor.apply(this, []);            

      
      this.oForm.Termno = sTermno ? sTermno : "2";
      this.oForm.Editmode = sMode === 'EDIT';
      this.oForm.RemoveUnits = [];
      // if (sMode === 'EDIT'){
      //   this.oForm.Editmode = true;
      // } else {
      //   this.oForm.Editmode = false;
      //   this.oForm.subTerms = [];
      // }
      

      return this;
    },

    
    getForm: function() {
      return this.oForm;
    },

    setMainTerm: function(oTerm){
      this.oForm.mainTerm = oTerm;
    },

    getMainTerm: function(){
      return this.oForm.mainTerm;
    },

    setEditTerm: function(oTerm){
      this.oForm.editTerm = oTerm;
    },

    getEditTerm: function(){
      return this.oForm.editTerm;
    },

    setTermModes: function(oTermMode){
      this.oForm.termModes.push(oTermMode);
    },

    // setFloorUnits: function(oFloorUnits){
    //   this.oForm.floorUnits = oFloorUnits;
    // },

    getUnitnos: function(){
      var sUnitnos = "";
      var aUnitnos = this.oForm.editTerm.xUnitnos;

      for(var i = 0; i < aUnitnos.length; i++ ){
        if (i === 0){
          sUnitnos = aUnitnos[i];
        } else {
          sUnitnos = sUnitnos + "/" + aUnitnos[i];
        }
      }
    }

  });
});
