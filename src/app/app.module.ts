import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { NavMenuComponent } from '../app/shared/nav-menu/nav-menu.component';

import { RestServiceService } from '../app/services/rest-service.service';
import { ModalService } from '../app/services/modal-service.service';
import { HomeComponent } from './pages/home/home.component';
import { CotizarComponent } from './pages/cotizar/cotizar.component';

import { RestrictInputDirective } from './directives/restrict-input.directive';


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CotizarComponent,
    RestrictInputDirective,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    NgbModule,
    NgbPaginationModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'cotizar', component: CotizarComponent },
    ])
  ],
  providers: [
    RestServiceService,
    ModalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
