sap.ui.define(
  ["zsapreunit/controller/BaseController", "sap/ui/model/json/JSONModel",	"sap/m/MessageToast"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (BaseController, JSONModel,MessageToast) {
    "use strict";

    return BaseController.extend(
      "zsapreunit.pages.controller.FloorUnitPlanner",
      {
        _formFragments: {},        

        onInit: function () {

          this.oTableModel = new JSONModel(
            sap.ui.require.toUrl("zsapreunit/mockdata/floors.json")
          );          

          this.getView().setModel(this.oTableModel);

          var oViewModel = new JSONModel({                    
            "MMM-YYYY": "MMM-YYYY",
            "showBtn2ndTerm": false,
            "showBtn3rdTerm": false                  
          });
          
          var oView = this.getView();
          oView.setModel(oViewModel,"viewData");
        },


        onShowT1Baserent: function (oEvent) {

          var oSource = oEvent.getSource();
          var sPath = oSource.getBindingContext().getPath();
          var oData = oSource.getBindingContext().getObject();

   
          
          var oPopover = this.showPopOverFragment(this.getView(), oSource, this._formFragments, "zsapreunit.fragments.BaseRentYrsChg", this);
          
          oPopover.bindElement(sPath);
          
          // var oNav = sap.ui.core.Fragment.byId("container-zsapreunit---FloorUnitPlanner","baserentnv");
          // var oChg = sap.ui.core.Fragment.byId("container-zsapreunit---FloorUnitPlanner","baserentchg");          
          // oNav.to(oChg,"show");
          

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

         

          // var oDateInstance = sap.ui.core.format.DateFormat.getDateInstance({
          //   pattern:  this.DATEFORMAT
          // });


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

          console.log(oForms);
          
        },

        onGotoFirstColumn: function(){
          
          
        },

        onExit: function() {
                    
          this.removeFragment(this._formFragments);
    
        }
      }
    );
  }
);
