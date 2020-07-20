import { Injectable } from '@angular/core';
import {CLIENTES} from "./clientes.json";
import { Cliente } from './cliente';
import  { of,Observable,throwError, observable } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { HeaderComponent } from '../header/header.component';
import{map,catchError} from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
 
@Injectable() 
export class ClienteService {
//este aoperador se encarga de intersepar el bosebavle lo intersepta en busca de fallas 
//definimos url como un atributo de clase 
  private urlEndPoint:string = 'http://localhost:8080/api/clientes';

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json' })

  constructor(private http: HttpClient, private router:  Router ) { }
 
  getClientes():Observable<Cliente[]>{

      //El metodo pipe nos permite agregar mas operadores
    return this.http.get(this.urlEndPoint).pipe(
      //En resumen se toma la respuesta que viene en un formato json 
      //el tipo de datos de dato generico es un tipo any 
      // y a qui tomamos esta variable response lo convertimos a un listado 
      //la funcion que parece una flecha es usado para crear funciones anonimas
      //arrow function 
      map(response => response as Cliente[])
    
      );
  }

//implementamos el metodo create que va recibir el objeto cliente json


  create(cliente: Cliente):Observable<Cliente> {
    /*va a retornar el nuvo cliente que se quedo en el servidor*/
    //map(  (response : any) => response.cliente as Cliente),
    return this.http.post(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      map((response:any) => response.cliente as Cliente),
      catchError(e  => {
         console.error(e.error.mensaje);
         swal.fire(e.error.mensaje,e.error.error,'error');
         return throwError(e);
      })
    );  
  }


  getCliente(id: any):Observable<Cliente>{
  
    //signo String con las comillas invertidad  son de interpolacion nunca olvidar el tipo de retrono
    //usaremos catcherror  

    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e  =>{
        console.error(e.error.mensaje);
        this.router.navigate(['/clientes']);
        Swal.fire('Error al editar',e.error.mensaje, 'error')
        return throwError(e);
      })
    );


  }

update(cliente: Cliente):Observable<any>{

return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente,{headers: this.httpHeaders}).pipe(

    catchError(e  => {
      console.error(e.error.mensaje);
      swal.fire(e.error.mensaje,e.error.error,'error');
      return throwError(e);
   })
  );

}

  delete(id: number): Observable<Cliente>{

    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`,
    {headers: this.httpHeaders}).pipe(
      catchError(e  => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
     })

      );

} 
 
 
 
 
  //creamos un metodo para utilizar la inyeccion de dependencias
 
  //una forma
  /* getClientes():Observable<Cliente[]>{

    //el objeto http y el metodo get  siempre va a restornar un objeto del tipo observable 
    //por lo tanto de la promesa en el cuerpo de la resputa va a devolver un tipo json 
    //justo con esto hacemos un cast 
    return this.http.get<Cliente[]>(this.urlEndPoint)
    
    //Nota cuando sea un metodo siemrpe retrona en mayusculas 
   // return of(CLIENTES);

  }*/


}
