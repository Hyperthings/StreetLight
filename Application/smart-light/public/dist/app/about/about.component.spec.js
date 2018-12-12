"use strict";
var testing_1 = require('@angular/core/testing');
var about_component_1 = require('./about.component');
describe('AboutComponent', function () {
    beforeEach(function () { return testing_1.addProviders([about_component_1.AboutComponent]); });
    it('should create the About component', testing_1.inject([about_component_1.AboutComponent], function (app) {
        expect(app).toBeTruthy();
    }));
});
//# sourceMappingURL=about.component.spec.js.map