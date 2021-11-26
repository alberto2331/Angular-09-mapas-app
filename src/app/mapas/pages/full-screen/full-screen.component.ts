import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
     
@Component({
  selector: 'app-full-screen',
  templateUrl: './full-screen.component.html',
  styles: [`
  #mapa{
    width:100%;
    height:100%;
  }`]
})
export class FullScreenComponent implements OnInit {
  constructor() { }
  ngOnInit(): void {

  var map = new mapboxgl.Map({
      container: 'mapa', // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [-68.86978576938093 , -32.894544479735856], // starting position [lng, lat]
      zoom: 17 // starting zoom 
  }); 
}
}
