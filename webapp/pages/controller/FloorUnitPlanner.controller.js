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
            showBtnDel3rdTerm: false,            
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

          this.getView().setModel(new JSONModel(oList), "termRate");
          this.getView().setModel(new JSONModel(oData.Term1), "Term");

          this.showFormDialogFragment(
            this.getView(),
            this._formFragments,
            "zsapreunit.fragments.BaseRentYrs",
            this
          );
        },

        onShowT2Baserent: function(oEvent){
          var oSource = oEvent.getSource();
          //var sPath = oSource.getBindingContext("viewData").getPath();      ;
          var oData = oSource.getBindingContext("tableData").getObject();

          var aList = [];
          aList.push({
            Year: 1,
            Baserent: oData.Term2.Baserentyr1,
            Svcrent: oData.Term2.Svcrentyr1,
            Anprent: oData.Term2.Anprentyr1,
            Currency: oData.Term2.Currency,
            Editable: true,
          });

          aList.push({
            Year: 2,
            Baserent: oData.Term2.Baserentyr2,
            Svcrent: oData.Term2.Svcrentyr2,
            Anprent: oData.Term2.Anprentyr2,
            Currency: oData.Term2.Currency,
            Editable: true,
          });

          aList.push({
            Year: 3,
            Baserent: oData.Term2.Baserentyr3,
            Svcrent: oData.Term2.Svcrentyr3,
            Anprent: oData.Term2.Anprentyr3,
            Currency: oData.Term2.Currency,
            Editable: true,
          });

          aList.push({
            Year: 4,
            Baserent: oData.Term2.Baserentyr4,
            Svcrent: oData.Term2.Svcrentyr4,
            Anprent: oData.Term2.Anprentyr4,
            Currency: oData.Term2.Currency,
            Editable: true,
          });

          aList.push({
            Year: 5,
            Baserent: oData.Term2.Baserentyr5,
            Svcrent: oData.Term2.Svcrentyr5,
            Anprent: oData.Term2.Anprentyr5,
            Currency: oData.Term2.Currency,
            Editable: true,
          });

          aList.push({
            Year: 6,
            Baserent: oData.Term2.Baserentyr6,
            Svcrent: oData.Term2.Svcrentyr6,
            Anprent: oData.Term2.Anprentyr6,
            Currency: oData.Term2.Currency,
            Editable: true,
          });

          var oList = JSON.parse(JSON.stringify(aList));
          this.getView().setModel(new JSONModel(oList), "termRate");
          this.getView().setModel(new JSONModel(oData.Term2), "Term");

          this.showFormDialogFragment(
            this.getView(),
            this._formFragments,
            "zsapreunit.fragments.BaseRentYrs",
            this
          );
        },

        onBaseRentDialogSave: function () {
          var oData = this.getView().getModel("termRate").getData();
          var oTerm = this.getView().getModel("Term").getData();
          
          var TBaserent = 0;
          var TCounter = 0;

          oTerm.Baserentyr1 = oData[0].Baserent;
          oTerm.Svcrentyr1 = oData[0].Svcrent;
          oTerm.Anprentyr1 = oData[0].Anprent;
          
          if (oTerm.Baserentyr1 > 0) {
            TBaserent = TBaserent + oTerm.Baserentyr1;
            TCounter = TCounter + 1;
          }

          oTerm.Baserentyr2 = oData[1].Baserent;
          oTerm.Svcrentyr2 = oData[1].Svcrent;
          oTerm.Anprentyr2 = oData[1].Anprent;

          if (oTerm.Baserentyr2 > 0) {
            TBaserent = TBaserent + oTerm.Baserentyr2;
            TCounter = TCounter + 1;
          }

          oTerm.Baserentyr3 = oData[2].Baserent;
          oTerm.Svcrentyr3 = oData[2].Svcrent;
          oTerm.Anprentyr3 = oData[2].Anprent;

          if (oTerm.Baserentyr3 > 0) {
            TBaserent = TBaserent + oTerm.Baserentyr3;
            TCounter = TCounter + 1;
          }

          oTerm.Baserentyr4 = oData[3].Baserent;
          oTerm.Svcrentyr4 = oData[3].Svcrent;
          oTerm.Anprentyr4 = oData[3].Anprent;

          if (oTerm.Baserentyr4 > 0) {
            TBaserent = TBaserent + oTerm.Baserentyr4;
            TCounter = TCounter + 1;
          }

          oTerm.Baserentyr5 = oData[4].Baserent;
          oTerm.Svcrentyr5 = oData[4].Svcrent;
          oTerm.Anprentyr5 = oData[4].Anprent;

          if (oTerm.Baserentyr5 > 0) {
            TBaserent = TBaserent + oTerm.Baserentyr5;
            TCounter = TCounter + 1;
          }

          oTerm.Baserentyr6 = oData[5].Baserent;
          oTerm.Svcrentyr6 = oData[5].Svcrent;
          oTerm.Anprentyr6 = oData[5].Anprent;

          if (oTerm.Baserentyr6 > 0) {
            TBaserent = TBaserent + oTerm.Baserentyr6;
            TCounter = TCounter + 1;
          }

          oTerm.Avgbaserent = (TBaserent / TCounter);

          _oTableManager.refreshTable();

          var oDialog = this.byId("BaseRentDialog");
          oDialog.close();

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
            var showDel3rdTerm = false;
            var sFloor = "";

            for (var i = 0; i < aIndices.length; i++) {
              var oItem = oTable.getContextByIndex(aIndices[i]).getObject();

              if (i === 0) {
                sFloor = oItem.Floor;
                if (
                  oItem.Term2mode.Main &&
                  oItem.Term2mode.Isinput &&
                  oItem.Term2mode.Hasdata &&
                  !oItem.Term2mode.Todelete
                ) {
                  
                  showDel2ndTerm = true;
                  allow2ndTerm = false;
                  _oDelItem = oItem;
                }

                console.log(oItem);
                if (
                  oItem.Term3mode.Main &&
                  oItem.Term3mode.Isinput &&
                  !oItem.Term2mode.Hasdata &&
                  oItem.Term3mode.Hasdata &&
                  !oItem.Term3mode.Todelete
                ) {
                  
                  showDel3rdTerm = true;
                  allow3rdTerm = false;
                  _oDelItem = oItem;
                }

              } else if (sFloor !== oItem.Floor) {
                allow2ndTerm = false;
                allow3rdTerm = false;
              }

              
              if (oItem.Term2mode.Hasdata) {
                allow2ndTerm = false;
              }

              if (oItem.Term3mode.Hasdata) {
                allow3rdTerm = false;
              }
            }
            
            oModel.setProperty("/showBtnDel2ndTerm", showDel2ndTerm);
            oModel.setProperty("/showBtn2ndTerm", allow2ndTerm);
            oModel.setProperty("/showBtnDel3rdTerm", showDel3rdTerm);
            oModel.setProperty("/showBtn3rdTerm", allow3rdTerm);
          } else {
            oModel.setProperty("/showBtnDel2ndTerm", false);
            oModel.setProperty("/showBtn2ndTerm", false);
            oModel.setProperty("/showBtnDel3rdTerm", false);
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

          if (aIndices.length === 1){
            var oItem = oTable.getContextByIndex(aIndices[0]).getObject();            
            if (oItem.Term1mode.Main && oItem.Term1mode.Hasdata) {
              sUnitNos =  oItem.Term1.Unitnos;

              var aTerm1Unitnos = sUnitNos.split('/');

              for(var i=0; i < aTerm1Unitnos.length; i++){
                aUnitNos.push({ Floor: oItem.Floor, Unitno: aTerm1Unitnos[i] });
              }
              
            } else {
              sUnitNos =  oItem.Unitno;
              aUnitNos.push({ Floor: oItem.Floor, Unitno: oItem.Unitno });
            }
          } else {
            for (var i = 0; i < aIndices.length; i++) {
              var oItem = oTable.getContextByIndex(aIndices[i]).getObject();            
              sUnitNos = i === 0 ? oItem.Unitno : sUnitNos + "/" + oItem.Unitno;
              aUnitNos.push({ Floor: oItem.Floor, Unitno: oItem.Unitno });
            }
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

          this._clearTableSelection();
          this._refreshTable();

          _oForm = oFUForm.getForm();

          var oModel = new JSONModel(_oForm);
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
          _oFormDialog.bindElement({ path: "/", model: "PlanFormData" });

          var oFloorUnitsCtrl = this.byId("mFloorUnits");

          var oBinding = oFloorUnitsCtrl.getBinding("suggestionItems");
          oBinding.filter([
            new Filter("Floor", FilterOperator.EQ, oItem.Floor),
            new Filter("Term2mode/Hasdata", FilterOperator.EQ, false),
          ]);         
        },

        onCreate3rdTermDialog: function (oEvent) {
          var oTable = _oTableManager.getTableControl();
          var oPlugin = oTable.getPlugins()[0];
          var aIndices = oPlugin.getSelectedIndices();

          var sUnitNos = "";
          var aUnitNos = [];
          var oFUForm = new FloorUnitForm("3", "CREATE");

          if (aIndices.length === 1){
            var oItem = oTable.getContextByIndex(aIndices[0]).getObject();            
            if (oItem.Term2mode.Main && oItem.Term2mode.Hasdata) {
              sUnitNos =  oItem.Term2.Unitnos;

              var aTerm2Unitnos = sUnitNos.split('/');

              for(var i=0; i < aTerm2Unitnos.length; i++){
                aUnitNos.push({ Floor: oItem.Floor, Unitno: aTerm2Unitnos[i] });
              }
              
            } else {
              sUnitNos =  oItem.Unitno;
              aUnitNos.push({ Floor: oItem.Floor, Unitno: oItem.Unitno });
            }
          } else {
            for (var i = 0; i < aIndices.length; i++) {
              var oItem = oTable.getContextByIndex(aIndices[i]).getObject();            
              sUnitNos = i === 0 ? oItem.Unitno : sUnitNos + "/" + oItem.Unitno;
              aUnitNos.push({ Floor: oItem.Floor, Unitno: oItem.Unitno });
            }
          }

        
          for (var i = 0; i < aIndices.length; i++) {
            var oItem = oTable.getContextByIndex(aIndices[i]).getObject();

            if (i === 0) {              
              oItem.Term3.xId = _oi18Bundle.getText("Label.SecondTerm");
              oItem.Term3.xUnitnos = aUnitNos;

              oItem.Term3mode.Main = true;
              oItem.Term3mode.Isinput = true;
              oItem.Term3mode.Hasdata = true;
              oItem.Term3mode.Todelete = false;

              oItem.Term3.Startdate = new Date(oItem.Term2.Enddate.getTime());
              oItem.Term3.Startdate.setDate(
                oItem.Term3.Startdate.getDate() + 1
              );

              oItem.Term3.Enddate = new Date(oItem.Term3.Startdate.getTime());
              oItem.Term3.Enddate.setDate(
                oItem.Term3.Enddate.getDate() + 365 * 3
              );       

              // Single Row selected and isMain
              if (aIndices.length === 1 && oItem.Term2mode.Main) {
                oItem.Term3.Areasize = oItem.Term2.Areasize;
                oItem.Term3.Uom = oItem.Term2.Uom;
                oItem.Term3.Unitnos = oItem.Term2.Unitnos;
                sUnitNos = oItem.Term2.Unitnos;
              } else {
                oItem.Term3.Areasize = 0;
                oItem.Term3.Uom = oItem.Term2.Uom;
                oItem.Term3.Unitnos = sUnitNos;
              }

              oFUForm.setMainTerm(oItem.Term3);

              oFUForm.setEditTerm(oItem.Term3);
             
            }           

            oFUForm.setTermModes(oItem.Term3mode);

          }

          this._clearTableSelection();
          this._refreshTable();

          _oForm = oFUForm.getForm();

          var oModel = new JSONModel(_oForm);
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
          _oFormDialog.bindElement({ path: "/", model: "PlanFormData" });

          var oFloorUnitsCtrl = this.byId("mFloorUnits");

          var oBinding = oFloorUnitsCtrl.getBinding("suggestionItems");
          oBinding.filter([
            new Filter("Floor", FilterOperator.EQ, oItem.Floor),
            new Filter("Term3mode/Hasdata", FilterOperator.EQ, false),
          ]);         
        },


        onUnitsChanged: function (oEvent) {
          oEvent.preventDefault();
          var oSource = oEvent.getSource();
          var sType = oEvent.getParameter("type");
          var oForm = oSource.getBindingContext("PlanFormData").getObject();

          if (sType === "removed") {
            var sFloor = oEvent
              .getParameter("removedTokens")[0]
              .getProperty("key").substring(0,2);
            var sUnitno = oEvent
              .getParameter("removedTokens")[0]
              .getProperty("text").substring(4,7);
            
            var aUnitnos = oForm.editTerm.xUnitnos;

            aUnitnos = aUnitnos.filter((el) => el.Unitno !== sUnitno);

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

            if(oForm.Editmode) {
                oForm.RemoveUnits.push( { "Floor": sFloor, "Unitno": sUnitno})
            }

            //var oModel = oSource.getBindingContext("PlanFormData").getModel();
            //oModel.setProperty("/floorUnits", oForm.floorUnits);
          
          } else if (sType === "added") {
            var aTokens = oSource.getTokens();

            var sUnitnos = aTokens
              .map(function (oToken) {
                return oToken.getKey();
              })
              .join("/");

            var aUnitnos = aTokens.map(function (oToken) {
              
              var sFloor = oToken.getKey().substring(0,2);
              var sUnitno = oToken.getText().substring(4,7);
              return { Floor: sFloor, Unitno: sUnitno };
            });
                     
            oForm.editTerm.xUnitnos = aUnitnos;
            oForm.editTerm.Unitnos = sUnitnos;            
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
          //var oItem = oModel.getProperty(sItemPath);

          var oFUForm = new FloorUnitForm("2", "EDIT");

          //_oForm.mainTerm = oTerm;
          oFUForm.setMainTerm(oTerm);
          //Copy to temporary storage for editing.

          var oTermCopy = JSON.parse(JSON.stringify(oTerm));
          oTermCopy.Startdate = _oForm.mainTerm.Startdate;
          oTermCopy.Enddate = _oForm.mainTerm.Enddate;
          oFUForm.setEditTerm(oTermCopy);
        
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
         
          _oTableManager.doSaveData(_oForm);
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
