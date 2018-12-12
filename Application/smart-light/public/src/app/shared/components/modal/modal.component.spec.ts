import {addProviders, inject} from '@angular/core/testing';

import {ModalComponent} from './modal.component';

describe('ModalComponent', () => {
    beforeEach(() => addProviders([ModalComponent]));

    it('should create the Home component', inject([ModalComponent], (app: ModalComponent) => {
        expect(app).toBeTruthy();
    }));
});
