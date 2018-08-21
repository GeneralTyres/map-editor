import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceTextModalComponent } from './reference-text-modal.component';

describe('ReferenceTextModalComponent', () => {
  let component: ReferenceTextModalComponent;
  let fixture: ComponentFixture<ReferenceTextModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferenceTextModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceTextModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
