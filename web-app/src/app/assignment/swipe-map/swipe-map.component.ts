import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MapService } from '../service/map.service';
import Swipe from "@arcgis/core/widgets/Swipe.js";
import TileLayer from '@arcgis/core/layers/TileLayer.js';

@Component({
  selector: 'app-swipe-map',
  templateUrl: './swipe-map.component.html',
  styleUrls: ['./swipe-map.component.scss']
})
export class SwipeMapComponent implements OnInit {

  @ViewChild("mapPanel", { static: true }) mapPanel: ElementRef;

  oceanBaseMapUrl = 'https://services.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer';
  worldStreetMapUrl = 'https://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer';

  constructor(private mapService: MapService) { }

  ngOnInit(): void {
    this.mapService.createMap(this.mapPanel.nativeElement);

    const oceanBaseMapLayer = new TileLayer({
      url: this.oceanBaseMapUrl
    })

    const worldStreetMapLayer = new TileLayer({
      url: this.worldStreetMapUrl
    })

    let swipe = new Swipe({
      view: this.mapService.mapView,
      leadingLayers: [oceanBaseMapLayer],
      trailingLayers: [worldStreetMapLayer],
      direction: "horizontal",
      position: 50
    });

    this.mapService.map.addMany([oceanBaseMapLayer, worldStreetMapLayer]);

    this.mapService.mapView.ui.add(swipe);
  }

}
