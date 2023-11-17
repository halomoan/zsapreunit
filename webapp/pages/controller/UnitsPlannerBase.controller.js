sap.ui.define([
    "zsapreunit/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/f/library",        
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
    
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController,JSONModel,fioriLibrary,Filter,FilterOperator) {
        "use strict";
          

        return BaseController.extend("zsapreunit.pages.controller.UnitsPlannerBase", {
            


            onInit: function () {
                var oViewModel = new JSONModel({                    
                    "MMM-YYYY": "MMM-YYYY"                    
                });
                
                var oView = this.getView();
                oView.setModel(oViewModel,"viewData");

                
                
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
                        new sap.ui.model.Filter("Tenant", FilterOperator.Contains, sQuery),
                        new sap.ui.model.Filter("Company", FilterOperator.Contains, sQuery)
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
              
                this._refreshTimeline(oItem.Rentalkeys);
            

                //var oFCL = this.oView.getParent().getParent();
                var oFCL =  this.getView().byId("fcl");
    
                oFCL.setLayout(fioriLibrary.LayoutType.TwoColumnsMidExpanded);
                
            },

            onTimelinePress: function(oEvent){
                var oItem = oEvent.getSource().getBindingContext().getObject();
                var oModel = new sap.ui.model.json.JSONModel(oItem);                                    
                this.getView().setModel(oModel,"selectedCond");
                                
                var oFCL =  this.getView().byId("fcl");
    
                oFCL.setLayout(fioriLibrary.LayoutType.ThreeColumnsMidExpanded);

                this._refershCFEndTable();
            },
            onMidClose: function(){
                this.getView().byId("fcl").setLayout(fioriLibrary.LayoutType.StartColumnFullScreen);
            },

            onEndClose: function(){
                
                this.getView().byId("fcl").setLayout(fioriLibrary.LayoutType.TwoColumnsMidExpanded);
                

            },

            _refreshTimeline: function(keys){


                var oModel = this.getView().getModel("selectedCustomer");

                var sBukrs = oModel.getProperty("/Bukrs");
                var sBusentity = oModel.getProperty("/Busentity");                

                var aFilters = [
                    new Filter("Bukrs",FilterOperator.EQ,sBukrs),
                    new Filter("Busentity",FilterOperator.EQ,sBusentity),
                    new Filter("Rentalkeys", FilterOperator.EQ, keys)                    
                ];

                var oTimeline = sap.ui.core.Fragment.byId("container-zsapreunit---UnitsPlannerBase","idTimeline");
                 
                var oBinding = oTimeline.getBinding("content");           
                
                oBinding.filter(aFilters, sap.ui.model.FilterType.Control);

            },

            _refershCFEndTable: function(){
                var oModel = this.getView().getModel("selectedCond");

                var sBukrs = oModel.getProperty("/Bukrs");
                var sBusentity = oModel.getProperty("/Busentity"); 
                var sRentalkey = oModel.getProperty("/Rentalkeys");
                var sStartdate = oModel.getProperty("/Startdate");
                var sEnddate = oModel.getProperty("/Enddate");
                sRentalkey = sRentalkey.replace(/-\d$/,'');

               
                var aFilters = [
                    new Filter("Bukrs",FilterOperator.EQ,sBukrs),
                    new Filter("Busentity",FilterOperator.EQ,sBusentity),
                    new Filter("Rentalkey", FilterOperator.EQ, sRentalkey),
                    new Filter("Startdate", FilterOperator.EQ, sStartdate),
                    new Filter("Enddate", FilterOperator.EQ, sEnddate)           
                ];

                var oCFEndTable = sap.ui.core.Fragment.byId("container-zsapreunit---UnitsPlannerBase","idCFEndTable");
                var oBinding = oCFEndTable.getBinding("items");
                oBinding.filter(aFilters, sap.ui.model.FilterType.Application);
            },

            onOpen: function(){
                // forward compact/cozy style into Dialog
			    jQuery.sap.syncStyleClass(oView.getController().getOwnerComponent().getContentDensityClass(), oView, oDialog);
            }
        });
    });
