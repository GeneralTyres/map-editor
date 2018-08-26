import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapItemModalComponent } from './map-item-modal.component';

describe('MapItemModalComponent', () => {
  let component: MapItemModalComponent;
  let fixture: ComponentFixture<MapItemModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapItemModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
