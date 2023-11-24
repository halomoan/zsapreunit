sap.ui.define(
  ["zsapreunit/controller/BaseController",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/model/Sorter",
  "sap/ui/model/json/JSONModel",	
  "sap/m/MessageToast",    
  "sap/ui/core/BusyIndicator",  
  "sap/m/MessageBox"
],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (BaseController,Filter,FilterOperator,Sorter,JSONModel,MessageToast,BusyIndicator,MessageBox) {
    "use strict";

    return BaseController.extend(
      "zsapreunit.pages.controller.FloorUnitPlanner",
      {
        _formFragments: {},        

        onInit: function () {

          // this.oTableModel = new JSONModel(
          //   sap.ui.require.toUrl("zsapreunit/mockdata/floors.json")
          // );          

          // this.getView().setModel(this.oTableModel);         

          var oViewModel = new JSONModel({                    
            "MMM-YYYY": "MMM-YYYY",
            "showBtn2ndTerm": false,
            "showBtn3rdTerm": false,
            "FloorUnitsData": {},
            "industryData": []                  
          });
          
          var oView = this.getView();
          oView.setModel(oViewModel,"viewData");

          
          this._oRouter = this.getRouter();          
			    this._oRouter.getRoute("RouteMainView").attachPatternMatched(this.__onRouteMatched, this);
        },

        __onRouteMatched: function(oEvent){
          //console.log(oEvent);
          this._refreshTable();
        },


        onShowT1Baserent: function (oEvent) {

          var oSource = oEvent.getSource();
          //var sPath = oSource.getBindingContext("viewData").getPath();      ;
          var oData = oSource.getBindingContext("viewData").getObject();

   
          
          //var oPopover = this.showPopOverFragment(this.getView(), oSource, this._formFragments, "zsapreunit.fragments.BaseRentYrsChg", this);          
          //oPopover.bindElement(sPath);          
          // var oNav = sap.ui.core.Fragment.byId("container-zsapreunit---FloorUnitPlanner","baserentnv");
          // var oChg = sap.ui.core.Fragment.byId("container-zsapreunit---FloorUnitPlanner","baserentchg");          
          // oNav.to(oChg,"show");
                    
          var aList = [];
          aList.push({
            "Year": 1,
            "Baserent": oData.Term1.Baserentyr1,
            "Svcrent": oData.Term1.Svcrentyr1,
            "Anprent": oData.Term1.Anprentyr1,
            "Currency" : oData.Term1.Currency,
            "Editable": false
          });

          aList.push({
            "Year": 2,
            "Baserent": oData.Term1.Baserentyr2,
            "Svcrent": oData.Term1.Svcrentyr2,
            "Anprent": oData.Term1.Anprentyr2,
            "Currency" : oData.Term1.Currency,
            "Editable": false
          });

          aList.push({
            "Year": 3,
            "Baserent": oData.Term1.Baserentyr3,
            "Svcrent": oData.Term1.Svcrentyr3,
            "Anprent": oData.Term1.Anprentyr3,
            "Currency" : oData.Term1.Currency,
            "Editable": false
          });

          aList.push({
            "Year": 4,
            "Baserent": oData.Term1.Baserentyr4,
            "Svcrent": oData.Term1.Svcrentyr4,
            "Anprent": oData.Term1.Anprentyr4,
            "Currency" : oData.Term1.Currency,
            "Editable": false
          });

          aList.push({
            "Year": 5,
            "Baserent": oData.Term1.Baserentyr5,
            "Svcrent": oData.Term1.Svcrentyr5,
            "Anprent": oData.Term1.Anprentyr5,
            "Currency" : oData.Term1.Currency,
            "Editable": false
          });

          aList.push({
            "Year": 6,
            "Baserent": oData.Term1.Baserentyr6,
            "Svcrent": oData.Term1.Svcrentyr6,
            "Anprent": oData.Term1.Anprentyr6,
            "Currency" : oData.Term1.Currency,
            "Editable": false
          });


          var oList = JSON.parse(JSON.stringify(aList));          

          this.getView().setModel(new JSONModel(
            oList
          ),"rateT1");   
          this.getView().setModel(new JSONModel(
            oData.Term1
          ),"Term1"); 

          this.showFormDialogFragment(this.getView(), this._formFragments, "zsapreunit.fragments.BaseRentYrsDisp", this);

        },

        onBaseRentDialogClose:function(){
          var oData = this.getView().getModel("rateT1");
        },
        onBaseRentDialogClose: function(){
          var oDialog = this.byId("BaseRentDialog");          
          oDialog.close();	
        },

        onUnitSelChange:  function(oEvent) {

          
          var oPlugin = oEvent.getSource();
          var oTable = oEvent.getSource().getParent();
          var oModel = this.getView().getModel("viewData");

          var aIndices = oPlugin.getSelectedIndices();

          
          if (aIndices.length > 0) {          
            var allow2ndTerm = true;
            var allow3rdTerm = true;

            for(var i=0;i<aIndices.length;i++){
              
              var oItem = oTable.getContextByIndex(aIndices[i]).getObject();
              
                if (oItem.Term2.Startdate){
                  allow2ndTerm = false ;                  
                }

                if (oItem.Term3.Startdate){            
                  
                  allow3rdTerm = false;
                } 
            }     
            oModel.setProperty("/showBtn2ndTerm",allow2ndTerm);     
            oModel.setProperty("/showBtn3rdTerm",allow3rdTerm);     
          } else {
            oModel.setProperty("/showBtn2ndTerm",false);
            oModel.setProperty("/showBtn3rdTerm",false);
          }

        },

        onToggle2ndTerm: function(oEvent){
          var oTable = this.byId("planTable");
          var oPlugin = oTable.getPlugins()[0];
			    var aIndices = oPlugin.getSelectedIndices();          

          
          var oForms = 
            {
              "forms" : [
                  
              ],
              "floorunit" : [

              ]
          };
                 

          for(var i=0;i<aIndices.length;i++){
            var oItem = oTable.getContextByIndex(aIndices[i]).getObject();

            console.log(oItem);
            if (i === 0) {              
              
              oItem.Main = true;              
              oItem.Term2.Term = "2nd Term";
              oItem.Term3.Term = "3rd Term";
              oItem.Term2.Startdate = oItem.Term1.Enddate;

              oForms.forms.push(oItem.Term2);
              oForms.forms.push(oItem.Term3);
            } 
            oForms.floorunit.push({ "Floor": oItem.Floor, "Unitno": oItem.Unitno});

            
          }
                    

          var oModel = new JSONModel(oForms);          
          this.getView().setModel(oModel,"PlanFormData")
          
          this.showFormDialogFragment(this.getView(), this._formFragments, "zsapreunit.fragments.PlanFormDialog", this);
         
          
        },

        onGotoFirstColumn: function(){
          
          
        },

        _refreshTable: function(){

          var oServiceKeys = this.getServiceKeys();
         
          var aFilters = [];
          aFilters.push(new Filter("Bukrs", FilterOperator.EQ, oServiceKeys.Bukrs));
          aFilters.push(new Filter("Busentity", FilterOperator.EQ, oServiceKeys.Busentity));
          aFilters.push(new Filter("Contrtype", FilterOperator.EQ, oServiceKeys.Contrtype));
          aFilters.push(new Filter("Keydate", FilterOperator.EQ, oServiceKeys.Keydate));
          
          var oModel = this.getView().getModel();
          
          sap.ui.core.BusyIndicator.show();

          oModel.read("/ZSFloorTermSet",{
            filters: aFilters,
            success: function(oResponse){
                
                if (oResponse.results){
                  var aData = oResponse.results;                       
                  //console.log(aData);             
                  var oViewModel = this.getView().getModel("viewData");
                  oViewModel.setProperty("/floorData",aData);
                }
              sap.ui.core.BusyIndicator.hide();
            }.bind(this),
            error: function(oError) {
              sap.ui.core.BusyIndicator.hide();
              MessageBox.error("{i18n>Error.FailLoad}");
            }
          });

          sap.ui.core.BusyIndicator.show();


          aFilters = [];
          aFilters.push(new Filter("Language", FilterOperator.EQ, sap.ui.getCore().getConfiguration().getLanguage()));
          aFilters.push(new Filter("IndustrySystemType", FilterOperator.EQ, '0001'));          

          oModel.read("/ZIT_INDUSTRY",{
            filters: aFilters,
            sorters: [ new Sorter({
              path: 'IndustryKeyDescription',
              descending: false
            })],
            success: function(oResponse){
                
                if (oResponse.results){
                  var aData = oResponse.results;                       
                  console.log(aData);             
                  var oViewModel = this.getView().getModel("viewData");
                  oViewModel.setProperty("/industryData",aData);
                }
              sap.ui.core.BusyIndicator.hide();
            }.bind(this),
            error: function(oError) {
              sap.ui.core.BusyIndicator.hide();
              MessageBox.error("{i18n>Error.FailLoad}");
            }
          });


        },

        onExit: function() {
                    
          this.removeFragment(this._formFragments);
    
        }
      }
    );
  }
);
