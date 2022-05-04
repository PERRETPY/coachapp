import { TestBed } from '@angular/core/testing';

import { SheetidGuardService } from './sheetid-guard.service';

describe('SheetidGuardService', () => {
  let service: SheetidGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SheetidGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
