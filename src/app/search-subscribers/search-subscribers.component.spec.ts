import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSubscribersComponent } from './search-subscribers.component';

describe('SearchSubscribersComponent', () => {
  let component: SearchSubscribersComponent;
  let fixture: ComponentFixture<SearchSubscribersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchSubscribersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSubscribersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
