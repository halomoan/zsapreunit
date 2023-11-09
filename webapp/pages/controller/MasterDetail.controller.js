sap.ui.define([    
    "zsapreunit/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController,Filter,FilterOperator) {
        "use strict";

        return BaseController.extend("zsapreunit.pages.controller.MasterDetail", {
            onInit: function () {
                this._oRouter = this.getRouter();
                this._oRouter.getRoute("RouteMainView").attachPatternMatched(this.__onRouteMatched, this);
            },
            __onRouteMatched: function(oEvent){
                this._refreshSloorUnit();               
            },

            _refreshSloorUnit: function(){
                

                var aFilter = [
                    new Filter("Bukrs", FilterOperator.EQ, "1001"),
                    new Filter("Busentity", FilterOperator.EQ, "00001001"),
                    new Filter("Contrtype", FilterOperator.EQ, "L002"),
                    new Filter("Keydate", FilterOperator.EQ, new Date("2017-08-01")),
                ];

                var oList = sap.ui.core.Fragment.byId("container-zsapreunit---UnitsPlannerBase","sfloorunit");

                
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFilter, "Application");                
            },
            onOpen: function(){
                // forward compact/cozy style into Dialog
			    jQuery.sap.syncStyleClass(oView.getController().getOwnerComponent().getContentDensityClass(), oView, oDialog);
            }
        });
    });
