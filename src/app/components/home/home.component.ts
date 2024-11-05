import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LabelType, Options } from '@angular-slider/ngx-slider';
import { AppService } from '../../services/app.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  @ViewChild('viewPopup') viewpopup: ElementRef | undefined;
  @ViewChild('favoritepopup') favoritepopup: ElementRef | undefined;
  appartmentList: any = [];
  loginInfo: any;
  selectedCardData: any;
  commentFormGroup!: FormGroup;
  searchText: any;
  minValue: number = 1000;
  maxValue: number = 100000;
  selectedMinValue = 1000;
  selectedMaxValue = 100000;
  orgData: any[] = [];
  filterLocation: string = 'ALL';
  isfavoriteChecked: boolean = false;
  isApplyFilter: boolean = false;
  selectedfavoriteCard: any;
  favIndex: number = 0;
  isFavSavedSuccess: boolean = false;
  options: Options = {
    floor: 0,
    ceil: 100000,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          this.selectedMinValue = value;
          return 'Min price: ' + value;
        case LabelType.High:
          this.selectedMaxValue = value;
          return 'Max price: ' + value;
        default:
          return '' + value;
      }
    },
  };
  constructor(
    private appService: AppService,
    private router: Router,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.commentFormGroup = this.fb.group({
      comment: [],
    });
    this.appartmentList = [];
    this.loginInfo = localStorage.getItem('isLogin');
    let isListAvailable = localStorage.getItem('list');
    if (!isListAvailable) {
      this.appService.getList().subscribe((res) => {
        this.orgData = res;
        this.appartmentList = res;
        localStorage.setItem('list', JSON.stringify(res));
      });
    } else {
      this.orgData = JSON.parse(isListAvailable);
      this.appartmentList = JSON.parse(isListAvailable);
    }
  }

  viewClick(data: any): void {
    if (this.viewpopup) {
      this.viewpopup.nativeElement.style.display = 'block';
    }
    if (this.loginInfo) {
      this.selectedCardData = data;
    } else {
      this.router.navigate(['login']);
    }
  }

  closePopup() {
    if (this.viewpopup) {
      this.viewpopup.nativeElement.style.display = 'none';
      this.commentFormGroup.get('comment')?.setValue('');
    }
  }

  commentSubmit(): void {
    let value = this.commentFormGroup.get('comment')?.value;
    if (value && this.viewpopup && this.selectedCardData.id) {
      this.selectedCardData.viewDetails.push({ comment: value });
      let index = this.appartmentList.findIndex(
        (ele: any) => ele.id === this.selectedCardData.id,
      );
      this.appartmentList.splice(index, 1, this.selectedCardData);
      this.commentFormGroup.get('comment')?.setValue('');
      this.viewpopup.nativeElement.style.display = 'none';
    }
  }

  applyFilter() {
    this.appartmentList = this.orgData;
    this.isApplyFilter = true;
    this.appartmentList = this.orgData.filter(
      (ele: any) =>
        ele.expectedRent >= this.selectedMinValue &&
        ele.expectedRent <= this.selectedMaxValue,
    );
    if (this.isfavoriteChecked) {
      this.appartmentList = this.appartmentList.filter(
        (ele: any) => ele.markAsFavorite === true,
      );
    }
    if (this.filterLocation == 'ALL') {
      return;
    }
    this.appartmentList = this.appartmentList.filter(
      (ele: any) => ele.location === this.filterLocation,
    );
  }

  clearFilter() {
    this.isApplyFilter = false;
    this.appartmentList = this.orgData;
    this.minValue = 1000;
    this.maxValue = 100000;
    this.selectedMinValue = 1000;
    this.selectedMaxValue = 100000;
    this.filterLocation = 'ALL';
    if (this.filterLocation === 'ALL') {
      this.appartmentList = this.orgData;
    } else {
      this.appartmentList = this.appartmentList.filter(
        (ele: any) => ele.location === this.filterLocation,
      );
    }
    if (this.isfavoriteChecked) {
      this.applyFvorites();
    }
  }

  applyFvorites() {
    this.appartmentList = this.orgData;
    if (this.isfavoriteChecked) {
      this.appartmentList = this.orgData.filter(
        (ele: any) => ele.markAsFavorite === true,
      );
      if (this.isApplyFilter) {
        this.appartmentList = this.appartmentList.filter(
          (ele: any) =>
            ele.expectedRent >= this.selectedMinValue &&
            ele.expectedRent <= this.selectedMaxValue,
        );
        if (this.filterLocation == 'ALL') {
          return;
        }
        this.appartmentList = this.appartmentList.filter(
          (ele: any) => ele.location === this.filterLocation,
        );
      }
    } else {
      if (this.isApplyFilter === true) {
        this.applyFilter();
      } else {
        this.clearFilter();
      }
    }
  }

  favoriteClicked(data: any, index: number): void {
    if (this.favoritepopup) {
      this.favIndex = index;
      this.selectedfavoriteCard = data;
      this.favoritepopup.nativeElement.style.display = 'block';
    }
  }

  favNoClicked(): void {
    this.favClosePopup();
  }

  favYesClicked(): void {
    this.selectedfavoriteCard.markAsFavorite = true;
    this.isFavSavedSuccess = true;
    let isListAvailable: any = localStorage.getItem('list');
    isListAvailable = JSON.parse(isListAvailable);
    isListAvailable.splice(this.favIndex, 1, this.selectedfavoriteCard);
    localStorage.removeItem('list');
    localStorage.setItem('list', JSON.stringify(isListAvailable));
    setTimeout(() => {
      this.isFavSavedSuccess = !this.isFavSavedSuccess;
      this.favClosePopup();
    }, 2000);
  }

  favClosePopup() {
    if (this.favoritepopup) {
      this.selectedfavoriteCard = {};
      this.favoritepopup.nativeElement.style.display = 'none';
    }
  }
}
