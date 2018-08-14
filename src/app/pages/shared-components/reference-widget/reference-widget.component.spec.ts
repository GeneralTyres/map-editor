import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceWidgetComponent } from './reference-widget.component';

describe('ReferenceWidgetComponent', () => {
  let component: ReferenceWidgetComponent;
  let fixture: ComponentFixture<ReferenceWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferenceWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
