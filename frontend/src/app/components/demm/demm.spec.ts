import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Demm } from './demm';

describe('Demm', () => {
  let component: Demm;
  let fixture: ComponentFixture<Demm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Demm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Demm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
