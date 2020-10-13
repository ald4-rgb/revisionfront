import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import{ModalService}from './modal.service';
import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { AuthService } from '../../usuarios/auth.service';
import { FacturaService } from '../../facturas/services/factura.service';
import { Factura } from '../../facturas/models/factura';
import Swal from 'sweetalert2';
//importamos la clace service ya que tenemos que buscar al lciente por su id
@Component({
  /**la idea es subir una foto por cliente por lo tanto  nececesitamos el id del cliente */
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  
  //etonces a qui estamso inyectando y colocando la inxtancia  del cliente detlles compoenent  
  @Input() cliente:Cliente;
  
  //a la clace de detalle commpoenent vamos a tener un atributo  titulo
  titulo:string =  "Detalle del cliente";
  /*a qui solo tendremos un atributo private ya que es un atributo que solousaremos en la clace
  detalles compoenent  cuando es ne la vista lo dejamos como publico y si lo tenemos en component
  lo dejamos com private
  */
  public fotoSeleccionada: File;  
  public progreso:number = 0; 
  
/**lo sigueinte es inyectarclienteService  via constructor tambien activamos 
 * el activare route ya que lo nececitamos igual como se hacia con el paginador
  para editar un cliente nececitamos este compoenente para poder suscrbir
  cuando cambia le parametro del id */
  constructor(private ClienteServicete: ClienteService,
     public facturaService:FacturaService ,                            
     public authService:AuthService
    ,public modalService:ModalService  
    ) { }
  ngOnInit(): void {    }
    
    seleccionarFoto(event){
      this.fotoSeleccionada = event.target.files[0]
       this.progreso = 0; 
    
      console.log(this.fotoSeleccionada);
       if(this.fotoSeleccionada.type.indexOf('image') < 0){
        swal.fire('Error seleccionar imagen ','El archivo debe ser del tipo imagen   ','error');
         //reiniciamos 
         this.fotoSeleccionada = null; 

       }
      

    }
    subirFoto(){
    
      if(!this.fotoSeleccionada){
          
        swal.fire('Error  Upload: ','debe seleccionar una imagen no debe ser  archivo,formato mp3 ni mp4'
        ,'error');
  
      }else{

      this.ClienteServicete.subirFoto(this.fotoSeleccionada,  this.cliente.id).
      subscribe(event =>  {
        if(event.type === HttpEventType.UploadProgress ){
          this.progreso = Math.round((event.loaded/event.total)*100)

        }else if(event.type === HttpEventType.Response){
          let response:  any = event.body;
          this.cliente =  response.cliente as Cliente;

          this.modalService.notificarUpload.emit(this.cliente);
          swal.fire('La foto se ha subido completamente !',response.mensaje,'success' ); 
        
        }
        
        
      });
    }
  }
  cerrarModal(){

    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;

  }
  
  delete(factura:Factura):void{
    
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Seguro que deseas borrarlo?',
      text: `¿Seguro que desea eliminar la factura ${factura.descripcion} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: ' Si ,Eliminalo!',
      
      cancelButtonText: 'No,cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this.facturaService.delete(factura.id).subscribe(
        
          
        response =>{ 
          this.cliente.facturas = this.cliente.facturas.filter(f => f !== factura)      
          swalWithBootstrapButtons.fire(
          'Factura  eliminada',
          `Factura ${factura.descripcion}  eliminada con exito `,
          'success'
            )  
          }
        
        )
        
      }
    
    } )


  }





  }

/**ActivatedRoute entonces atravez del metodo ngOnInit o evento cuando se inicializa 
 * el comepoenente  vamos a suscribir cando cambia el parametro   del id  para poder 
 * obetener  el detalle  cleinte 
 */


  /* this.activatedRoute.paramMap.subscribe(params =>{
    con el signo +podemos convertir el id+ en un tipo number osea id=+ =>number forma inplicita
        forma explicita: id:number =+ */
   /* let id:number = +params.get('id');*/
    /**si el id existe a travez de la clace service obtenemso al cliente y 
     * lo asignamos al atributo cliente y le pasamos el paramtro y con .suscribe
     * obetenemos el cilente por argumento  y hacemos algo con el 
     * lo vamos  suscribir y pasamos el objeto cliente que tenemos del suscribe 
     * del observable y se lo pasamos al this.cliente a qui hay que implementar
     * la subirda de archivo  dos metodos  uno cuando  se selecciona el aricho
     * y otro cuando se sube  haciendo click en el boton 
     */
/*    if(id){
      this.ClienteServicete.getCliente(id).subscribe(cliente =>{
        this.cliente = cliente;
      });
    } 
 });*/
