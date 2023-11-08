sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/f/library",
    "sap/ui/core/format/DateFormat",
    "sap/ui/model/json/JSONModel"
    
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,fioriLibrary,DateFormat,JSONModel) {
        "use strict";

        
        function getBasePath() {
            return sap.ui.require.toUrl("sap/suite/ui/commons/sample/Timeline");
        }

        function convertData(oEvent) {
            var oData,
                oModel = oEvent.getSource(),
                sBasePath = getBasePath();

            if (!oEvent.getParameters().success) {
                return;
            }            

            
            oData = oModel.getData();
            
            oData.Staggered.forEach(function (oStaggered) {
                //oStaggered.StartDate = DateUtils.parseDate(oStaggered.StartDate);
                //oStaggered.StartDate = new Date(oStaggered.StartDate);
                oStaggered.Photo = sBasePath + oStaggered.Photo;
            });

           
            
            oModel.updateBindings(true);
        }

        return Controller.extend("zsapreunit.pages.controller.UnitsPlannerBase", {
            


            onInit: function () {
                //this.oView = this.getView();
                var oModel = new JSONModel(sap.ui.require.toUrl("zsapreunit/mockdata/unitplannermaster.json"));
                oModel.attachRequestCompleted(convertData);
			    this.getView().setModel(oModel);                

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

            formatDateTime: function(dateTime) {
                var oDateInstance = DateFormat.getDateInstance();                
                return oDateInstance.format(oDateInstance.parse(dateTime));
            },
            onOpen: function(){
                // forward compact/cozy style into Dialog
			    jQuery.sap.syncStyleClass(oView.getController().getOwnerComponent().getContentDensityClass(), oView, oDialog);
            }
        });
    });
