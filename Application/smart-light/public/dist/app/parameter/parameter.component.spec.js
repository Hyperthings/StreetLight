"use strict";
var testing_1 = require('@angular/core/testing');
var parameter_component_1 = require('./parameter.component');
describe('ParameterComponent', function () {
    beforeEach(function () { return testing_1.addProviders([parameter_component_1.ParameterComponent]); });
    it('should create the Home component', testing_1.inject([parameter_component_1.ParameterComponent], function (app) {
        expect(app).toBeTruthy();
    }));
});
//# sourceMappingURL=parameter.component.spec.js.map