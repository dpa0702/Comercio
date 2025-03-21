import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/pages/login/login.component';
import { HomeComponent } from './app/pages/home/home.component';
import { ClientesComponent } from './app/pages/clientes/clientes.component';
import { ProdutosComponent } from './app/pages/produtos/produtos.component';
import { PedidosComponent } from './app/pages/pedidos/pedidos.component';
import { AuthGuard } from './app/guards/auth-guard.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/interceptors/auth-interceptor.service';
import { PedidoFormComponent } from './app/pages/pedidos/pedido-form/pedido-form.component';
import { MeiosPagamentoComponent } from './app/pages/meios-pagamento/meios-pagamento.component';
import { FuncionariosComponent } from './app/pages/funcionarios/funcionarios.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'home', 
    component: HomeComponent,
    canActivate: [AuthGuard], // Protege a home
    children: [
      { path: 'clientes', component: ClientesComponent, canActivate: [AuthGuard] },
      { path: 'produtos', component: ProdutosComponent, canActivate: [AuthGuard] },
      { path: 'pedidos', component: PedidosComponent, canActivate: [AuthGuard] },
      { path: 'pedidos/pedidos-form', component: PedidoFormComponent, canActivate: [AuthGuard] },
      { path: 'funcionarios', component: FuncionariosComponent, canActivate: [AuthGuard] },
      { path: 'meios-pagamento', component: MeiosPagamentoComponent, canActivate: [AuthGuard] },
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
  ]
}).catch(err => console.error(err));
