sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/f/library",
    'sap/ui/model/json/JSONModel'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,fioriLibrary,JSONModel) {
        "use strict";

        return Controller.extend("zsapreunit.pages.controller.UnitsPlannerBase", {
            onInit: function () {
                //this.oView = this.getView();
                this.oModel = new JSONModel(sap.ui.require.toUrl("zsapreunit/mockdata/unitplannermaster.json"));
			    this.getView().setModel(this.oModel);
            },
            onListItemPress: function (oEvent) {
                
                var oItem = oEvent.getSource().getBindingContext().getObject();
                var oModel = new JSONModel(oItem);    
                this.getView().setModel(oModel,"selectedCustomer");

                //var oFCL = this.oView.getParent().getParent();
                var oFCL =  this.getView().byId("fcl");
    
                oFCL.setLayout(fioriLibrary.LayoutType.TwoColumnsMidExpanded);
                
            },
            onMidClose: function(){
                this.getView().byId("fcl").setLayout(fioriLibrary.LayoutType.StartColumnFullScreen);
            },
            onOpen: function(){
                // forward compact/cozy style into Dialog
			    jQuery.sap.syncStyleClass(oView.getController().getOwnerComponent().getContentDensityClass(), oView, oDialog);
            }
        });
    });
