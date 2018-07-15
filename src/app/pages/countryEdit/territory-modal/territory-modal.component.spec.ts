import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerritoryModalComponent } from './territory-modal.component';

describe('TerritoryModalComponent', () => {
  let component: TerritoryModalComponent;
  let fixture: ComponentFixture<TerritoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerritoryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerritoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
