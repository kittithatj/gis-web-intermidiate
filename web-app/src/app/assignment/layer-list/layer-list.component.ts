import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import LayerList from "@arcgis/core/widgets/LayerList.js";
import { MapService } from '../service/map.service';
import TileLayer from '@arcgis/core/layers/TileLayer.js';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import GroupLayer from "@arcgis/core/layers/GroupLayer.js";

@Component({
  selector: 'app-layer-list',
  templateUrl: './layer-list.component.html',
  styleUrls: ['./layer-list.component.scss']
})
export class LayerListComponent implements OnInit {

  @ViewChild("mapPanel", { static: true }) mapPanel: ElementRef;

  oceanBaseMapUrl = 'https://services.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer';
  censusMapUrl = 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer';

  constructor(private mapService: MapService) { }

  ngOnInit(): void {
    this.mapService.createMap(this.mapPanel.nativeElement);

    let layerList = new LayerList({
      view: this.mapService.mapView
    });
    this.mapService.mapView.ui.add(layerList, {
      position: "top-right"
    });

    const oceanBaseMapLayer = new TileLayer({
      url: this.oceanBaseMapUrl
    })

    const censusMapLayer0 = new FeatureLayer({
      url: this.censusMapUrl + '/0'
    })
    const censusMapLayer2 = new FeatureLayer({
      url: this.censusMapUrl + '/2'
    })
    const censusMapLayer3 = new FeatureLayer({
      url: this.censusMapUrl + '/3'
    })
    const censusMapLayer1 = new FeatureLayer({
      url: this.censusMapUrl + '/1'
    })
    const censusMapLayer = new GroupLayer({
      layers: [censusMapLayer0, censusMapLayer1, censusMapLayer2, censusMapLayer3],
      title: 'Census'
    })

    this.mapService.map.addMany([censusMapLayer, oceanBaseMapLayer]);

  }

}
