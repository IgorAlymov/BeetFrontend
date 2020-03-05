import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageMyCommunityComponent } from './page-my-community.component';

describe('PageMyCommunityComponent', () => {
  let component: PageMyCommunityComponent;
  let fixture: ComponentFixture<PageMyCommunityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageMyCommunityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageMyCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
