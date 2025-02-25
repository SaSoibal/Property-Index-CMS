import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoProjectComponent } from './demo-project.component';

describe('DemoProjectComponent', () => {
  let component: DemoProjectComponent;
  let fixture: ComponentFixture<DemoProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemoProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
