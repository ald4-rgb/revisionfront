import { Component, OnInit } from '@angular/core';
import { Factura } from './models/factura';
import { ClienteService } from '../clientes/cliente.service';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, flatMap} from 'rxjs/operators';
import { FacturaService } from './services/factura.service';
import { Producto } from './models/producto';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ItemFactura } from './models/item-factura';
@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html'
})
export class FacturasComponent implements OnInit {

  titulo:string ='Nueva Factura';

  factura:Factura = new Factura();
  
  autoCompleteControl = new FormControl();
  productos: string[] = ['Laptop', 'celular', 'Lg',"Sony","Samsung"];
  productosFiltrados: Observable<Producto[]>;


  constructor(private clienteService:ClienteService, private activatedRoute:ActivatedRoute
    ,private facturaService:FacturaService,private router:Router) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params =>{
      let clienteId = +params.get('clienteId');
      this.clienteService.getCliente(clienteId).subscribe( cliente =>  this.factura.cliente = cliente );
    });
    this.productosFiltrados = this.autoCompleteControl.valueChanges
      .pipe(
        
        map(value =>  typeof value === 'string'? value: value.nombre ),
        flatMap(value => value ? this._filter(value): [])
      );
  }

  
 
  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();

    return this.facturaService.filtrarProductos(filterValue);
  }
  mostrarNombre(producto?: Producto):string | undefined{

    return producto? producto.nombre: undefined;
  }

  seleccionarProducto(event:MatAutocompleteSelectedEvent): void{

    let producto = event.option.value as Producto;
    console.log(producto);

    if(this.existeItem(producto.id)){

      this.incrementaCantidad(producto.id);
    }else{
      
      let nuevoItem = new ItemFactura();
      nuevoItem.producto = producto;
      this.factura.items.push(nuevoItem);
    }



    this.autoCompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();

  }

  acualizarCantidad(id:number,event:any): void{

    let cantidad:number = event.target.value as number;
    if(cantidad == 0){
      return this,this.eliminaritemFactura(id);
    }
    this.factura.items = this.factura.items.map((item:ItemFactura) =>{
      
      if(id == item.producto.id){

        item.cantidad = cantidad;
      }
      return item;
    });

  }

  existeItem(id:number):boolean{

    let existe = false;
    this.factura.items.forEach((item:ItemFactura) =>{
      if(id === item.producto.id ){
        existe = true;
      }
    });
    return existe;
  }
  
  incrementaCantidad(id:number):void{
    this.factura.items = this.factura.items.map((item:ItemFactura) =>{

      if(id == item.producto.id){

        ++item.cantidad ;
      }
      return item;
    });

  }
  eliminaritemFactura(id:number):void{

    this.factura.items = this.factura.items.filter((item: ItemFactura) =>id !== item.producto.id);

  }

  create(facturaForm):void{
  
   //Mostrar el json los datos de la factura
    console.log(this.factura);
  
    if(this.factura.items.length == 0){

      this.autoCompleteControl.setErrors({'invalid':true});
    }
      
    if(facturaForm.valid && this.factura.items.length > 0){

 

    this.facturaService.create(this.factura).subscribe(factura =>{
      this.router.navigate(['/clientes']);
      
      });
    }
  }


}
