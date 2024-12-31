import { TestBed } from '@angular/core/testing';

import { CancelOrderService } from './cancel-order.service';

describe('CancelOrderService', () => {
  let service: CancelOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CancelOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
