sap.ui.define(
  ["zsapreunit/controller/BaseController", "sap/ui/model/json/JSONModel"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (BaseController, JSONModel) {
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
            "MMM-YYYY": "MMM-YYYY"                  
          });
          
          var oView = this.getView();
          oView.setModel(oViewModel,"viewData");
        },


        onShowT1Detail: function (oEvent) {

          var oSource = oEvent.getSource();
          var sPath = oSource.getBindingContext().getPath();
          var oData = oSource.getBindingContext().getObject();

          console.log(oData);
          var oBaseRent = {
              "Yr1": ""
          };
          
          var oPopover = this.showPopOverFragment(this.getView(), oSource, this._formFragments, "zsapreunit.fragments.BaseRentYrs", this);
          //console.log(oPopover);
          oPopover.bindElement(sPath);
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
