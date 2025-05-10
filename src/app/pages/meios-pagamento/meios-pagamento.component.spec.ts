import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeiosPagamentoComponent } from './meios-pagamento.component';

describe('MeiosPagamentoComponent', () => {
  let component: MeiosPagamentoComponent;
  let fixture: ComponentFixture<MeiosPagamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeiosPagamentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeiosPagamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
