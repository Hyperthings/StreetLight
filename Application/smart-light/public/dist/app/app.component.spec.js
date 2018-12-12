"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var app_component_1 = require("./app.component");
describe('AppComponent', function () {
    beforeEach(function () { return testing_1.addProviders([app_component_1.AppComponent]); });
    it('should create the app component', testing_1.inject([app_component_1.AppComponent], function (app) {
        expect(app).toBeTruthy();
    }));
});
//# sourceMappingURL=app.component.spec.js.map