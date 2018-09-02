import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapItemManagementComponent } from './path-management.component';

describe('MapItemManagementComponent', () => {
  let component: MapItemManagementComponent;
  let fixture: ComponentFixture<MapItemManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapItemManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapItemManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
