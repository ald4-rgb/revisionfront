import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { AppComponent } from './app.component';
import { HeaderComponent } from "./header/header.component";
import {FooterComponent} from "./footer/footer.component";
import { DirectivaComponent } from './directiva/directiva.component';
import { ClientesComponent } from './clientes/clientes.component';
import { FormComponent } from './clientes/form.component';
import { PaginatorComponent } from './paginator/paginator.component';
import{ClienteService} from './clientes/cliente.service';
import {RouterModule, Routes} from '@angular/router';
import{HttpClientModule} from '@angular/common/http';
import{FormsModule, ReactiveFormsModule} from '@angular/forms'
import{registerLocaleData }from '@angular/common';
import localES from '@angular/common/locales/es-MX';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDatepickerModule} from '@angular/material/datepicker'; 
import  {MatMomentDateModule} from '@angular/material-moment-adapter';
import { DetalleComponent } from './clientes/detalle/detalle.component';
registerLocaleData(localES,'es-MX');
//definimos las rutas de cada componenete de nuestra aplicacion
/*a qui tenemos el arreglo para regiatrar las rutas crearemos una nueva entrada*/ 

//drfinimos las rutas de cada componenete de nuestra aplicacion
const routes: Routes = [

      //un phat vacio v a redirigirnos a clientes 
      {path: '',redirectTo:'/clientes',pathMatch: 'full'},
      
      {path: 'directivas',component: DirectivaComponent},
      //lo mapeamos a la ruta component
      {path:'clientes',component:ClientesComponent},
    
      {path:'clientes/page/:page',component:ClientesComponent},
    
      
      //con esto ya tenemos mapeada nuestra ruta el componente formulario
      {path:'clientes/form',component:FormComponent},

      {path:'clientes/form/:id',component:FormComponent},

     // {path:'clientes/ver/:id',component:DetalleComponent}
    ];



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
      FooterComponent,
      DirectivaComponent,
      ClientesComponent,
      FormComponent,
      PaginatorComponent,
      DetalleComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
   //importamos y con esto ya importamos nuestro modulo para trabajar con formularios
    FormsModule,
    //importamos las rutas y pasamos la constante 
   RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatDatepickerModule, 
    MatMomentDateModule

  ],
  providers: [ClienteService, {provide: LOCALE_ID, useValue: 'es-MX' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
