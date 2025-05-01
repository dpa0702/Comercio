import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { MatPaginatorIntl } from '@angular/material/paginator';
import { getPortuguesePaginatorIntl } from './components/mat-paginator-intl-pt/mat-paginator-intl-pt';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {
      provide: MatPaginatorIntl,
      useFactory: () => getPortuguesePaginatorIntl()
    }
  ]
};
