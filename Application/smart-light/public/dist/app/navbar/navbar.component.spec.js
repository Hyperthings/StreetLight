"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var navbar_component_1 = require("./navbar.component");
describe('NavbarComponent', function () {
    beforeEach(function () { return testing_1.addProviders([navbar_component_1.NavbarComponent]); });
    it('should create the Home component', testing_1.inject([navbar_component_1.NavbarComponent], function (app) {
        expect(app).toBeTruthy();
    }));
});
//# sourceMappingURL=navbar.component.spec.js.map