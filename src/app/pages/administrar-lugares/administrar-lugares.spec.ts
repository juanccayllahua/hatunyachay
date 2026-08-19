import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarLugares } from './administrar-lugares';

describe('AdministrarLugares', () => {
  let component: AdministrarLugares;
  let fixture: ComponentFixture<AdministrarLugares>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrarLugares],
    }).compileComponents();

    fixture = TestBed.createComponent(AdministrarLugares);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
