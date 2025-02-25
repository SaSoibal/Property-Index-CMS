import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPropertyFormsComponent } from '././request-property-forms.component';

describe('RequestPropertyFormsComponent', () => {
  let component: RequestPropertyFormsComponent;
  let fixture: ComponentFixture<RequestPropertyFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestPropertyFormsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestPropertyFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
