import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPropertyFormsComponent } from './add-property-forms.component';

describe('AddPropertyFormsComponent', () => {
  let component: AddPropertyFormsComponent;
  let fixture: ComponentFixture<AddPropertyFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPropertyFormsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPropertyFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
