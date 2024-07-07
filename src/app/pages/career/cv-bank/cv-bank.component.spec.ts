import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvBankComponent } from './cv-bank.component';

describe('CvBankComponent', () => {
  let component: CvBankComponent;
  let fixture: ComponentFixture<CvBankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CvBankComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CvBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
