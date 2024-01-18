import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditRegisterComponent } from './modal-edit-register.component';

describe('ModalEditRegisterComponent', () => {
  let component: ModalEditRegisterComponent;
  let fixture: ComponentFixture<ModalEditRegisterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalEditRegisterComponent]
    });
    fixture = TestBed.createComponent(ModalEditRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
