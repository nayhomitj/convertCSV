import { TestBed, inject } from '@angular/core/testing';
import { HttpEvent, HttpEventType } from '@angular/common/http';

import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { UiService } from './ui.service';

describe('UiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
  });

  it('should be created', () => {
    const service: UiService = TestBed.get(UiService);
    expect(service).toBeTruthy();
  });
});
