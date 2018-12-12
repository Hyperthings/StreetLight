"use strict";
var testing_1 = require('@angular/core/testing');
var testcase_component_1 = require('./testcase.component');
describe('TestcaseComponent', function () {
    beforeEach(function () { return testing_1.addProviders([testcase_component_1.TestcaseComponent]); });
    it('should create the Home component', testing_1.inject([testcase_component_1.TestcaseComponent], function (app) {
        expect(app).toBeTruthy();
    }));
});
//# sourceMappingURL=testcase.component.spec.js.map