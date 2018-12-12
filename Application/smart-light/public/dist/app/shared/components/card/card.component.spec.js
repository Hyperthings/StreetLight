"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var card_component_1 = require("./card.component");
describe('CardComponent', function () {
    beforeEach(function () { return testing_1.addProviders([card_component_1.CardComponent]); });
    it('should create the Home component', testing_1.inject([card_component_1.CardComponent], function (app) {
        expect(app).toBeTruthy();
    }));
});
//# sourceMappingURL=card.component.spec.js.map