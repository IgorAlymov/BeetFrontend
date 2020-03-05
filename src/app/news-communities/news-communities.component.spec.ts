import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsCommunitiesComponent } from './news-communities.component';

describe('NewsCommunitiesComponent', () => {
  let component: NewsCommunitiesComponent;
  let fixture: ComponentFixture<NewsCommunitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsCommunitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsCommunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
