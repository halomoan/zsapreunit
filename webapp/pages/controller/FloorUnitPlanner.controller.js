sap.ui.define(
  [
    "zsapreunit/controller/BaseController",
    "zsapreunit/controller/TableManager",
    "zsapreunit/controller/FloorUnitForm",
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
    FloorUnitForm,
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
    var _oForm;
    var _oFormDialog;
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
            isBusy: false,
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
          var oTable = _oTableManager.getTableControl();
          var oPlugin = oTable.getPlugins()[0];
          var aIndices = oPlugin.getSelectedIndices();

          var sUnitNos = "";
          var aUnitNos = [];
          var oFUForm = new FloorUnitForm("2", "CREATE");

          for (var i = 0; i < aIndices.length; i++) {
            var oItem = oTable.getContextByIndex(aIndices[i]).getObject();
            sUnitNos = i === 0 ? oItem.Unitno : sUnitNos + "/" + oItem.Unitno;
            aUnitNos.push({ Unitno: oItem.Unitno });
          }

          for (var i = 0; i < aIndices.length; i++) {
            var oItem = oTable.getContextByIndex(aIndices[i]).getObject();

            if (i === 0) {
              oItem.Term2.xId = _oi18Bundle.getText("Label.SecondTerm");
              oItem.Term2.xUnitnos = aUnitNos;

              oItem.Term2mode.Main = true;
              oItem.Term2mode.Isinput = true;
              oItem.Term2mode.Hasdata = true;
              oItem.Term2mode.Todelete = false;

              oItem.Term2.Startdate = new Date(oItem.Term1.Enddate.getTime());
              oItem.Term2.Startdate.setDate(
                oItem.Term2.Startdate.getDate() + 1
              );

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
                oItem.Term2.Areasize = 0;
                oItem.Term2.Uom = oItem.Term1.Uom;
                oItem.Term2.Unitnos = sUnitNos;
              }

              oFUForm.setMainTerm(oItem.Term2);

              oFUForm.setEditTerm(oItem.Term2);

              
            }

            oFUForm.setTermModes(oItem.Term2mode);
          }

          oFUForm.setFloorUnits({
            Floor: oItem.Floor,
            Unitnos: sUnitNos,
          });

          this._clearTableSelection();
          this._refreshTable();

          _oForm = oFUForm.getForm();

          var oModel = new JSONModel(_oForm);
          this.getView().setModel(oModel, "PlanFormData");

          //var oViewModel = this.getView().getModel("viewData");
          //oViewModel.setProperty("/ChangeAreaSize", false);

          if (_oFormDialog) {
            _oFormDialog.open();
          } else {
            _oFormDialog = this.showFormDialogFragment(
              this.getView(),
              this._formFragments,
              "zsapreunit.fragments.PlanFormDialog",
              this
            );
          }
          _oFormDialog.bindElement({ path: "/", model: "PlanFormData" });

          var oFloorUnitsCtrl = this.byId("mFloorUnits");

          var oBinding = oFloorUnitsCtrl.getBinding("suggestionItems");
          oBinding.filter([
            new Filter("Floor", FilterOperator.EQ, oItem.Floor),
          ]);

          // var oFloorUnitsCtrl = this.byId("mFloorUnits");

          // for(var i = 0;i < aUnitNos.length; i++){
          //   var oToken = new sap.m.Token({
          //     key: aUnitNos[i],
          //     text: aUnitNos[i]
          //   });
          //   oFloorUnitsCtrl.addToken(oToken);
          // }
        },

        onUnitsChanged: function (oEvent) {
          oEvent.preventDefault();
          var oSource = oEvent.getSource();
          var sType = oEvent.getParameter("type");
          var oForm = oSource.getBindingContext("PlanFormData").getObject();

          if (sType === "removed") {
            var sKey = oEvent
              .getParameter("removedTokens")[0]
              .getProperty("key");

            var aUnitnos = oForm.editTerm.xUnitnos;

            aUnitnos = aUnitnos.filter((el) => el.Unitno !== sKey);

            var sUnitnos = "";

            for (var i = 0; i < aUnitnos.length; i++) {
              if (i === 0) {
                sUnitnos = aUnitnos[i].Unitno;
              } else {
                sUnitnos = sUnitnos + "/" + aUnitnos[i].Unitno;
              }
            }
            oForm.editTerm.xUnitnos = aUnitnos;
            oForm.editTerm.Unitnos = sUnitnos;
            oForm.floorUnits.Unitnos = sUnitnos;

            if(oForm.Editmode) {
                oForm.RemoveUnits.push( { "Floor": oForm.floorUnits.Floor, "Unitno": sKey})
            }

            var oModel = oSource.getBindingContext("PlanFormData").getModel();
            oModel.setProperty("/floorUnits", oForm.floorUnits);

            // var oFURow = _oTableManager.getFloorUnitTerm(oForm.floorUnits.Floor,sKey);
            // if (oFURow){
            //   oFURow.Term2.
            // }
           
          } else if (sType === "added") {
            var aTokens = oSource.getTokens();

            var sUnitnos = aTokens
              .map(function (oToken) {
                return oToken.getKey();
              })
              .join("/");

            var aUnitnos = aTokens.map(function (oToken) {
              return { Unitno: oToken.getKey() };
            });

            oForm.editTerm.xUnitnos = aUnitnos;
            oForm.editTerm.Unitnos = sUnitnos;
            oForm.floorUnits.Unitnos = sUnitnos;
          }
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

            oItem.editTerm.Trade = sTrade;
          }
        },

        onNewTermCreate: function () {
          _oForm.mainTerm.Noofyears = this.yearDiff(
            _oForm.mainTerm.Startdate,
            _oForm.mainTerm.Enddate
          );

          if (!_oForm.mainTerm.Uom) _oForm.mainTerm.Uom = "SF";

          if (!this._doTableSave()) {
            this._refreshTable();
          }

          _oFormDialog.findAggregatedObjects(true, function (o) {
            if (typeof o.setValueState === "function") o.setValueState("None");
          });
          _oFormDialog.close();
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

          var oFUForm = new FloorUnitForm("2", "EDIT");

          //_oForm.mainTerm = oTerm;
          oFUForm.setMainTerm(oTerm);
          //Copy to temporary storage for editing.

          var oTermCopy = JSON.parse(JSON.stringify(oTerm));
          oTermCopy.Startdate = _oForm.mainTerm.Startdate;
          oTermCopy.Enddate = _oForm.mainTerm.Enddate;
          oFUForm.setEditTerm(oTermCopy);

          oFUForm.setFloorUnits({
            Floor: oItem.Floor,
            Unitnos: oTerm.Unitnos,
          });

          _oForm = oFUForm.getForm();

          oModel = new JSONModel(_oForm);
          this.getView().setModel(oModel, "PlanFormData");

          if (_oFormDialog) {
            _oFormDialog.open();
          } else {
            _oFormDialog = this.showFormDialogFragment(
              this.getView(),
              this._formFragments,
              "zsapreunit.fragments.PlanFormDialog",
              this
            );
          }
        },

        onNewTermEdit: function () {
          _oForm.mainTerm.Noofyears = this.yearDiff(
            _oForm.mainTerm.Startdate,
            _oForm.mainTerm.Enddate
          );
          for (var prop in _oForm.editTerm) {
            _oForm.mainTerm[prop] = _oForm.editTerm[prop];
          }

          if (!this._doTableSave()) {
            this._refreshTable();
          }

          _oFormDialog.findAggregatedObjects(true, function (o) {
            if (typeof o.setValueState === "function") o.setValueState("None");
          });
          _oFormDialog.close();
        },

        onFormCancel: function () {
          
          if (!_oForm.Editmode) {
            for (var i = 0; i < _oForm.termModes.length; i++) {
              var oItem = _oForm.termModes[i];
              oItem.Main = false;
              oItem.Isinput = false;
              oItem.Startdate = null;
              oItem.Hasdata = false;
            }
            this._refreshTable();
          }

          var oTable = _oTableManager.getTableControl();
          var oPlugin = oTable.getPlugins()[0];
          oPlugin.clearSelection();

          _oFormDialog.findAggregatedObjects(true, function (o) {
            if (typeof o.setValueState === "function") o.setValueState("None");
          });

          _oFormDialog.close();
        },

        onSDateChanged: function (oEvent) {
          var oStartDP = oEvent.getSource();

          var oItem = oStartDP.getBindingContext("PlanFormData").getObject();

          if (
            oItem.editTerm.Startdate.getTime() >
            oItem.editTerm.Enddate.getTime()
          ) {
            MessageBox.error(_oi18Bundle.getText("Error.StartdategtEnddate"));
            oItem.HasError = true;
            oStartDP.setValueState("Error");
          } else {
            oStartDP.setValueState("None");
            oItem.HasError = false;
          }

          oItem.editTerm.Noofyears = this.yearDiff(
            oItem.editTerm.Startdate,
            oItem.editTerm.Enddate
          );
        },
        onEDateChanged: function (oEvent) {
          var oEndDP = oEvent.getSource();

          var oItem = oEndDP.getBindingContext("PlanFormData").getObject();

          if (
            oItem.editTerm.Startdate.getTime() >
            oItem.editTerm.Enddate.getTime()
          ) {
            MessageBox.error(_oi18Bundle.getText("Error.StartdategtEnddate"));
            oItem.HasError = true;
            oEndDP.setValueState("Error");
          } else {
            oItem.HasError = false;
            oEndDP.setValueState("None");
          }

          oItem.editTerm.Noofyears = this.yearDiff(
            oItem.editTerm.Startdate,
            oItem.editTerm.Enddate
          );
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
        },

        onGotoFirstColumn: function () {},

        _getTableData: function () {
          var oServiceKeys = this.getServiceKeys();
          var oModel = this.getView().getModel();
          var oViewModel = this.getView().getModel("viewData");

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

          var oTable = _oTableManager.getTableControl();
          oTable.setFixedColumnCount(2);
          oTable.setBusy(true);

          oModel.read("/ZSFloorTermSet", {
            filters: aFilters,
            success: function (oResponse) {
              if (oResponse.results) {
                var aData = oResponse.results;

                var oTableModel = new JSONModel({
                  floorData: aData,
                });

                _oTableManager.setTableModel(oTableModel);

                oTable.setBusy(false);

                this.getView().setModel(oTableModel, "tableData");
              }
            }.bind(this),
            error: function (oError) {
              oTable.setBusy(false);
              MessageBox.error("{i18n>Error.FailLoad}");
            },
          });

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

        _doTableSave: function () {
          var oFloorUnits = _oForm.floorUnits;
          
          // Floor Units changed
          if (oFloorUnits.Unitnos !== _oForm.mainTerm.Unitnos) {
            var aCurrUnitnos = _oForm.mainTerm.Unitnos.split("/");
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
                    //var oMainTerm = _oForm.mainTerm;
                    //var sFloor = oFloorUnits.Floor;

                    switch (_oForm.Termno) {
                      case "2":
                        _oTableManager.doSaveData(_oForm);
                        break;
                      case "3":
                        // _oTableManager.doSaveData(
                        //   sFloor,
                        //   aDiffUnitnos,
                        //   oMainTerm,
                        //   3
                        // );
                        break;
                    }
                  }
                }.bind(this),
              }
            );
            return true;
          } else {
            // Floor Units don't change
            

            _oTableManager.doSaveData(_oForm);
          }
          return false;
        },

        _delete2ndTerm: function (oItem) {
          var bDone = _oTableManager.deleteTerm(oItem, "2");

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
          var oTable = _oTableManager.getTableControl();
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
