sap.ui.define(
  [
    "zsapreunit/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageBox",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (
    BaseController,
    Filter,
    FilterOperator,
    Sorter,
    JSONModel,
    MessageToast,
    BusyIndicator,
    MessageBox
  ) {
    "use strict";

    var _oi18Bundle;
    var _oForms;
    var _oDelItem;
    var _oLink;

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
            showBtn2ndTerm: false,
            showBtn3rdTerm: false,
            showBtnDel2ndTerm: false,
            ChangeAreaSize: false,
            industryData: [],            
          });

          var oView = this.getView();
          oView.setModel(oViewModel, "viewData");

          var oTableModel = new JSONModel({
            floorData: null,
          });
          oView.setModel(oTableModel, "tableData");

          this._oRouter = this.getRouter();
          this._oRouter
            .getRoute("RouteMainView")
            .attachPatternMatched(this.__onRouteMatched, this);
        },

        __onRouteMatched: function (oEvent) {
          _oi18Bundle = this.getResourceBundle();
          this._getTableData();
        },

        onShowT1Baserent: function (oEvent) {
          var oSource = oEvent.getSource();
          //var sPath = oSource.getBindingContext("viewData").getPath();      ;
          var oData = oSource.getBindingContext("tableData").getObject();

          //var oPopover = this.showPopOverFragment(this.getView(), oSource, this._formFragments, "zsapreunit.fragments.BaseRentYrsChg", this);
          //oPopover.bindElement(sPath);
          // var oNav = sap.ui.core.Fragment.byId("container-zsapreunit---FloorUnitPlanner","baserentnv");
          // var oChg = sap.ui.core.Fragment.byId("container-zsapreunit---FloorUnitPlanner","baserentchg");
          // oNav.to(oChg,"show");

          var aList = [];
          aList.push({
            Year: 1,
            Baserent: oData.Term1.Baserentyr1,
            Svcrent: oData.Term1.Svcrentyr1,
            Anprent: oData.Term1.Anprentyr1,
            Currency: oData.Term1.Currency,
            Editable: false,
          });

          aList.push({
            Year: 2,
            Baserent: oData.Term1.Baserentyr2,
            Svcrent: oData.Term1.Svcrentyr2,
            Anprent: oData.Term1.Anprentyr2,
            Currency: oData.Term1.Currency,
            Editable: false,
          });

          aList.push({
            Year: 3,
            Baserent: oData.Term1.Baserentyr3,
            Svcrent: oData.Term1.Svcrentyr3,
            Anprent: oData.Term1.Anprentyr3,
            Currency: oData.Term1.Currency,
            Editable: false,
          });

          aList.push({
            Year: 4,
            Baserent: oData.Term1.Baserentyr4,
            Svcrent: oData.Term1.Svcrentyr4,
            Anprent: oData.Term1.Anprentyr4,
            Currency: oData.Term1.Currency,
            Editable: false,
          });

          aList.push({
            Year: 5,
            Baserent: oData.Term1.Baserentyr5,
            Svcrent: oData.Term1.Svcrentyr5,
            Anprent: oData.Term1.Anprentyr5,
            Currency: oData.Term1.Currency,
            Editable: false,
          });

          aList.push({
            Year: 6,
            Baserent: oData.Term1.Baserentyr6,
            Svcrent: oData.Term1.Svcrentyr6,
            Anprent: oData.Term1.Anprentyr6,
            Currency: oData.Term1.Currency,
            Editable: false,
          });

          var oList = JSON.parse(JSON.stringify(aList));

          this.getView().setModel(new JSONModel(oList), "rateT1");
          this.getView().setModel(new JSONModel(oData.Term1), "Term1");

          this.showFormDialogFragment(
            this.getView(),
            this._formFragments,
            "zsapreunit.fragments.BaseRentYrsDisp",
            this
          );
        },

        onBaseRentDialogClose: function () {
          var oData = this.getView().getModel("rateT1");
        },
        onBaseRentDialogClose: function () {
          var oDialog = this.byId("BaseRentDialog");
          oDialog.close();
        },

        onUnitSelChange: function (oEvent) {
          var oPlugin = oEvent.getSource();
          var oTable = oEvent.getSource().getParent();
          var oModel = this.getView().getModel("viewData");

          var aIndices = oPlugin.getSelectedIndices();

          if (aIndices.length > 0) {
            var allow2ndTerm = true;
            var allow3rdTerm = true;
            var showDel2ndTerm = false;
            var sFloor = "";

            for (var i = 0; i < aIndices.length; i++) {
              var oItem = oTable.getContextByIndex(aIndices[i]).getObject();

              if (i === 0) {
                sFloor = oItem.Floor;
                if (oItem.Term2mode.Main && oItem.Term2mode.Isinput && !oItem.Term2mode.Todelete) {
                  //console.log(oItem);
                  showDel2ndTerm = true;
                  allow2ndTerm = false;
                  _oDelItem = oItem;
                }
              } else if (sFloor !== oItem.Floor) {
                allow2ndTerm = false;
                allow3rdTerm = false;
              }

              //console.log(oItem.Term2mode);
              if (oItem.Term2mode.Hasdata) {
                allow2ndTerm = false;
              }

              if (oItem.Term3mode.Hasdata) {
                allow3rdTerm = false;
              }
            }
            oModel.setProperty("/showBtnDel2ndTerm", showDel2ndTerm);
            oModel.setProperty("/showBtn2ndTerm", allow2ndTerm);
            oModel.setProperty("/showBtn3rdTerm", allow3rdTerm);
          } else {
            oModel.setProperty("/showBtnDel2ndTerm", false);
            oModel.setProperty("/showBtn2ndTerm", false);
            oModel.setProperty("/showBtn3rdTerm", false);
          }
        },

        onCreate2ndTerm: function (oEvent) {
          var oTable = this.byId("planTable");
          var oPlugin = oTable.getPlugins()[0];
          var aIndices = oPlugin.getSelectedIndices();

          
          var sUnitNos = "";
          var oMainTerm;

          _oForms = {
            mainTerm: [],
            subTerms: [],
            termModes: [],
            floorUnits: [],
          };

          for (var i = 0; i < aIndices.length; i++) {
            var oItem = oTable.getContextByIndex(aIndices[i]).getObject();

            if (oItem.Term2.Bupano && oItem.Term2.Startdate) {
              MessageBox.error(
                _oi18Bundle.getText("Error.2ndTermInUsed", oItem.Unitno)
              );
              break;
            }

            if (i === 0) {
              oMainTerm = oItem.Term2;
              oItem.Term2.xId = _oi18Bundle.getText("Label.SecondTerm");
             
              oItem.Term2mode.Main = true;
              oItem.Term2mode.Isinput = true;
              oItem.Term2mode.Hasdata = true;
              oItem.Term2mode.Todelete = false;
              
              //oItem.Term2.Startdate = oDate.setDate(oItem.Term1.Enddate.getDate() + 1);

              oItem.Term2.Startdate = new Date(oItem.Term1.Enddate.getTime());
              oItem.Term2.Startdate.setDate(
                oItem.Term2.Startdate.getDate() + 1
              );

              oItem.Term2.Areasize = 0;  
              oItem.Term2.Enddate = new Date(oItem.Term2.Startdate.getTime());
              oItem.Term2.Enddate.setDate(
                oItem.Term2.Enddate.getDate() + 365 * 3
              );

             
              

              _oForms.mainTerm.push(oItem.Term2);
              
              sUnitNos = oItem.Unitno;
            } else {
              oItem.Term2 = oMainTerm;

              oItem.Term2mode.Isinput = false;
              oItem.Term2mode.Hasdata = true;
              oItem.Term2mode.Todelete = false;
              _oForms.subTerms.push(oItem.Term2);
              sUnitNos = sUnitNos + "/" + oItem.Unitno;
            }

            if (!oItem.Term2.Uom) {
              oItem.Term2.Uom = "SF";
            }
            _oForms.termModes.push(oItem.Term2mode);
          }
          
          _oForms.mainTerm[0].Unitnos = sUnitNos;          

          _oForms.floorUnits.push({
            Floor: oItem.Floor,
            Unitnos: _oForms.mainTerm[0].Unitnos,
          });

          this._clearTableSelection();
          this._refreshTable();
          

          var oModel = new JSONModel(_oForms);
          this.getView().setModel(oModel, "PlanFormData");

          var oViewModel = this.getView().getModel("viewData");
          oViewModel.setProperty("/ChangeAreaSize", false);

          
          this.showFormDialogFragment(
            this.getView(),
            this._formFragments,
            "zsapreunit.fragments.PlanFormDialog",
            this
          );
        },

        onDelete2ndTerm: function () {
          MessageBox.confirm(_oi18Bundle.getText("Confirm.Delete2ndTerm"), {
            actions: ["Yes", "No"],
            emphasizedAction: "Yes",
            onClose: function (sAction) {
              if (sAction === "Yes") {
                this._delete2ndTerm();
              }
             
            }.bind(this),
          });
        },


        onTradeChanged: function (oEvent) {
          var oItem;
          var oSelectedItem = oEvent.getParameter("selectedItem");
          var sTrade = oSelectedItem.getText();

          var oBindingContext = oSelectedItem.getBindingContext("tableData");

          if (oBindingContext) {
            oItem = oBindingContext.getObject();
            oItem.Term2.Trade = sTrade;
          } else {
            oBindingContext = oSelectedItem.getBindingContext("PlanFormData");
            oItem = oBindingContext.getObject();
            oItem.Trade = sTrade;
          }
        },

        onNewTermCreate: function () {          
          _oForms.mainTerm[0].Noofyears = this.yearDiff(_oForms.mainTerm[0].Startdate, _oForms.mainTerm[0].Enddate)

          this._refreshTable();
          
          var oDialog = this.getView().byId("PlanTermForm");
          oDialog.close();
        },

        onNewTermCancel: function () {
          for (var i = 0; i < _oForms.termModes.length; i++) {
            
            var oItem = _oForms.termModes[i];            
            oItem.Main = false;
            oItem.Isinput = false;
            oItem.Startdate = null;
            oItem.Hasdata = false;
            
          }   
          
          this._refreshTable();

          var oTable = this.byId("planTable");
          var oPlugin = oTable.getPlugins()[0];
          oPlugin.clearSelection();

          var oDialog = this.getView().byId("PlanTermForm");
          oDialog.close();
        },

        onSDateChanged:function(oEvent) {
          var oStartDP = oEvent.getSource();    
          
          console.log(oStartDP.getBindingContext("PlanFormData"));
          var oItem = oStartDP.getBindingContext("PlanFormData").getObject();
          
          oItem.Noofyears = this.yearDiff(oItem.Startdate,oItem.Enddate);          
         
        },
        onEDateChanged: function(oEvent){
          var oEndDP = oEvent.getSource();                    
          var oItem = oEndDP.getBindingContext("PlanFormData").getObject();
          
          oItem.Noofyears = this.yearDiff(oItem.Startdate,oItem.Enddate);
          

        },
        onChangeAreaSize: function(oEvent){          
          var oSource = oEvent.getSource();
          var oBindingContext = oSource.getBindingContext("PlanFormData");
          var oData = oBindingContext.getObject();
          oData.Areasize = 0;          
        },

        openDatePicker: function(oEvent){
          _oLink = oEvent.getSource();
          this.getView().byId("HiddenDP").openBy(_oLink.getDomRef());
        },

        onDateChanged: function(oEvent){
         
          var sValue = oEvent.getParameter("value");
          var oDate  = new  Date(sValue);
          var sItemPath = _oLink.getBindingContext("tableData").getPath();
          
          var sPath = _oLink.getBinding("text").getPath();
          
          var oModel = this.getView().getModel("tableData");
          oModel.setProperty(sItemPath + "/" + sPath, oDate);
          
          //oModel.refresh();
          
          //var oObject = _oLink.getBindingContext("tableData").getObject();
          //console.log(sItemPath,sPath,oObject,oPlanDate);

        },

        onGotoFirstColumn: function () {},

        _getTableData: function () {
          var oServiceKeys = this.getServiceKeys();

          var aFilters = [];
          aFilters.push(
            new Filter("Bukrs", FilterOperator.EQ, oServiceKeys.Bukrs)
          );
          aFilters.push(
            new Filter("Busentity", FilterOperator.EQ, oServiceKeys.Busentity)
          );
          aFilters.push(
            new Filter("Contrtype", FilterOperator.EQ, oServiceKeys.Contrtype)
          );
          aFilters.push(
            new Filter("Keydate", FilterOperator.EQ, oServiceKeys.Keydate)
          );

          var oModel = this.getView().getModel();

          sap.ui.core.BusyIndicator.show();

          oModel.read("/ZSFloorTermSet", {
            filters: aFilters,
            success: function (oResponse) {
              if (oResponse.results) {
                var aData = oResponse.results;
                //console.log(aData);
                var oTableModel = new JSONModel({
                  floorData: aData,
                });

                this.getView().setModel(oTableModel, "tableData");
              }
              sap.ui.core.BusyIndicator.hide();
            }.bind(this),
            error: function (oError) {
              sap.ui.core.BusyIndicator.hide();
              MessageBox.error("{i18n>Error.FailLoad}");
            },
          });

          sap.ui.core.BusyIndicator.show();

          aFilters = [];
          aFilters.push(
            new Filter(
              "Language",
              FilterOperator.EQ,
              sap.ui.getCore().getConfiguration().getLanguage()
            )
          );
          aFilters.push(
            new Filter("IndustrySystemType", FilterOperator.EQ, "0001")
          );
          aFilters.push(
            new Filter("IndustrySector", FilterOperator.BT, "100", "999")
          );
          oModel.read("/ZIT_INDUSTRY", {
            filters: aFilters,
            sorters: [
              new Sorter({
                path: "IndustryKeyDescription",
                descending: false,
              }),
            ],
            success: function (oResponse) {
              if (oResponse.results) {
                var aData = oResponse.results;
                var oViewModel = this.getView().getModel("viewData");
                oViewModel.setProperty("/industryData", aData);
              }
              sap.ui.core.BusyIndicator.hide();
            }.bind(this),
            error: function (oError) {
              sap.ui.core.BusyIndicator.hide();
              MessageBox.error("{i18n>Error.FailLoad}");
            },
          });
        },

   

        _delete2ndTerm: function(){
          
          var sFloor = _oDelItem.Floor;
          var sUnitNos = _oDelItem.Term2.Unitnos;
          var aUnitNos = sUnitNos.split("/");
          var bFound = false;

          var oModel = this.getView().getModel("tableData");
          var aTableData = oModel.getData().floorData;
          //console.log(aTableData);

          for(var i=0; i < aUnitNos.length; i++){
            for(var idx=0; idx<aTableData.length;idx++){
              if (aTableData[idx].Floor === sFloor && aTableData[idx].Unitno === aUnitNos[i]){
                bFound = true;
                var oItem = aTableData[idx];

                //console.log(oItem);
               
                oItem.Term2mode.Hasdata = false;
                oItem.Term2mode.Todelete = true;
                break;
              }              
            }
          }

          if (bFound){
            this._clearTableSelection();
            oModel.refresh();
          }
        },

        _refreshTable: function(){
          var oModel = this.getView().getModel("tableData");
          oModel.refresh();
        },
        _clearTableSelection : function() {
          var oTable = this.byId("planTable");
          var oPlugin = oTable.getPlugins()[0];
          oPlugin.clearSelection();

        },
        
        onExit: function () {
          this.removeFragment(this._formFragments);
        },
      }
    );
  }
);
