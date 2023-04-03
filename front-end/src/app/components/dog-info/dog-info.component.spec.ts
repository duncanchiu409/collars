import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DogInfoComponent } from './dog-info.component';

describe('DogInfoComponent', () => {
  let component: DogInfoComponent;
  let fixture: ComponentFixture<DogInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DogInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DogInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
