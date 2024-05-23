import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUsGalleryAlbumComponent } from './about-us-gallery-album.component';

describe('AboutUsGalleryAlbumComponent', () => {
  let component: AboutUsGalleryAlbumComponent;
  let fixture: ComponentFixture<AboutUsGalleryAlbumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutUsGalleryAlbumComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutUsGalleryAlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
