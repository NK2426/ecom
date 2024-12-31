import { TestBed } from '@angular/core/testing';

import { OrderstatusService } from './orderstatus.service';

describe('OrderstatusService', () => {
  let service: OrderstatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderstatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
