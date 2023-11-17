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

                

                //var oCFEndTable = sap.ui.core.Fragment.byId("container-zsapreunit---UnitsPlannerBase","idCFEndTable");
                // oCFEndTable.attachUpdateFinished(function(oEvent){
                //     var oSource = oEvent.oSource;  
                    
                //     var oData = oSource.getBinding("items").getModel().oData;
                    
                //     for (const key in oData) {

                //         if(key )
                //         console.log(`${key}: ${oData[key]}`);
                //     }
                // });
                
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

            onDisplayCF: function(oEvent){
                
                var oData = this.getView().getModel("selectedCustomer").getData();
                
                this._refershCFEndTable(oData.Bukrs,oData.Busentity,oData.Rentalkeys,oData.Startdate,oData.Lastdate);

                var oFCL =  this.getView().byId("fcl");
    
                oFCL.setLayout(fioriLibrary.LayoutType.ThreeColumnsEndExpanded);
              
            },

            onTimelinePress: function(oEvent){
                var oItem = oEvent.getSource().getBindingContext().getObject(); 
                                
                var oModel = new sap.ui.model.json.JSONModel(oItem);                                    
                this.getView().setModel(oModel,"selectedCond");
                                
                var oFCL =  this.getView().byId("fcl");
    
                oFCL.setLayout(fioriLibrary.LayoutType.ThreeColumnsEndExpanded);

                this._refershCFEndTable(oItem.Bukrs,oItem.Busentity,oItem.Rentalkeys,oItem.Startdate,oItem.Enddate);
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

            _refershCFEndTable: function(Bukrs,Busentity,Rentalkeys,StartDate,EndDate){                

                var sBukrs = Bukrs;
                var sBusentity = Busentity; 
                var sRentalkeys = Rentalkeys;
                var sStartdate = StartDate;
                var sEnddate = EndDate;
                sRentalkeys = sRentalkeys.replace(/-\d$/,'');

               
                var aFilters = [
                    new Filter("Bukrs",FilterOperator.EQ,sBukrs),
                    new Filter("Busentity",FilterOperator.EQ,sBusentity),
                    new Filter("Rentalkeys", FilterOperator.EQ, sRentalkeys),
                    new Filter("Startdate", FilterOperator.EQ, sStartdate),
                    new Filter("Enddate", FilterOperator.EQ, sEnddate),
                    new Filter("Keydate", FilterOperator.EQ, this.getKeyDate())                   
                ];

                var oCFEndTable = sap.ui.core.Fragment.byId("container-zsapreunit---UnitsPlannerBase","idCFEndTable");
                var oBinding = oCFEndTable.getBinding("items");
                oBinding.filter(aFilters, sap.ui.model.FilterType.Application);

                aFilters = [
                    new Filter("Bukrs",FilterOperator.EQ,sBukrs),
                    new Filter("Busentity",FilterOperator.EQ,sBusentity),
                    new Filter("Rentalkeys", FilterOperator.EQ, sRentalkeys),
                    new Filter("Startdate", FilterOperator.EQ, sStartdate),
                    new Filter("Enddate", FilterOperator.EQ, sEnddate),
                    new Filter("Keydate", FilterOperator.EQ, this.getKeyDate())                            
                ];

                var oViewdata = this.getView().getModel("viewData");                            
                    oViewdata.setProperty("/TotalRent",0.00);
                    oViewdata.setProperty("/TBaseRent",0.00);
                    oViewdata.setProperty("/TSvcRent",0.00);
                    oViewdata.setProperty("/TAnpRent",0.00);
                    oViewdata.setProperty("/Startdate","");
                    oViewdata.setProperty("/Enddate","");

                var oModel = this.getView().getModel();
                oModel.read("/ZSCFDataSet",{
                    filters: aFilters,
                    success: function(oData, oResponse) {
                        if (oData && oData.results.length > 0){
                            var oData = oData.results[0];
                            oViewdata = this.getView().getModel("viewData");                            
                            oViewdata.setProperty("/TotalRent",oData.Trent);
                            oViewdata.setProperty("/TBaseRent",oData.Baserent);
                            oViewdata.setProperty("/TSvcRent",oData.Svcrent);
                            oViewdata.setProperty("/TAnpRent",oData.Anprent);
                            oViewdata.setProperty("/Startdate",oData.Startdate);
                            oViewdata.setProperty("/Enddate",oData.Enddate);
                            
                        }

                    }.bind(this),
                    error: function(oError) {
                        // BusyIndicator.hide();
                        // MessageBox.error("{i18n>msgErr}");
                    } 
                })
            },

            onOpen: function(){
                // forward compact/cozy style into Dialog
			    jQuery.sap.syncStyleClass(oView.getController().getOwnerComponent().getContentDensityClass(), oView, oDialog);
            }
        });
    });
