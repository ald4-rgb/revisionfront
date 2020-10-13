
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import swal from 'sweetalert2';
import{catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

/** Pass untouched request through to the next request handler. */
/**a partir de a qui manejamos la respuesta  este interceptor menjamos 
 * la respuesta en el antoerior estabamos manejando el request 
 * cuando enviamos los datos  ahora cuando recibimos 
 * validamos los cidgos http   501 y 403
 * entonces con pipe por que vamos a requerir el operador catcherror
 * .pipe(
        catchError(e=>{metemos los status ocn sus errores 
        retornamos el throwError (e)}) _ y a qui tenemos lista
        la impelementacion del interceptor   
        manejando el eror 401 pregunta si esta autenticado 
        y es a si realiza elloout
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    
    constructor(private authService:AuthService, private router:Router){} 

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    
  
      return next.handle(req).pipe(
        catchError(e=>{
          if(e.status == 401 ){
            /*y a qui retornamos true es decir que no esta autorizado   
            pero ademos tenemos que regdirigir a la pagina del login
            entonces utilizando el metodo  router.navigate(['pasamosla/ruta'])*/
            
            if(this.authService.isAuthenticated()){
              
              this.authService.logout();
            }
        
        
            this.router.navigate(['/login']);

           }
           if(e.status == 403){
            /*y a qui retornamos true es decir que no esta autorizado   
            pero ademos tenemos que regdirigir a la pagina del login
            entonces utilizando el metodo  router.navigate(['pasamosla/ruta'])*/
            swal.fire('Acceso denegado',`Lociento ${this.authService.usuario.username} no tienes acceso`,'warning')
             this.router.navigate(['/clientes']);
            
           } 

          return catchError(e);

        })


      );
          
  }
}