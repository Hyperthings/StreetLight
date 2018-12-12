"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var modal_component_1 = require("./modal.component");
describe('ModalComponent', function () {
    beforeEach(function () { return testing_1.addProviders([modal_component_1.ModalComponent]); });
    it('should create the Home component', testing_1.inject([modal_component_1.ModalComponent], function (app) {
        expect(app).toBeTruthy();
    }));
});
//# sourceMappingURL=modal.component.spec.js.map