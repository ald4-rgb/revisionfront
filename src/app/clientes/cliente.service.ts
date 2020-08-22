import { Injectable } from '@angular/core';
import{formatDate,DatePipe }from '@angular/common';//importaremos formatdate que se incluye  en angular 9.0.7
import {CLIENTES} from "./clientes.json";
import { Cliente } from './cliente';
import  { of,Observable,throwError, observable } from 'rxjs';
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from '@angular/common/http'
import { HeaderComponent } from '../header/header.component';
import{map,catchError,tap } from 'rxjs/operators';
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
 
  getClientes(page: number):Observable<any>{

      //El metodo pipe nos permite agregar mas operadores
    return this.http.get(this.urlEndPoint+'/page/'+ page).pipe(
      //En resumen se toma la respuesta que viene en un formato json 
      //el tipo de datos de dato generico es un tipo any 
      // y a qui tomamos esta variable response lo convertimos a un listado 
      //la funcion que parece una flecha es usado para crear funciones anonimas
      //arrow function 
      /*map_cinvierte del tipo object tipo dato base a un tipo cliente corchete 
      let: es parte del lenguaje emac scrip 6 que permite definir dentro 
      de una variable local, recordemos que el objeto map tienes 
      que retornar el objeto mmodificado vamos a retornar modificando sus valores
      para ello tenemos que modificar o utilizar el metodo map tambien pero en 
      este caso es el metodo map del arreglo clientes*/ 
      
      /*entonces para resumir  el primer return s par el map de clientes
      y el segundo es para  el operador map del flujo 
      forEach: no toca los valores simplemente va mostrando datos*/
      
      tap((response: any) => {

        
        console.log('Cli  enteService: tap1'); 
        (response.content  as Cliente[]).forEach( cliente => {

          console.log(cliente.nombre);
        }

        )
      }),
      //vamos a retornar el response que teien el arreglo clientes tambien va a contener los otros parametros
      map( (response : any) => {
        
         (response.content as Cliente[]).map(cliente => {
              cliente.nombre =  cliente.nombre.toUpperCase();
              //creamos instancia   
              let datePipe =  new DatePipe('es-MX'); 
              //cliente.createAt = datePipe.transform(cliente.createAt,' dd/MMMM/yyyy'); //formatDate(cliente.createAt,'dd-MM-yyyy','en-Us');
              return cliente;  
          });
          return response;
        } ),
        tap(response => {
          console.log('ClienteService: tap2');
          (response.content as Cliente[]).forEach( cliente => {
  
            console.log(cliente.nombre);
          }
  
          )
        }),
  
  
    
      );
  }

//implementamos el metodo create que va recibir el objeto cliente json


  create(cliente: Cliente):Observable<Cliente> {
    /*va a retornar el nuvo cliente que se quedo en el servidor*/
    //map(  (response : any) => response.cliente as Cliente),
/*a qui hay que pregutnar si el error del status es 400 = badrequest*/
    return this.http.post(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      map((response:any) => response.cliente as Cliente),
      catchError(e  => {
        //tenemos que preguntar si es 400 viene de la validacion retpornamos el error
        //para que el componenete se envargue de manejar este error en el metodo suscribe
        //capturamos el error y pasamos estos errores a la platilla
         if(e.status==400) {
          return throwError(e);
         }

        
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

      if(e.status==400) {
        return throwError(e);
       }
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
  /** creamos nuestro emotod para subir la foto en el backend utilizando nuestra
   * api-rest pero tenemos que encviar utilizando FormData con sorporte multipart/form-data(enctype)
   * para eso tenemoes que usar la clace de java script formData:esta es una clace de javascript
   * que es nativa  por lo tanto no se tiene  que importar solo la utilizamos
   * formData.append("tiene que coincidir con lo que pisimos en ",back end simepre);
   * entonces en vez de enviar el cliente como lo estabamos haciendo  en create.editar o update
   * a qui enciavmos el formData y a qui tenemos que manejar el obnsebable 
   * del tipo cliente para poder obetener  el cliente modificado con la foto la nueva foto 
   * y poder mostrar esta foto entonces para convertir nuestro flujo para que sea el tipo cliente
   * entonces utlizamos el pipe  y dentro del pipe el operador map y tambien manejar el error
   * con catchError en el map se va a eimitir un respone con json
   * por lo tanto siemrpe recordar que estamos accediendo a este atributo cliente que retorna un json
   * para convertir un obeserbable de cliente			   
   * ----------------------------------------------------
   * subireos la foto con una barra de progreso para aumentar 
   * la experiencia del usario 
   */
   subirFoto(archivo: File, id):Observable<HttpEvent<{}>>{
    
      let formData = new FormData();
      formData.append("archivo",archivo);
      formData.append("id",  id);
      
      const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
        reportProgress: true
      });
    //etonces a qui en eel request pasamos el request
    /** y todo esto del ipe lo pdemos quitar  ya que en vez de retornar
     * un boservable cliente vamos a retornar un event  con el prograso  */ 
      return this.http.request(req);

    
  
    }
  /*
    Metodo pipe subri foto 
    .pipe(
        map((response : any) =>  response.cliente as  Cliente),
        catchError(e  => {
          console.error(e.error.mensaje);
          swal.fire(e.error.mensaje,e.error.error,'error');
          return throwError(e);
       })
      )
  
  
  
  */ 
 
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
