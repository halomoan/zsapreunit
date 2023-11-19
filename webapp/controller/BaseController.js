sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/format/DateFormat",
    "sap/ui/core/UIComponent",
  ],
  function (Controller, History, DateFormat, UIComponent) {
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

    ("use strict");
    return Controller.extend("zsapreunit.controller.BaseController", {
      getRouter: function () {
        return UIComponent.getRouterFor(this);
      },

      getKeyDate: function () {
        return new Date("2017-08-01");
      },

      yearDiff: function (oSDate, oEDate) {
        var oDate = new Date(oEDate);
        oDate.setDate(oEDate.getDate() + 1);
        var diff = getYearDiff(oSDate, oDate);
        if (diff == 1) {
          return diff + " yr";
        } else if (diff > 1) {
          return diff + " yrs";
        } else {
          return getMonthDifference(oSDate, oDate) + " mths";
        }
      },

      formatDateTime: function (oDateTime, sFormat) {
        if (!sFormat) {
          sFormat = "yyyy-MMM-dd";
        }
        var oDateInstance = DateFormat.getDateInstance({
          pattern: sFormat,
        });
        if (oDateTime instanceof Date) {
          return oDateInstance.format(oDateTime);
        } else {
          return oDateInstance.format(oDateInstance.parse(oDateTime));
        }
      },

      formatNumeric: function (Number) {
        var oFormatOptions = {
          style: "short",
          decimals: 1,
          shortDecimals: 2,
        };
        var oFloatFormat =
          sap.ui.core.format.NumberFormat.getFloatInstance(oFormatOptions);
        return oFloatFormat.format(Number);
      },
      formatNumericScale: function (Number) {
        if (Number > 1000000) {
          return "M";
        } else if (Number > 1000) {
          return "K";
        } else {
          return "";
        }
      },

      formatNoDecimals: function (Number) {
        var oFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
          groupingEnabled: true, // grouping is enabled
          //"groupingSeparator": '.', // grouping separator is '.'
          groupingSize: 3, // the amount of digits to be grouped (here: thousand)
          //"decimalSeparator": ","   // the decimal separator must be different from the grouping separator
        });
        return oFormat.format(Number);
      },

      formatNumber: function (Number) {
        var oFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
          groupingEnabled: true, // grouping is enabled
          decimals: 2,
          //"groupingSeparator": '.', // grouping separator is '.'
          groupingSize: 3, // the amount of digits to be grouped (here: thousand)
          //"decimalSeparator": ","   // the decimal separator must be different from the grouping separator
        });
        return oFormat.format(Number);
      },

      getFragmentByName: function(_formFragments,sFragmentName) {
        return _formFragments[sFragmentName];
      },

      showPopOverFragment : function(oView,oSource, _formFragments,sFragmentName,oThis) {
        return this.getFormFragment(oView, _formFragments,sFragmentName,oThis).openBy(oSource);

      },

      getFormFragment: function (oView, _formFragments, sFragmentName,oThis) {
        var oFormFragment = _formFragments[sFragmentName];
      
        if (oFormFragment) {
          return oFormFragment;
          
        }
      
        oFormFragment = sap.ui.xmlfragment(oView.getId(), sFragmentName,oThis);
        oView.addDependent(oFormFragment);
        
        var myFragment = (_formFragments[sFragmentName] = oFormFragment);
        return myFragment;
      },

      removeFragment: function(_formFragments){
        for(var sPropertyName in _formFragments) {
          if(!_formFragments.hasOwnProperty(sPropertyName)) {
            return;
          }
    
          _formFragments[sPropertyName].destroy();
          _formFragments[sPropertyName] = null;
        }
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
      },
    });
  }
);
