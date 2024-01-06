sap.ui.define([
	"zsapreunit/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function(
	BaseController,
	JSONModel,
	MessageBox

) {
	"use strict";

	var oTemplt = {
		"Guid": "",
        "Floor": "",
        "Unitno": "",
        "Areasize": "",
		"Uom": "",
		"Editable": true,
		"State": {
			"Floor": "None",
			"Unitno": "None",
			"Areasize": "None",
			"Deleted": false
		}
	};
	var aIndices = null;
	var _aDeleted = [];
	var _aNewUnits = [];
	var _oi18Bundle;

	return BaseController.extend("zsapreunit.pages.controller.ManageVacantUnit", {

		_oRouter: null,
        onInit: function () {

			var oView = this.getView();
          	
			var oTableModel = new JSONModel(
			   sap.ui.require.toUrl("zsapreunit/mockdata/vacantunits.json")
			);
			
			oView.setModel(oTableModel,"form");

			var oViewModel = new JSONModel({
				"showDelete": false,
				"showSave" : false
			});

			oView.setModel(oViewModel, "viewData");

			this._oRouter = this.getRouter();
			this._oRouter
            .getRoute("ManageVacantUnit")
            .attachPatternMatched(this.__onRouteMatched, this);

        },

		__onRouteMatched: function (oEvent) {
			_oi18Bundle = this.getResourceBundle();
			
		},

		onAddUnit: function(){
			var oTableModel = this.getView().getModel("form");
			var aData = oTableModel.getData().VacantUnitSet;

			if (aData.length > 0 ){
				oTemplt.Uom = aData[0].Uom;
			} else {
				oTemplt.Uom = "SF"
			}
			
			aData.push( JSON.parse(JSON.stringify(oTemplt)))

			var aSorted = aData.sort( (a,b) => {
				return a.Guid.localeCompare(b.Guid)
			})
			

			oTableModel.setProperty("/VacantUnitSet",aSorted);

			var oView = this.getView();
			var oModel = oView.getModel("viewData");

			oModel.setProperty("/showSave",true);		

		},
		onTableSelectionChanged: function(oEvent){
			var oSource = oEvent.getSource();
			aIndices = oSource.getSelectedIndices();
			var oView = this.getView();
			var oModel = oView.getModel("viewData");

			oModel.setProperty("/showDelete",aIndices.length > 0);			
		},
		
		onDeleteUnits: function(){
			var oTableModel = this.getView().getModel("form");
			var aData = oTableModel.getData().VacantUnitSet;
									
			for(var i = aIndices.length - 1; i >= 0 ; i-- ){					
				_aDeleted.push(aData[aIndices[i]])
				aData.splice(aIndices[i],1)				

			};
			
			oTableModel.setProperty("/VacantUnitSet",aData);
			var oView = this.getView();
			var oModel = oView.getModel("viewData");

			oModel.setProperty("/showSave",true);	
						
		},
		onUnitnochanged: function(oEvent){
			//var sNewValue = oEvent.getParameter("value");
			var oData = oEvent.getSource().getBindingContext("form").getObject();
			var sPath = oEvent.getSource().getBindingContext("form").getPath();
			var oModel = oEvent.getSource().getBindingContext("form").getModel();
			oData.Guid = '#' + oData.Floor + '-' + oData.Unitno;
			
			oModel.setProperty(sPath,oData);

		},
		onSaveUnits: function(){
			var bValid = this._validate();
			if (bValid){

			} else {
				MessageBox.error(_oi18Bundle.getText("Error.NoEmpty"));
			}
		},

		_validate: function(){
			var oTableModel = this.getView().getModel("form");
			var aData = oTableModel.getData().VacantUnitSet;
			var bValid = true;

			for(var i = 0; i< aData.length; i++){
				var oUnit = aData[i];
				if (oUnit.hasOwnProperty("State")){
					if (oUnit.Areasize === ""){
						oUnit.State.Areasize = "Error"
						bValid = false
					} else {
						oUnit.State.Areasize = "None"
					}
					if (oUnit.Floor === ""){
						oUnit.State.Floor = "Error"
						bValid = false
					} else {
						oUnit.State.Floor = "None"
					}
					if (oUnit.Unitno === ""){
						oUnit.State.Unitno = "Error"
						bValid = false
					} else {
						oUnit.State.Unitno = "None"
					}
				}
			}			

			
			oTableModel.setProperty("/VacantUnitSet",aData);
			if (bValid) {
			_aNewUnits = aData.filter(Unit => {				
				return Unit.hasOwnProperty("State");
			})			
			return bValid;
		}
	}
	});
});