sap.ui.define(
  [
    "zsapreunit/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  function (BaseController, Filter, FilterOperator) {
    "use strict";
    var _oi18Bundle = null;
    var _oTable = null;
    var _oParams = null;

    return BaseController.extend(
      "zsapreunit.pages.controller.LeaseCommission",
      {
        /**
         * @override
         */
        onInit: function () {
          this._oRouter = this.getRouter();
          this._oRouter
            .getRoute("LeaseCommission")
            .attachPatternMatched(this.__onRouteMatched, this);
        },
        __onRouteMatched: function (oEvent) {
          _oi18Bundle = this.getResourceBundle();
          _oTable = this.byId("leasecommtbl");
          _oParams = oEvent.getParameter("arguments");
          

          this._refreshTable();
        },

        _refreshTable: function () {
          var aFilters = [];
          aFilters.push(new Filter("Bukrs", FilterOperator.EQ, _oParams.Bukrs));
          aFilters.push(
            new Filter("Busentity", FilterOperator.EQ, _oParams.Busentity)
          );
          aFilters.push(
            new Filter("Contrtype", FilterOperator.EQ, _oParams.Contrtype)
          );
          aFilters.push(
            new Filter("Keydate", FilterOperator.EQ, _oParams.Keydate)
          );

          console.log(aFilters);

          _oTable.bindAggregation("rows", {
            path: "/ZSLEASECOMMSet",
            filters: aFilters,
          });
        },
      }
    );
  }
);
