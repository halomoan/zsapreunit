sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/format/DateFormat",
    "sap/ui/core/UIComponent"
  ], function(Controller, History,DateFormat, UIComponent) {
  
    function getMonthDifference(startDate, endDate) {
      // return (
      //   endDate.getMonth() -
      //   startDate.getMonth() +
      //   12 * (endDate.getFullYear() - startDate.getFullYear())
      // );
      var months;
      months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
      months -= startDate.getMonth();
      months += endDate.getMonth();
      return months <= 0 ? 0 : months;
    }

    function getYearDiff(date1, date2) {
      return Math.abs(date2.getFullYear() - date1.getFullYear());
    }

    "use strict";
    return Controller.extend("zsapreunit.controller.BaseController", {
  
      getRouter : function () {
        return UIComponent.getRouterFor(this);
      },

      yearDiff: function(oSDate,oEDate){
        var oDate = new Date(oEDate);
        oDate.setDate(oEDate.getDate()+1);
        var diff = getYearDiff(oSDate,oDate);
        if (diff == 1) {
          return diff + " yr";
        } else if (diff > 1) {
          return diff + " yrs";
        } else {
          return getMonthDifference(oSDate,oDate) + " mths";
        }
      },

      formatDateTime: function(oDateTime,sFormat) {
                
        if (!sFormat) {
          sFormat = "yyyy-MMM-dd";
        }
        var oDateInstance = DateFormat.getDateInstance(
          {
            pattern: sFormat
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