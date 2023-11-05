sap.ui.define(
    [        
        "zsapreunit/controller/BaseController"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("zsapreunit.controller.App", {
        onInit() {
          this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
        }
      });
    }
  );
  