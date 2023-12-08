sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/format/DateFormat",
    "sap/ui/core/format/NumberFormat",
    "sap/ui/core/UIComponent",
  ],
  function (Controller, History, DateFormat, NumberFormat, UIComponent) {
    var sDateFormat = "yyyy-MMM-dd";

    function getDayDiff(startDate, endDate) {
      const msInDay = 24 * 60 * 60 * 1000;
    
      return Math.round(
        Math.abs(endDate - startDate) / msInDay
      );
    }

    function getMonthDifference(startDate, endDate) {
      return (
        endDate.getMonth() -
        startDate.getMonth() +
        12 * (endDate.getFullYear() - startDate.getFullYear())
      );     
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

      getServiceKeys: function () {
        var oKeys = {
          Bukrs: "1001",
          Busentity: "1001",
          Contrtype: "L002",
          Keydate: this.getKeyDate(),
        };
        return oKeys;
      },

      yearDiff: function (oSDate, oEDate) {
        if (oSDate instanceof Date && oEDate instanceof Date) {
          var oDate = new Date(oEDate);

          oDate.setDate(oEDate.getDate() + 1);
          var diff = getYearDiff(oSDate, oDate);
          if (diff === 1) {
            return diff + " yr";
          } else if (diff > 1) {
            return diff + " yrs";
          } else {
            diff =  getMonthDifference(oSDate, oDate);
            if (diff === 1){
              return diff + "mth";
            } else if (diff > 1) {
              return diff + " mths";
            } else return getDayDiff(oSDate, oDate) + " days";

          }
        } else return "0 yr";
      },

      formatDateTime: function (oDateTime, sFormat) {
        if (!sFormat) {
          sFormat = sDateFormat;
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
          NumberFormat.getFloatInstance(oFormatOptions);
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
        var oFormat = NumberFormat.getFloatInstance({
          groupingEnabled: true, // grouping is enabled
          //"groupingSeparator": '.', // grouping separator is '.'
          groupingSize: 3, // the amount of digits to be grouped (here: thousand)
          //"decimalSeparator": ","   // the decimal separator must be different from the grouping separator,
          decimals: 0,
        });
        return oFormat.format(Number);
      },

      formatNumber: function (Number) {
        var oFormat = NumberFormat.getFloatInstance({
          groupingEnabled: true, // grouping is enabled
          decimals: 2,
          //"groupingSeparator": '.', // grouping separator is '.'
          groupingSize: 3, // the amount of digits to be grouped (here: thousand)
          //"decimalSeparator": ","   // the decimal separator must be different from the grouping separator
        });
        return oFormat.format(Number);
      },

      getFragmentByName: function (_formFragments, sFragmentName) {
        return _formFragments[sFragmentName];
      },

      showPopOverFragment: function (
        oView,
        oSource,
        _formFragments,
        sFragmentName,
        oThis
      ) {
        return this.getFormFragment(
          oView,
          _formFragments,
          sFragmentName,
          oThis
        ).openBy(oSource);
      },

      showFormDialogFragment: function (
        oView,
        _formFragments,
        sFragmentName,
        oThis
      ) {
         return this.getFormFragment(
          oView,
          _formFragments,
          sFragmentName,
          oThis
        ).open();
      },

      getFormFragment: function (oView, _formFragments, sFragmentName, oThis) {
        var oFormFragment = _formFragments[sFragmentName];

        if (oFormFragment) {
          return oFormFragment;
        }

        oFormFragment = sap.ui.xmlfragment(oView.getId(), sFragmentName, oThis);
        oView.addDependent(oFormFragment);

        var myFragment = (_formFragments[sFragmentName] = oFormFragment);
        return myFragment;
      },

      removeFragment: function (_formFragments) {
        for (var sPropertyName in _formFragments) {
          if (!_formFragments.hasOwnProperty(sPropertyName)) {
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
