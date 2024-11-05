import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AppService],
    });

    service = TestBed.inject(AppService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch apartment list data', () => {
    const mockData = [
      { id: 1, name: 'Apartment A', location: 'Location A' },
      { id: 2, name: 'Apartment B', location: 'Location B' },
    ];

    service.getList().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpTestingController.expectOne(
      '../assets/json/appartment-list.json',
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch login data', () => {
    const mockLoginData = {
      username: 'testUser',
      roles: ['admin', 'user'],
    };

    service.getLoginData().subscribe((data) => {
      expect(data).toEqual(mockLoginData);
    });

    const req = httpTestingController.expectOne(
      '../assets/json/login-data.json',
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockLoginData);
  });
});
