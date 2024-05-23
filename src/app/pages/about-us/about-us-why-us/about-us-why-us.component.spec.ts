import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUsWhyUsComponent } from './about-us-why-us.component';

describe('AboutUsWhyUsComponent', () => {
  let component: AboutUsWhyUsComponent;
  let fixture: ComponentFixture<AboutUsWhyUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutUsWhyUsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutUsWhyUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
