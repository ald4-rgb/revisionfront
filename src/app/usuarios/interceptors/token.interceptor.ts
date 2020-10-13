
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

/** Pass untouched request through to the next request handler. */
@Injectable()

/**Para obetener el tooken  necesitamos inyectar 
 * la clase authService en el constructor
 * constructor(private authService:AuthService){} -> 
 * inyeccion de la clase para obetener el token de accesso
 * ahora obtenemos el token
 *     let token = this.authService.token; -> obtencion del token
 *     tal como lo teniamos en la clase cliente.service.ts
 *     preguntamos si token es distinto o igual a null
 *     entonces si es distinto de null pasamos el token 
 *     en las cabeceras , entonces agregamos
 *     las cabeceras para obtener nuestro token
 *      const authReq = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + token)
          }); -> pasamos el tokken junto con Bearer tal como lo teniamos 
          en cliente.service 
 *entocnes implementamos este     
     return next.handle(authReq);-> lo que hace ir  al proximo  interceptor 
     dentro del stack o conjunto de interceptores que tengamos hasta 
     llegar al ultimo
     Nota 
     El objeto reuqest tambien es inmutable por lo tanto tenemos
     que clonar una nueva instancia del request  y  modifciarla 
     **/
export class TokenInterceptor implements HttpInterceptor {
    
    constructor(private authService:AuthService){} 

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    
    let token = this.authService.token;
    if(token != null){
      
        const authReq = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + token)
          });
          
          console.log('TokenInterceptor => Bearer ' + token)
          return next.handle(authReq);
           
      }
   
      return next.handle(req);
          
  }
}