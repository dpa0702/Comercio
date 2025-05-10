import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeioPagamentoFormComponent } from './meio-pagamento-form.component';

describe('MeioPagamentoFormComponent', () => {
  let component: MeioPagamentoFormComponent;
  let fixture: ComponentFixture<MeioPagamentoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeioPagamentoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeioPagamentoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
