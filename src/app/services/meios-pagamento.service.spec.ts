import { TestBed } from '@angular/core/testing';

import { MeiosPagamentoService } from './meios-pagamento.service';

describe('MeiosPagamentoService', () => {
  let service: MeiosPagamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeiosPagamentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
