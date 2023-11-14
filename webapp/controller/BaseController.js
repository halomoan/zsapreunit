sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/format/DateFormat",
    "sap/ui/core/UIComponent"
  ], function(Controller, History,DateFormat, UIComponent) {
  
    "use strict";
    return Controller.extend("zsapreunit.controller.BaseController", {
  
      getRouter : function () {
        return UIComponent.getRouterFor(this);
      },

      formatDateTime: function(oDateTime) {
                
        var oDateInstance = DateFormat.getDateInstance(
          {
            pattern: "yyyy-MMM-dd"
          }
        );                
        if (oDateTime instanceof Date) {
          return oDateInstance.format(oDateTime);
        } else {          
          return oDateInstance.format(oDateInstance.parse(oDateTime));
        }
        
    },

    formatNoDecimals: function(Number){
        var oFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
          "groupingEnabled": true,  // grouping is enabled
          //"groupingSeparator": '.', // grouping separator is '.'
          "groupingSize": 3,        // the amount of digits to be grouped (here: thousand)
          //"decimalSeparator": ","   // the decimal separator must be different from the grouping separator
      });
      return oFormat.format(Number);
    },
      
      onNavBack: function () {
        var oHistory, sPreviousHash;
        oHistory = History.getInstance();
        sPreviousHash = oHistory.getPreviousHash();
        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          this.getRouter().navTo("appHome", {}, true /*no history*/);
        }
      },
      getResourceBundle: function () {         
        return this.getOwnerComponent().getModel("i18n").getResourceBundle();
   
      }
  
    });
  });