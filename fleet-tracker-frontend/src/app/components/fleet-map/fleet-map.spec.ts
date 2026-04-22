import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetMap } from './fleet-map';

describe('FleetMap', () => {
  let component: FleetMap;
  let fixture: ComponentFixture<FleetMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FleetMap],
    }).compileComponents();

    fixture = TestBed.createComponent(FleetMap);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
