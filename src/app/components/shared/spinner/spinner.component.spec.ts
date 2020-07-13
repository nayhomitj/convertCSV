import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerComponent } from './spinner.component';
import { DebugElement } from '@angular/core';

describe('SpinnerComponentComponent', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;
  let debugElement: DebugElement;
  let element: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    element = debugElement.nativeElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
