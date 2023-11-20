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
          var oModel = new JSONModel(
            sap.ui.require.toUrl("zsapreunit/mockdata/floors.json")
          );

          var oObjectPage = this.byId("FUPlannerLayout");

          oObjectPage.addEventDelegate(
            {
              onAfterRendering: function () {
                var aSection = oObjectPage.getSections();

                if (aSection) {
                  for (var i = 0; i < aSection.length; i++) {
                    var oSection = aSection[i];
                    var sTitle = oSection.getTitle();

                    var oSubSection = oSection.getSubSections()[0];
                    var oTable = oSubSection.getBlocks()[0];

                    oTable.bindAggregation("rows", {
                      path: "/" + sTitle,
                    });
                  }
                }
              },
            },
            this
          );

          this.getView().setModel(oModel);

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

          var iIndices = oPlugin.getSelectedIndices();

          
          if (iIndices.length > 0) {          
            var allow2ndTerm = true;
            var allow3rdTerm = true;

            for(var i=0;i<iIndices.length;i++){
              
              var oItem = oTable.getContextByIndex(iIndices[i]).getObject();
             
                if (oItem.Term2.Startdate !== "" ){
                  allow2ndTerm = false ;                  
                }

                if (oItem.Term3.Startdate !== "" ){            
                  
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

        onGotoFirstColumn: function(){
          
          
        },

        onExit: function() {
                    
          this.removeFragment(this._formFragments);
    
        }
      }
    );
  }
);
