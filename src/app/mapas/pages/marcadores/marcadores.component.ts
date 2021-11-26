import { CloneVisitor } from '@angular/compiler/src/i18n/i18n_ast';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcadorColor {
  color: string,
  marker?: mapboxgl.Marker,
  center?:[number, number]
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [`
  .mapa-container{
    width:100%;
    height:100%;
  }
  .list-group{
    position: fixed;
    top: 20px;
    right:20px;
    z-index: 99;
  }
  .list{
    cursor: pointer;
  }
`]
})
export class MarcadoresComponent implements AfterViewInit{

  @ViewChild('mapa') divMapa!:ElementRef;
  mapa!:mapboxgl.Map;
  ubicacion:[number,number]=[-68.86978576938093 , -32.894544479735856];
  zoomLevel:number=10;
  //Arreglo de marcadores:
  marcadores:MarcadorColor[]=[];
  constructor() { }

  ngAfterViewInit(): void { 
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: this.ubicacion, // starting position [lng, lat]
     zoom: this.zoomLevel
  });  
  this.leerLocalStorage();
     
  const pinFrase: HTMLElement= document.createElement('div');
  pinFrase.innerHTML ="Hola Albert"
   new mapboxgl.Marker(  {element:pinFrase}  ) 
        .setLngLat(this.ubicacion) 
        .addTo(this.mapa)
  }
  
  irMarcador(marc:MarcadorColor){ 
    this.mapa.flyTo(
      { center: marc.marker!.getLngLat()  }
    );
  }
  agregarMarcador(){
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const nuevoMarcador = new mapboxgl.Marker(  
            { draggable : true,  
             color: color}  )
      .setLngLat(this.ubicacion) //Con this.ubicacion le estoy dando al marcador la posicion actual Y 
      //TODOS LOS MARCADORES QUE CREE SE VAN A UBICAR EN ESA POSICION --> ESO HAY QUE CAMBIARLO
      .addTo(this.mapa)
      this.marcadores.push( {
        color,
        marker:nuevoMarcador    }  );

      this.guardarMarcadoresLocalStorage();
      nuevoMarcador.on('dragend',()=>{
        this.guardarMarcadoresLocalStorage();
      });
  }
  guardarMarcadoresLocalStorage(){    
    const lnglat:MarcadorColor[]=[];
    this.marcadores.forEach(   m   =>    {
      const color = m.color;
      const {lng , lat} = m.marker!.getLngLat();
    lnglat.push({
      color: color,
      center: [ lng , lat]
    });  
  })
  localStorage.setItem('marcadores', JSON.stringify(lnglat) )
  }
  leerLocalStorage(){
    if(!localStorage.getItem('marcadores')){
      return;
    }
    const lnglatArr:MarcadorColor[]= JSON.parse(localStorage.getItem('marcadores')!);
    
    lnglatArr.forEach(  m => {
      
      const newMarker = new mapboxgl.Marker({
        color:m.color,
        draggable: true
      })
      .setLngLat(m.center!)
      .addTo(this.mapa)
      this.marcadores.push({  //esto es para que persistan todos los marcadores
        marker:newMarker,
        color:m.color
      });
      newMarker.on('dragend',()=>{
        this.guardarMarcadoresLocalStorage();
      });
    });
  }

  borrarMarcador( i:number ){
    this.marcadores[i].marker?.remove(); //con esta linea BORRO EL MARCADOR DEL MAPA
    this.marcadores.splice(i,1); //Con esta borro el boton
    this.guardarMarcadoresLocalStorage(); //Con esto le aviso al localStorage
  }
}