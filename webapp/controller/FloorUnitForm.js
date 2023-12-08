sap.ui.define(["sap/ui/base/ManagedObject"], function (ManagedObject) {
  "use strict";

  return ManagedObject.extend("zsapreunit.controller.FloorUnitForm", {
   
    oForm : {
      mainTerm: null,            
      editTerm: null,
      termModes: [],
      floorUnits: null,
                        
      Editmode: true,
      HasError: false,
      Termno: "2",      
    },

    constructor: function (sTermno,sMode) {
      ManagedObject.prototype.constructor.apply(this, []);            

      
      this.oForm.Termno = sTermno ? sTermno : "2";
      this.oForm.Editmode = sMode === 'EDIT';
      

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

    setFloorUnits: function(oFloorUnits){
      this.oForm.floorUnits = oFloorUnits;
    }

  });
});
