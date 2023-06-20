import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MapService } from '../service/map.service';
import * as urlUtils from '@arcgis/core/core/urlUtils';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import MapView from '@arcgis/core/views/MapView';

@Component({
  selector: 'app-secure-map',
  templateUrl: './secure-map.component.html',
  styleUrls: ['./secure-map.component.scss']
})
export class SecureMapComponent implements OnInit {

  @ViewChild("mapPanel", { static: true }) mapPanel: ElementRef;

  constructor(private mapService: MapService) { }

  ngOnInit(): void {

    urlUtils.addProxyRule({
      urlPrefix: "https://gisserv1.cdg.co.th/arcgis/rest/services/AtlasX/AtlasX_Secure/MapServer",
      proxyUrl: "https://localhost:5001/api/appproxy"
    })

    this.mapService.createMap(this.mapPanel.nativeElement);

    this.mapService.mapView = new MapView({
      container: this.mapService.mapView.container,
      map: this.mapService.map,
      center: [100.523186, 13.736717], //Bangkok Coordinates
      zoom: 14,
    });

    const atlasxLayer = new MapImageLayer({
      url: "https://gisserv1.cdg.co.th/arcgis/rest/services/AtlasX/AtlasX_Secure/MapServer"
    })

    this.mapService.map.add(atlasxLayer);
  }

}
