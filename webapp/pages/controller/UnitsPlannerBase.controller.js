sap.ui.define([
    "zsapreunit/controller/BaseController",
    "sap/f/library",        
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
    
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController,fioriLibrary,Filter,FilterOperator) {
        "use strict";

        
        function getBasePath() {
            return sap.ui.require.toUrl("sap/suite/ui/commons/sample/Timeline");
        }

        // function convertData(oEvent) {
        //     var oData,
        //         oModel = oEvent.getSource(),
        //         sBasePath = getBasePath();

        //     if (!oEvent.getParameters().success) {
        //         return;
        //     }            

            
        //     oData = oModel.getData();
            
        //     oData.Staggered.forEach(function (oStaggered) {
        //         //oStaggered.StartDate = DateUtils.parseDate(oStaggered.StartDate);
        //         //oStaggered.StartDate = new Date(oStaggered.StartDate);
        //         oStaggered.Photo = sBasePath + oStaggered.Photo;
        //     });

           
            
        //     oModel.updateBindings(true);
        // }

        return BaseController.extend("zsapreunit.pages.controller.UnitsPlannerBase", {
            


            onInit: function () {
                //this.oView = this.getView();
                //var oModel = new JSONModel(sap.ui.require.toUrl("zsapreunit/mockdata/unitplannermaster.json"));
                //oModel.attachRequestCompleted(convertData);
			    //this.getView().setModel(oModel);                

            },

            onListSearch: function (oEvent) {
                // add filter for search
                var aFilters = [];
                var sQuery = oEvent.getSource().getValue();
                if (sQuery && sQuery.length > 0) {
                   
                    var oFilter = new sap.ui.model.Filter([
                        new sap.ui.model.Filter("Tenant", FilterOperator.Contains, sQuery)
                        //new sap.ui.model.Filter("Company", FilterOperator.Contains, sQuery)
                    ],false);
                    aFilters.push(oFilter)
                }
    
                // update list binding
                var oList = sap.ui.core.Fragment.byId("container-zsapreunit---UnitsPlannerBase","sfloorunit");
                var oBinding = oList.getBinding("items");                
                oBinding.filter(aFilters, sap.ui.model.FilterType.Control);
            },
            onListItemPress: function (oEvent) {
                
                var oItem = oEvent.getSource().getBindingContext().getObject();                              
               
                var oModel = new sap.ui.model.json.JSONModel(oItem);                    
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
