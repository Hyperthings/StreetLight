"use strict";
var testing_1 = require('@angular/core/testing');
var module_component_1 = require('./module.component');
describe('ModuleComponent', function () {
    beforeEach(function () { return testing_1.addProviders([module_component_1.ModuleComponent]); });
    it('should create the Home component', testing_1.inject([module_component_1.ModuleComponent], function (app) {
        expect(app).toBeTruthy();
    }));
});
//# sourceMappingURL=module.component.spec.js.map