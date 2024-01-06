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
    var _oParams;

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
            isDirty: false,
            isBusy: false,
            noRows: sap.ui.Device.resize.height > 800 ? 22: 15
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
            .getRoute("FloorUnitPlanner")
            .attachPatternMatched(this.__onRouteMatched, this);
        },

        __onRouteMatched: function (oEvent) {
          _oi18Bundle = this.getResourceBundle();

          _oParams = oEvent.getParameter("arguments");
         
          //var oThis = this;

          // $("#container-zsapreunit---FloorUnitPlanner--planTable-vsb").scroll(function() { 
          //   oThis._tableCellsColor();
          // });

          // var oTableControl = _oTableManager.getTableControl();
          // var oVsb = oTableControl._getScrollExtension().getVerticalScrollbar();
          // oVsb.scroll(function() { 
          //      console.log("screolll");
          // });
  

          this._getTableData();          
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
                
                if (!oItem.Term2mode.Hasdata){
                  allow3rdTerm = false; 
                }

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
                
                if (
                  oItem.Term3mode.Main &&
                  oItem.Term3mode.Isinput &&                  
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
                var sUnitno = aTerm1Unitnos[i].substring(4,7);
                aUnitNos.push({ Floor: oItem.Floor, Unitno: sUnitno, Editable: (i !== 0) });
              }
              
            } else {
              sUnitNos =  oItem.Unitno;
              aUnitNos.push({ Floor: oItem.Floor, Unitno: oItem.Unitno });
            }
          } else {
            for (var i = 0; i < aIndices.length; i++) {
              var oItem = oTable.getContextByIndex(aIndices[i]).getObject();            
              sUnitNos = i === 0 ? "#" + oItem.Floor + "-" + oItem.Unitno : sUnitNos + "/" + "#" + oItem.Floor + "-" + oItem.Unitno;
              aUnitNos.push({ Floor: oItem.Floor, Unitno: oItem.Unitno, Editable: (i !== 0) });
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
                var sUnitno = aTerm2Unitnos[i].substring(4,7);
                aUnitNos.push({ Floor: oItem.Floor, Unitno: sUnitno, Editable: (i !== 0) });
              }
              
            } else {
              sUnitNos =  oItem.Unitno;
              aUnitNos.push({ Floor: oItem.Floor, Unitno: oItem.Unitno });
            }
          } else {
            for (var i = 0; i < aIndices.length; i++) {
              var oItem = oTable.getContextByIndex(aIndices[i]).getObject();            
              //sUnitNos = i === 0 ? oItem.Unitno : sUnitNos + "/" + oItem.Unitno;
              sUnitNos = i === 0 ? "#" + oItem.Floor + "-" + oItem.Unitno : sUnitNos + "/" + "#" + oItem.Floor + "-" + oItem.Unitno;              
              aUnitNos.push({ Floor: oItem.Floor, Unitno: oItem.Unitno, Editable: (i !== 0) });
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

            var sKey = oEvent
              .getParameter("removedTokens")[0]
              .getProperty("key");
            var sFloor = oEvent
              .getParameter("removedTokens")[0]
              .getProperty("key").substring(1,3);
            var sUnitno = oEvent
              .getParameter("removedTokens")[0]
              .getProperty("text").substring(4,7);

            var aUnitnos = oForm.editTerm.xUnitnos;

            aUnitnos = aUnitnos.filter((el) => el.Unitno !== sUnitno);

            var sUnitnos = "";

            for (var i = 0; i < aUnitnos.length; i++) {
              if (i === 0) {
                sUnitnos = "#" +aUnitnos[i].Floor + "-" + aUnitnos[i].Unitno;
              } else {
                sUnitnos = sUnitnos + "/" + "#" +aUnitnos[i].Floor + "-" + aUnitnos[i].Unitno;
              }
            }
            oForm.editTerm.xUnitnos = aUnitnos;
            oForm.editTerm.Unitnos = sUnitnos;                        

            if(oForm.Mode === 'EDIT') {
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

            var aUnitnos = aTokens.map((oToken,index) => {
              
              var sFloor = oToken.getKey().substring(1,3);
              var sUnitno = oToken.getText().substring(4,7);
              return { Floor: sFloor, Unitno: sUnitno, Editable: (index !== 0)};
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
                this._deleteTerm(_oDelItem,"2");
              }
            }.bind(this),
          });
        },

        onDelete3rdTermDialog: function () {
          MessageBox.confirm(_oi18Bundle.getText("Confirm.Delete3rdTerm"), {
            actions: ["Yes", "No"],
            emphasizedAction: "Yes",
            onClose: function (sAction) {
              if (sAction === "Yes") {
                this._deleteTerm(_oDelItem,"3");
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

        // onDisplayTermDialog: function (oEvent) {
        //   var oSource = oEvent.getSource();
        //   var sItemPath = oSource.getBindingContext("tableData").getPath();
          
        //   var oModel = oSource.getModel("tableData");
        //   var sTerm = sItemPath + "/Term1";
        //   var oTerm = oModel.getProperty(sTerm);
        //   var sTermMode = sItemPath + "/Term1mode";
        //   var oTermMode = oModel.getProperty(sTermMode);
          
        //   var aTerm1Unitnos = oTerm.Unitnos.split('/');

        //   var aUnitNos = [];

        //   for(var i=0; i < aTerm1Unitnos.length; i++){
        //     var sFloor = aTerm1Unitnos[i].substring(1,3);
        //     var sUnitno = aTerm1Unitnos[i].substring(4,7);
        //     aUnitNos.push({ Floor: sFloor, Unitno: sUnitno, Editable: (i !== 0) });
        //   }
        //   oTerm.xId = _oi18Bundle.getText("Label.FirstTerm");
        //   oTerm.xUnitnos = aUnitNos;

        //   var oFUForm = new FloorUnitForm("1", "READ");
        //   oFUForm.setMainTerm(oTerm);
        //   oFUForm.setEditTerm(oTerm);
          

        //   _oForm = oFUForm.getForm();
        //   _oForm.termModes.push(oTermMode);
                    

        //   var oFormModel = new JSONModel(_oForm);

          
        //   this.getView().setModel(oFormModel, "PlanFormData");
        

        //   if (_oFormDialog) {
        //     _oFormDialog.open();
        //   } else {
        //     _oFormDialog = this.showFormDialogFragment(
        //       this.getView(),
        //       this._formFragments,
        //       "zsapreunit.fragments.PlanFormDialog",
        //       this
        //     );
        //   }

        // },
        onEditTermDialog: function (oEvent) {
          var oSource = oEvent.getSource();

          
          var sItemPath = oSource.getBindingContext("tableData").getPath();

          var sPath = "";
          if (oSource.getBindingInfo("text")) 
             sPath = oSource.getBinding("text").getPath();
          else
            sPath = oSource.getBinding("number").getPath();
         
          if (!sPath) {
            var aBindings = oSource.getBinding("text").getBindings();
            sPath = aBindings[0].getPath();
          }

          var sTermno = sPath.match(/(\d+)/)[1];
          

          sPath = sPath.replace(/\/.+$/, "");
          var sTerm = sItemPath + "/" + sPath;

          var oModel = oSource.getModel("tableData");
          var oTerm = oModel.getProperty(sTerm);

          var sTermMode = sItemPath + "/" + sPath + "mode";
          var oTermMode = oModel.getProperty(sTermMode);
          
          
          var aTerm1Unitnos = oTerm.Unitnos.split('/');

          var aUnitNos = [];

          for(var i=0; i < aTerm1Unitnos.length; i++){
            var sFloor = aTerm1Unitnos[i].substring(1,3);
            var sUnitno = aTerm1Unitnos[i].substring(4,7);
            aUnitNos.push({ Floor: sFloor, Unitno: sUnitno, Editable: (i !== 0) });
          }
          oTerm.xUnitnos = aUnitNos;


          var oFUForm = new FloorUnitForm(sTermno,  oTermMode.Isinput ? "EDIT" : "READ");
                    
          oFUForm.setMainTerm(oTerm);
          oFUForm.setTermModes(oTermMode);

          _oForm = oFUForm.getForm();          
          
          //Copy to temporary storage for editing.

          var oTermCopy = JSON.parse(JSON.stringify(oTerm));
          oTermCopy.Startdate = _oForm.mainTerm.Startdate;
          oTermCopy.Enddate = _oForm.mainTerm.Enddate;
          oFUForm.setEditTerm(oTermCopy);
          
          
        
          
          
          //console.log(_oForm);

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
          
          if (_oForm.Mode === 'CREATE') {
            
            var oItem = _oForm.termModes;
            oItem.Main = false;
            oItem.Isinput = false;
            oItem.Startdate = null;
            oItem.Hasdata = false;
            
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
          var oDate = _oLink.getBinding("text").getValue();
          var oDP = this.getView().byId("HiddenDP");
          oDP.setDateValue(oDate);

          oDP.openBy(_oLink.getDomRef());
        },

        onDateChanged: function (oEvent) {
          var sValue = oEvent.getParameter("value");
          var oDate = new Date(sValue);
          var sItemPath = _oLink.getBindingContext("tableData").getPath();

          var sPath = _oLink.getBinding("text").getPath();

          var oModel = this.getView().getModel("tableData");
          oModel.setProperty(sItemPath + "/" + sPath, oDate);
        },

        onGotoFirstColumn: function () {

          var oTableControl = _oTableManager.getTableControl();
          var oHsb = oTableControl._getScrollExtension().getHorizontalScrollbar();
          oHsb.scrollLeft = 0;
          
        },

        onUploadToServer: function(){
          

          MessageBox.confirm(_oi18Bundle.getText("Confirm.UploadData"), {
            actions: ["Yes", "No"],
            emphasizedAction: "Yes",
            onClose: function (sAction) {
              if (sAction === "Yes") {
                this._uploadData();
              }
            }.bind(this),
          });

         
        },

        _uploadData: function(){
          var aUploadData = _oTableManager.getUploadData();
          console.log(aUploadData);
        },

        _getTableData: function () {

          var oModel = this.getView().getModel();
          var oViewModel = this.getView().getModel("viewData");

          var aFilters = [];
          aFilters.push(
            new Filter("Bukrs", FilterOperator.EQ, _oParams.Bukrs)
          );
          aFilters.push(
            new Filter("Busentity", FilterOperator.EQ, _oParams.Busentity)
          );
          aFilters.push(
            new Filter("Contrtype", FilterOperator.EQ, _oParams.Contrtype)
          );
          aFilters.push(
            new Filter("Keydate", FilterOperator.EQ, _oParams.Keydate)
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

                this._tableHeaderColor();               

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

        _tableHeaderColor: function(){
          var oTableControl = _oTableManager.getTableControl();
          var aColumns = oTableControl.getColumns();

          for(var i = 10; i < 18; i++ ) {
            aColumns[i].$().addClass("green");
          }

          for(var i = 18; i < aColumns.length ; i++ ) {
            aColumns[i].$().addClass("yellow");
          }
        },

        _tableCellsColor:function(){
          var oTableControl = _oTableManager.getTableControl();

          var rowCount = oTableControl.getVisibleRowCount();
          console.log(rowCount);
          //var rowStart = rowCount * ( oTableControl._oPaginator.getCurrentPage() - 1);

          for (var i = 0; i < rowCount; i++) {
            oTableControl.getRows()[i].$().removeClass("green");        
            oTableControl.getRows()[i].$().addClass("green");                 
          }

        },

        _doTableSave: function () {

          var oModel = this.getView().getModel("viewData");

          oModel.setProperty("/isDirty", true);
                    
          _oTableManager.saveFormData(_oForm);
        },

        _deleteTerm: function (oItem,sTermno) {
          var bDone = _oTableManager.deleteTerm(oItem,sTermno);

          if (bDone) {
            _oTableManager.clearTableSelection();
            _oTableManager.refreshTable();
          }

          var aUploadData = _oTableManager.getUploadData();
          if (aUploadData.length < 1){
            var oModel = this.getView().getModel("viewData");
            oModel.setProperty("/isDirty",false);
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
