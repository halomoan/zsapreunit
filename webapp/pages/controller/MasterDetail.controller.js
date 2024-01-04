sap.ui.define([    
    "zsapreunit/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController,Filter,FilterOperator) {
        "use strict";

        return BaseController.extend("zsapreunit.pages.controller.MasterDetail", {
            onInit: function () {
                this._oRouter = this.getRouter();
                this._oRouter.getRoute("RouteMainView").attachPatternMatched(this.__onRouteMatched, this);
            },

            onToggleSideNavPress: function(){
                var oToolPage = this.byId("toolPage");
                var bSideExpanded = oToolPage.getSideExpanded();
    
                this._setToggleButtonTooltip(bSideExpanded);
    
                oToolPage.setSideExpanded(!oToolPage.getSideExpanded());

            }, 

            onSideMenuSelect: function(oEvent){
                var oItem = oEvent.getParameter("item"),
                    //oCtx = oItem.getBindingContext(),
                    //sMenu = oItem.getText(),
                    sTarget = oItem.getTarget();

               
                    
                switch(sTarget){
                    case "G001:RECNPLAN":			
                        this._oRouter.navTo("RouteMainView"); break;
                    case "G001:VACANTUNITS":	
                    console.log(sTarget)		
                        this._oRouter.navTo("ManageVacantUnit"); break;	
                    case "G002:RPTRANGE":	
                        this._oRouter.navTo("rptrange"); break;	
                    case "SAPG1:PLANT":			
                        this._oRouter.navTo("planttopurchorg"); break;
                    default:
                        this._oRouter.navTo("notFound");break;
                }
            },

            onFixMenuSelect: function(oEvent){
                var oItem = oEvent.getParameter("item"),
                    sTarget = oItem.getTarget();
            
                        
                switch(sTarget){
                    case "GROUP":			
                        this._oRouter.navTo("recipegroup"); break;
                    case "LOCATION":
                        this._oRouter.navTo("recipeloc"); break;
                        
                    default:
                        this._oRouter.navTo("notFound");break;
                }		
                        
            },
            __onRouteMatched: function(oEvent){
               // this._refreshSloorUnit(); 
                   
            },

            _setToggleButtonTooltip: function(bLarge) {
                var oToggleButton = this.byId('sideNavigationToggleButton');
                if (bLarge) {
                    oToggleButton.setTooltip('Expand');
                } else {
                    oToggleButton.setTooltip('Collapse');
                }
            },

            _refreshSloorUnit: function(){
                

                var aFilter = [
                    new Filter("Bukrs", FilterOperator.EQ, "1001"),
                    new Filter("Busentity", FilterOperator.EQ, "00001001"),
                    new Filter("Contrtype", FilterOperator.EQ, "L002"),
                    new Filter("Keydate", FilterOperator.EQ, this.getKeyDate()),
                ];

                var oList = sap.ui.core.Fragment.byId("container-zsapreunit---UnitsPlannerBase","sfloorunit");

                
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFilter, "Application");                
            },
            onOpen: function(){
                // forward compact/cozy style into Dialog
			    jQuery.sap.syncStyleClass(oView.getController().getOwnerComponent().getContentDensityClass(), oView, oDialog);
            }
        });
    });
