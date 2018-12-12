"use strict";
var testing_1 = require('@angular/core/testing');
var home_component_1 = require('./home.component');
describe('HomeComponent', function () {
    beforeEach(function () { return testing_1.addProviders([home_component_1.HomeComponent]); });
    it('should create the Home component', testing_1.inject([home_component_1.HomeComponent], function (app) {
        expect(app).toBeTruthy();
    }));
});
//# sourceMappingURL=home.component.spec.js.map