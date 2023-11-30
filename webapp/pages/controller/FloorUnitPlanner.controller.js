sap.ui.define(
  [
    "zsapreunit/controller/BaseController",
    "zsapreunit/controller/TableManager",
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
    TableManager,
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
    var _oTableManager;
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

          var oTable = this.byId("planTable");
          _oTableManager = new TableManager(oTable);

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
                if (
                  oItem.Term2mode.Main &&
                  oItem.Term2mode.Isinput &&
                  !oItem.Term2mode.Todelete
                ) {
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

        onCreate2ndTermDialog: function (oEvent) {
          var oTable = this.byId("planTable");
          var oPlugin = oTable.getPlugins()[0];
          var aIndices = oPlugin.getSelectedIndices();

          var sUnitNos = "";
          var oMainTerm;

          _oForms = {
            mainTerm: [],            
            termModes: [],
            floorUnits: null,            
            Editmode: false,
            Termno: "2",
          };

          for (var i = 0; i < aIndices.length; i++) {
            var oItem = oTable.getContextByIndex(aIndices[i]).getObject();
            sUnitNos =  (i === 0) ? oItem.Unitno : sUnitNos + "/" + oItem.Unitno;
          }

          for (var i = 0; i < aIndices.length; i++) {
            var oItem = oTable.getContextByIndex(aIndices[i]).getObject();

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

              //oItem.Term2.Areasize = 1500;
              oItem.Term2.Enddate = new Date(oItem.Term2.Startdate.getTime());
              oItem.Term2.Enddate.setDate(
                oItem.Term2.Enddate.getDate() + 365 * 3
              );

              // Single Row selected and isMain
              if (aIndices.length === 1 && oItem.Term1mode.Main) {
                oItem.Term2.Areasize = oItem.Term1.Areasize;
                oItem.Term2.Uom = oItem.Term1.Uom;
                oItem.Term2.Unitnos = oItem.Term1.Unitnos;
                sUnitNos = oItem.Term1.Unitnos;
              } else {
                oItem.Term2.Unitnos = sUnitNos;
              }

              _oForms.mainTerm.push(oItem.Term2);
             
            } else {
              oItem.Term2 = oMainTerm;

              oItem.Term2mode.Isinput = false;
              oItem.Term2mode.Hasdata = true;
              oItem.Term2mode.Todelete = false;
    
            }            

            if (!oItem.Term2.Uom) {
              oItem.Term2.Uom = "SF";
            }
            _oForms.termModes.push(oItem.Term2mode);
          }

          _oForms.floorUnits = {
            Floor: oItem.Floor,
            Unitnos: sUnitNos,
          };
          
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

        onDelete2ndTermDialog: function () {
          MessageBox.confirm(_oi18Bundle.getText("Confirm.Delete2ndTerm"), {
            actions: ["Yes", "No"],
            emphasizedAction: "Yes",
            onClose: function (sAction) {
              if (sAction === "Yes") {
                this._delete2ndTerm(_oDelItem);
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
          _oForms.mainTerm[0].Noofyears = this.yearDiff(
            _oForms.mainTerm[0].Startdate,
            _oForms.mainTerm[0].Enddate
          );
              
          if(!this._doTableSave()) {
            this._refreshTable();
          };


          var oDialog = this.getView().byId("PlanTermForm");
          oDialog.close();
        },
        onEditTermDialog: function (oEvent) {
          var oSource = oEvent.getSource();
          var sItemPath = oSource.getBindingContext("tableData").getPath();

          var sPath = oSource.getBinding("text").getPath();
                   

          if (!sPath) {
            var aBindings = oSource.getBinding("text").getBindings();
            sPath = aBindings[0].getPath();
          }

          var sTermno = sPath.match(/(\d+)/)[1];

          sPath = sPath.replace(/\/.+$/, "");
          var sTerm = sItemPath + "/" + sPath;

          var oModel = oSource.getModel("tableData");
          var oTerm = oModel.getProperty(sTerm);
          var oItem = oModel.getProperty(sItemPath);

          _oForms = {
            mainTerm: [],            
            termModes: [],
            floorUnits: null,            
            Editmode: true,
            Termno: sTermno
          };

          _oForms.mainTerm.push(oTerm);

          _oForms.floorUnits = {
            Floor: oItem.Floor,
            Unitnos: oTerm.Unitnos,
          };
          
          oModel = new JSONModel(_oForms);
          this.getView().setModel(oModel, "PlanFormData");

          this.showFormDialogFragment(
            this.getView(),
            this._formFragments,
            "zsapreunit.fragments.PlanFormDialog",
            this
          );
        },


        onNewTermEdit: function () {
          _oForms.mainTerm[0].Noofyears = this.yearDiff(
            _oForms.mainTerm[0].Startdate,
            _oForms.mainTerm[0].Enddate
          );          

          if(!this._doTableSave()) {
            this._refreshTable();
          };
          

          var oDialog = this.getView().byId("PlanTermForm");
          oDialog.close();
        },

        _doTableSave: function(){
          var oFloorUnits = _oForms.floorUnits;
          var oModel = _oTableManager.getTableModel();
          var aTableData = _oTableManager.getTableData();            
          

          if (oFloorUnits.Unitnos !== _oForms.mainTerm[0].Unitnos) {
            var aCurrUnitnos = _oForms.mainTerm[0].Unitnos.split("/");
            var aPrevUnitnos = oFloorUnits.Unitnos.split("/");
            
            const aDiffUnitnos = aCurrUnitnos.filter(
              (element) => !aPrevUnitnos.includes(element)
            );

            MessageBox.confirm(
              _oi18Bundle.getText("Confirm.AddNewUnit", [
                aDiffUnitnos.toString(),
              ]),
              {
                actions: ["Yes", "No"],
                emphasizedAction: "Yes",
                onClose: function (sAction) {
                  if (sAction === "Yes") {
                    
                    var oMainTerm = _oForms.mainTerm[0];
                    var sFloor = oFloorUnits.Floor;

                    for (var i = 0; i < aDiffUnitnos.length; i++) {
                      var sUnit = aDiffUnitnos[i];
                      var oItem = null;

                      aTableData.forEach((value, key) => {
                        if (value.Floor === sFloor && value.Unitno === sUnit) {
                          oItem = value;                         
                          return;
                        }
                      });
                      if (oItem) {
                        if (_oForms.Termno === "2") {
                          oItem.Term2 = oMainTerm;
                          oItem.Term2mode.Hasdata = true;                                                
                          oModel.setProperty("/floorData",aTableData);
                        }
                      }
                    }
                  }
                }.bind(this),
              }
            );
            return true;
          } else {
            // Floor Units don't change
            var oMainTerm = _oForms.mainTerm[0];
            var sFloor = oFloorUnits.Floor;

            var aCurrUnitnos = _oForms.mainTerm[0].Unitnos.split("/");

            for (var i = 0; i < aCurrUnitnos.length; i++) {
              var sUnit = aCurrUnitnos[i];
              var oItem = null;

              aTableData.forEach((value, key) => {
                if (value.Floor === sFloor && value.Unitno === sUnit) {
                  oItem = value;                  
                  return;
                }
              });
              if (oItem) {
                if (_oForms.Termno === "2") {
                  oItem.Term2 = oMainTerm;
                  oItem.Term2mode.Hasdata = true;                                    
                  oModel.setProperty("/floorData",aTableData);
                }
              }
            }

          }
          return false;
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

        onSDateChanged: function (oEvent) {
          var oStartDP = oEvent.getSource();

          console.log(oStartDP.getBindingContext("PlanFormData"));
          var oItem = oStartDP.getBindingContext("PlanFormData").getObject();

          oItem.Noofyears = this.yearDiff(oItem.Startdate, oItem.Enddate);
        },
        onEDateChanged: function (oEvent) {
          var oEndDP = oEvent.getSource();
          var oItem = oEndDP.getBindingContext("PlanFormData").getObject();

          oItem.Noofyears = this.yearDiff(oItem.Startdate, oItem.Enddate);
        },
        onChangeAreaSize: function (oEvent) {
          var oSource = oEvent.getSource();
          var oBindingContext = oSource.getBindingContext("PlanFormData");
          var oData = oBindingContext.getObject();
          oData.Areasize = 0;
        },

       
        onOpenDatePicker: function (oEvent) {
          _oLink = oEvent.getSource();
          this.getView().byId("HiddenDP").openBy(_oLink.getDomRef());
        },

        onDateChanged: function (oEvent) {
          var sValue = oEvent.getParameter("value");
          var oDate = new Date(sValue);
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
                
                _oTableManager.setTableModel(oTableModel);                                

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

        _delete2ndTerm: function (oItem) {

          var bDone = _oTableManager.deleteTerm(oItem,"2");
          
          if (bDone) {
            _oTableManager.clearTableSelection();
            _oTableManager.refreshTable();
          }
        },

        _refreshTable: function () {
          var oModel = _oTableManager.getTableModel();
          oModel.refresh();
        },
        _clearTableSelection: function () {
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
