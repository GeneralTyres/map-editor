import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraitManagementComponent } from './path-type-management.component';

describe('TraitManagementComponent', () => {
  let component: TraitManagementComponent;
  let fixture: ComponentFixture<TraitManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraitManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraitManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
