import {addProviders, inject} from '@angular/core/testing';

import {NavbarComponent} from './navbar.component';

describe('NavbarComponent', () => {
    beforeEach(() => addProviders([NavbarComponent]));

    it('should create the Home component', inject([NavbarComponent], (app: NavbarComponent) => {
        expect(app).toBeTruthy();
    }));
});
