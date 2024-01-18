import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewRegisterComponent } from './modal-new-register.component';

describe('ModalNewRegisterComponent', () => {
  let component: ModalNewRegisterComponent;
  let fixture: ComponentFixture<ModalNewRegisterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalNewRegisterComponent]
    });
    fixture = TestBed.createComponent(ModalNewRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
