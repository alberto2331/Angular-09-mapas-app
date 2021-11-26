import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';


@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [`
  .mapa-container{
    width:100%;
    height:100%;
  }
  .row{
    background-color: white;
    border-radius: 5px;
    bottom: 50px;
    left: 50px;
    padding: 10px;
    position: fixed;
    z-index: 999;
    width: 400px;
  }`
  ]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy{
  zoomLevel:number=10;
  @ViewChild('mapa') divMapa!:ElementRef;
  constructor() { }
  ngOnDestroy(): void { //aca tengo que destruir cada uno de los listeners que estoy usando el off
    this.mapa.off('zoom', ()=>{});
    this.mapa.off('zoomend', ()=>{});
    this.mapa.off('move', ()=>{});
  }
  mapa!:mapboxgl.Map;
  ubicacion:[number,number]=[-68.86978576938093 , -32.894544479735856];
  ngAfterViewInit(): void { 
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: this.ubicacion, // starting position [lng, lat]
     zoom: this.zoomLevel
  });
    this.mapa.on('zoom' , () => {
      this.zoomLevel= this.actualZoom;
    })
    this.mapa.on('zoomend' , () => {
      if(this.mapa.getZoom()>18){
        this.mapa.zoomTo(18); //el zoomTo sirve para setear un nivel de zoom
      }
    })
    this.mapa.on('move' , (ev) => { //aca si recomiendan usar el "evento"
      const objeto = ev.target;      
      const {lng , lat} = objeto.getCenter(); //con los {} extraigo los valores del objeto
      this.ubicacion=[lng,lat];
    })
  }
  get actualZoom(): number {
    return this.mapa.getZoom();
  }

  zoomCambio(valor:string){  //el "zoomInput.value" que envía el html es de tipo string
    this.mapa.zoomTo(Number(valor)) //con "Number()" convierto a numero el string "valor"
  }
  zoomOut(){
    this.mapa.zoomOut();
  }
  zoomIn(){
    this.mapa.zoomIn();
  }
}







