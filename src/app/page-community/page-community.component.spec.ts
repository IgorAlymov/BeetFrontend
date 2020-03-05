import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCommunityComponent } from './page-community.component';

describe('PageCommunityComponent', () => {
  let component: PageCommunityComponent;
  let fixture: ComponentFixture<PageCommunityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageCommunityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
