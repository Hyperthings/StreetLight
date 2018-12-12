"use strict";
var testing_1 = require('@angular/core/testing');
var project_component_1 = require('./project.component');
describe('ProjectComponent', function () {
    beforeEach(function () { return testing_1.addProviders([project_component_1.ProjectComponent]); });
    it('should create the Home component', testing_1.inject([project_component_1.ProjectComponent], function (app) {
        expect(app).toBeTruthy();
    }));
});
//# sourceMappingURL=project.component.spec.js.map