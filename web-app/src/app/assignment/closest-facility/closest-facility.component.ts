import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MapService } from '../service/map.service';
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import WebStyleSymbol from '@arcgis/core/symbols/WebStyleSymbol';
import * as closestFacility from "@arcgis/core/rest/closestFacility.js";
import ClosestFacilityParameters from "@arcgis/core/rest/support/ClosestFacilityParameters.js";
import FeatureSet from "@arcgis/core/rest/support/FeatureSet.js";
import Graphic from '@arcgis/core/Graphic';
import Polygon from '@arcgis/core/geometry/Polygon';

@Component({
  selector: 'app-closest-facility',
  templateUrl: './closest-facility.component.html',
  styleUrls: ['./closest-facility.component.scss']
})
export class ClosestFacilityComponent implements OnInit {

  @ViewChild('mapPanel', { static: true }) mapPanel: ElementRef;

  mapLayerUrl = 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0';
  facilityUrl = 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/NetworkAnalysis/SanDiego/NAServer/ClosestFacility';

  incidentsGraphic: Graphic[] = [];
  facilitiesGraphic: Graphic[] = [];
  routesFeatures: any = [];
  polylineGraphic: Graphic;
  selectedRoute: any;
  isLoading: boolean = false;

  constructor(private mapService: MapService) { }

  ngOnInit(): void {
    this.mapService.createMap(this.mapPanel.nativeElement);
    //Set map view to San Diego
    this.mapService.mapView = new MapView({
      container: this.mapPanel.nativeElement,
      map: this.mapService.map,
      center: [-117.0109026532817, 32.73071186829664],
      zoom: 11,
    });

    //Create Layer
    const cityLayer = new FeatureLayer({
      url: this.mapLayerUrl
    });
    this.mapService.map.add(cityLayer);

    //Add a click event to the map view
    this.mapService.mapView.on('click', (event) => {
      this.mapService.clearGraphics();
      const buffer = geometryEngine.buffer(event.mapPoint, 20, "kilometers", true)
      const bufferPolygon = this.mapService.createPolygonGraphic(buffer['rings'], buffer['spatialReference'], [65, 204, 232, 0.2]);
      //Create a graphic for the incident
      let mapPointGraphic = this.mapService.createPointGraphic({ latitude: event.mapPoint.latitude, longtitude: event.mapPoint.longitude });
      mapPointGraphic.attributes = {
        name: 'Incident'
      }
      this.incidentsGraphic[0] = mapPointGraphic;
      this.mapService.mapView.goTo(event.mapPoint);
      this.isLoading = true;
      this.cityQueryTask(cityLayer, bufferPolygon);
    });
  }

  cityQueryTask(layer: any, polygon: any) {
    let query = layer.createQuery();
    query.geometry = polygon;
    query.spatialRelationship = "intersects";
    query.returnGeometry = true;
    query.outSpatialReference = { wkid: 4326 };

    layer.queryFeatures(query).then((results) => {
      const customSymbol = new WebStyleSymbol({
        name: "push-pin-2",
        styleName: "Esri2DPointSymbolsStyle"
      });
      this.facilitiesGraphic = [];
      results.features.forEach((feature) => {
        let queryGraphic = this.mapService.createPointGraphic({ latitude: feature.geometry.latitude, longtitude: feature.geometry.longitude }, feature.geometry.spatialReference, customSymbol);
        queryGraphic.attributes = {
          name: feature.attributes.areaname
        }
        this.facilitiesGraphic.push(queryGraphic);
      })
      return results.features;
    }).then(() => {
      this.closestFacilityTask();
    });
  }

  closestFacilityTask() {

    closestFacility.solve(this.facilityUrl, new ClosestFacilityParameters({
      incidents: new FeatureSet({ features: this.incidentsGraphic }),
      facilities: new FeatureSet({ features: this.facilitiesGraphic }),
      returnRoutes: true,
      defaultTargetFacilityCount: 10
    })).then((result) => {
      result.routes.features.map((route) => {
        route.attributes.Name = route.attributes.Name.replace('Incident - ', '')
        this.polylineGraphic = this.mapService.createPolylineGraphic(route.geometry['paths'], route.geometry.spatialReference, [255, 229, 99, 1], 1.5);
      })
      this.routesFeatures = result.routes.features;
      console.log(this.routesFeatures);
      this.isLoading = false;
    }).catch((error) => {
      console.log(error);
      this.routesFeatures = [];
      this.isLoading = false;
    })
  }

  createRouteGraphic(route: any) {
    this.mapService.mapView.graphics.remove(this.polylineGraphic);
    this.polylineGraphic = this.mapService.createPolylineGraphic(route.geometry.paths, route.geometry.spatialReference);
    this.mapService.mapView.extent = Polygon.fromExtent(route.geometry.extent).extent.expand(2);
    this.selectedRoute = route;
  }

}
