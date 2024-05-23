import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUsGalleryComponent } from './about-us-gallery.component';

describe('AboutUsGalleryComponent', () => {
  let component: AboutUsGalleryComponent;
  let fixture: ComponentFixture<AboutUsGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutUsGalleryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutUsGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
