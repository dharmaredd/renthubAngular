import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AddApartmentComponent } from './add-apartment.component';
import { ElementRef } from '@angular/core';

describe('AddApartmentComponent', () => {
  let component: AddApartmentComponent;
  let fixture: ComponentFixture<AddApartmentComponent>;
  let routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddApartmentComponent],
      imports: [ReactiveFormsModule],
      providers: [FormBuilder, { provide: Router, useValue: routerSpy }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddApartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize apartmentForm with required controls and validators', () => {
    expect(component.apartmentForm).toBeDefined();
    expect(component.apartmentForm.get('name')?.valid).toBeFalse();
    expect(component.apartmentForm.get('name')?.errors).toEqual({
      required: true,
    });
    expect(component.apartmentForm.get('squareFeet')?.validator).toBeTruthy();
    expect(component.apartmentForm.get('expectedRent')?.validator).toBeTruthy();
  });

  it('should populate amenities list on initialization', () => {
    component.ngOnInit();
    expect(component.amentiesData).toEqual([
      'Gym/Fitness Center',
      'Swimming Pool',
      'Car Park',
      'Visitors Parking',
      'Power Backup',
      'Garbage Disposal',
      'Private Lawn',
      'Water Heater',
      'Plant Security System',
      'Laundry Service',
      'Elevator',
      'Club House',
    ]);
  });

  it('should call localStorage on proceed and save data', () => {
    const mockList = [{ id: 1, name: 'Sample Apartment' }];
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockList));
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'removeItem');

    component.proceed();

    expect(localStorage.getItem).toHaveBeenCalledWith('list');
    expect(localStorage.removeItem).toHaveBeenCalledWith('list');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'list',
      jasmine.any(String),
    );
    expect(component.saveMsg).toBeTrue();
  });

  it('should navigate back to home on close', () => {
    component.close();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should disable form and display preview on submit', () => {
    component.mymodel = {
      nativeElement: {
        style: { display: 'none' },
      },
    } as ElementRef;

    component.onSubmit();
    expect(component.previewForm.disabled).toBeTrue();
    expect(component.mymodel.nativeElement.style.display).toBe('block');
  });

  it('should hide preview when closePopup is called', () => {
    component.mymodel = {
      nativeElement: {
        style: { display: 'block' },
      },
    } as ElementRef;

    component.closePopup();
    expect(component.mymodel.nativeElement.style.display).toBe('none');
  });
});
