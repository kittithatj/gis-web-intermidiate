import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { MapService } from '../service/map.service';
import Polygon from '@arcgis/core/geometry/Polygon';

@Component({
  selector: 'app-query-task',
  templateUrl: './query-task.component.html',
  styleUrls: ['./query-task.component.scss']
})
export class QueryTaskComponent implements OnInit {

  @ViewChild('mapPanel', { static: true }) mapPanel: ElementRef;

  mapLayerUrl = 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/2';
  states: any[] = [];
  selectedState: number;

  constructor(private mapService: MapService) { }

  ngOnInit(): void {
    this.mapService.createMap(this.mapPanel.nativeElement);
    const layer = new FeatureLayer({
      url: this.mapLayerUrl,
      opacity: 0.5
    });
    this.mapService.map.add(layer);

    const query = layer.createQuery();
    query.where = "1=1";
    query.outFields = ["objectid ", "state_name", "state_abbr", "sub_region"];
    query.returnGeometry = true;

    layer.queryFeatures(query).then((results) => {
      const features = results.features;
      this.states = features.map((feature) => {
        return {
          id: feature.attributes.objectid,
          sub_region: feature.attributes.sub_region,
          state_name: feature.attributes.state_name,
          state_abbr: feature.attributes.state_abbr,
          geometry: feature.geometry,
        }
      })
      console.log(this.states);
    });
  }

  onDataRowClick(state) {
    this.selectedState = state.id;
    console.log(state);

    this.mapService.mapView.extent = Polygon.fromExtent(state.geometry.extent).extent.expand(1.8);
    this.mapService.mapView.goTo(state.geometry.centroid);

    this.mapService.mapView.graphics.removeAll();
    this.mapService.createPolygonGraphic(state.geometry.rings, state.geometry.spatialReference);
  }
}
