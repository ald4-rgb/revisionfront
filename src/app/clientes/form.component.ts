import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import {Router,ActivatedRoute} from '@angular/router'
import swal from  'sweetalert2' 
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  
})
export class FormComponent implements OnInit {

  /*por lo tanto el formulario esta asignado
  y mapeado a un objeto este objeto es un atributo*/ 
  //creamos el atributo cliente+
 //inyectamos el create
 /*debemos tener un atributo un arreglo que contenga mensajes de errores
 del tipo string*/ 
  constructor(public  clienteService: ClienteService, 
    public router: Router,public activatedRoute:ActivatedRoute ) { }

  public cliente:  Cliente = new Cliente()
  
  public titulo:string = "Crear cliente"

  public  errores:string[];
  
  ngOnInit(): void {
    this.cargarCliente();
  }
 /*asignala respuesta al atributo cliente la respuesta que seria del back end*/ 
   cargarCliente(): void{
//suscrbimos un observador que esta boservando cuando tenemos el id cuanodo se lo pasemos por parametro
    this.activatedRoute.params.subscribe(params => 
      {
      let id = params['id']  
  //obtenemos si el id existe utilizando al clace clienteService
      if (id){
        this.clienteService .getCliente(id).subscribe((cliente) => this.cliente = cliente)
      
      
      }


    })

  }
  
  /*como segundo parámetro podemos suscribir a un boservador y manejar cuando las cosas salen mal
    error que seria  el atributo de este objeto error que contiene el json y en el json
    pasamos los errores dentro del parametro errors */
  public create(): void{
    
    this.clienteService.create(this.cliente).
    subscribe( cliente => { 
      this.router.navigate(['/clientes'])
      swal.fire('Nuevo cliente' , `Ha sido creado con exito  ${cliente.nombre} `,'success')
      },
      err =>{
        this.errores = err.error.errors as string[]
        console.error('Código del error desde back end:'+ err.status);
        console.error(err.error.errors);
      }     
      )
    
  }

   public update(): void{ 

    this.clienteService.update(this.cliente).
    subscribe( json  => {
      
      this.router.navigate(['/clientes'])
      swal.fire('Nuevo cliente' , `${json.mensaje}: ${json.cliente.nombre}  `,'success')
      },
      err =>{
        this.errores = err.error.errors as string[]
        console.error('Código del error desde back end:'+ err.status);
        console.error(err.error.errors);
      } 
    )
  }


}





//imprimimos
   
    //invocamos el metodo create del service
    //vamos a pasar el objeto cliete y vamos a suscribir
    //a qui irira la respuesta una vez creado el objeto va a crear la respuesta que va 
    //a contener los nuevos datos 
   /*despues el meotdo create se va a conectar al api-rest  y va a percistir el 
    objeto que enviemos a travez de formulario */
