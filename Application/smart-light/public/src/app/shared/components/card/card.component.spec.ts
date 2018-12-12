import {addProviders, inject} from '@angular/core/testing';

import {CardComponent} from './card.component';

describe('CardComponent', () => {
    beforeEach(() => addProviders([CardComponent]));

    it('should create the Home component', inject([CardComponent], (app: CardComponent) => {
        expect(app).toBeTruthy();
    }));
});
