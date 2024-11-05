import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-apartment',
  templateUrl: './add-apartment.component.html',
  styleUrl: './add-apartment.component.scss',
})
export class AddApartmentComponent implements OnInit {
  @ViewChild('preview') mymodel: ElementRef | undefined;
  apartmentForm!: FormGroup;
  previewForm!: FormGroup;
  amentiesData!: string[];
  saveMsg: boolean = false;
  privewImg: string = '';
  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.getAmentiesList();
    this.apartmentForm = this.fb.group({
      id: [],
      apartmentName: ['selectOption'],
      name: ['', Validators.required],
      location: ['', Validators.required],
      sharedProperty: [false],
      streetAddress: ['', Validators.required],
      squareFeet: [, [Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
      leaseType: ['', Validators.required],
      expectedRent: [, [Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
      negoiable: [false],
      priceMode: ['', Validators.required],
      furnished: [false],
      img: [''],
      amenities: this.fb.group({}),
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(1400)]],
      markAsFavorite: [false],
      viewDetails: this.fb.array([]),
    });
    this.previewForm = this.apartmentForm;
    this.amentiesData.forEach((option) => {
      (this.apartmentForm.get('amenities') as FormGroup).addControl(
        option,
        this.fb.control(false),
      );
    });
  }

  getAmentiesList(): void {
    this.amentiesData = [
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
    ];
  }

  onSubmit(): void {
    if (this.mymodel) {
      this.previewForm = this.apartmentForm;
      let actualData = this.apartmentForm.getRawValue();
      this.previewForm.get('name')?.setValue(actualData.name);
      this.previewForm.get('apartmentName')?.setValue(actualData.apartmentName);
      this.previewForm
        .get('sharedProperty')
        ?.setValue(actualData.sharedProperty);
      this.previewForm.get('streetAddress')?.setValue(actualData.streetAddress);
      this.previewForm.get('squareFeet')?.setValue(actualData.squareFeet);
      this.previewForm.get('leaseType')?.setValue(actualData.leaseType);
      this.previewForm.get('expectedRent')?.setValue(actualData.expectedRent);
      this.previewForm.get('negoiable')?.setValue(actualData.negoiable);
      this.previewForm.get('priceMode')?.setValue(actualData.priceMode);
      this.previewForm.get('furnished')?.setValue(actualData.furnished);
      this.previewForm.get('amenities')?.setValue(actualData.amenities);
      this.previewForm.get('title')?.setValue(actualData.title);
      this.previewForm.get('img')?.setValue(actualData.img);
      this.previewForm.get('description')?.setValue(actualData.description);
      this.privewImg = actualData.img;
      this.previewForm.disable();
      this.previewForm.updateValueAndValidity();
      this.mymodel.nativeElement.style.display = 'block';
    }
  }

  close(): void {
    this.privewImg = '';
    this.router.navigate(['/']);
  }

  closePopup(): void {
    if (this.mymodel) {
      this.mymodel.nativeElement.style.display = 'none';
    }
  }

  proceed(): void {
    let isListAvailable: any = localStorage.getItem('list');
    isListAvailable = JSON.parse(isListAvailable);
    this.apartmentForm.value.id = isListAvailable.length + 1;
    isListAvailable.push(this.apartmentForm.value);
    localStorage.removeItem('list');
    localStorage.setItem('list', JSON.stringify(isListAvailable));
    this.saveMsg = true;
    setTimeout(() => {
      this.saveMsg = !this.saveMsg;
      this.close();
    }, 3000);
    if (this.mymodel) {
      this.mymodel.nativeElement.style.display = 'none';
    }
  }

  onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.apartmentForm.get('img')?.setValue(event?.target?.result);
      };
    }
  }
}
