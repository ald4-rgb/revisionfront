import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import {Router,ActivatedRoute} from '@angular/router'
import swal from  'sweetalert2' 
import { Region } from './region';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  
})
export class FormComponent implements OnInit {
  constructor(public  clienteService: ClienteService, 
    public router: Router,public activatedRoute:ActivatedRoute ) { }

  public cliente:  Cliente = new Cliente()
  
  public regiones:Region[]; 

  public titulo:string = "Crear cliente"

  public  errores:string[];
  
  ngOnInit(): void {
    this.cargarCliente();
  }
   cargarCliente(): void{
    this.activatedRoute.params.subscribe(params => 
      {
      let id = params['id']  
      if (id){
        this.clienteService .getCliente(id).subscribe((cliente) => this.cliente = cliente)
      }


    });
    this.clienteService.getRegiones().subscribe(regiones => this.regiones =  regiones);
  }
  public create(): void{
    console.log(this.cliente);
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
    console.log(this.cliente);
    this.cliente.facturas= null;
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
  compararRegion(o1:Region , o2:Region):boolean{
    
    if(o1 === undefined && o2===undefined){

      return true; 
    }

    return o1 === null || o2=== null || o1===undefined || o2===undefined ?  false: o1.id===o2.id;


  }

}





