import { TestBed } from '@angular/core/testing';

import { NuevoeventoService } from './nuevoevento.service';

describe('NuevoeventoService', () => {
  let service: NuevoeventoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NuevoeventoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
