import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MapService } from '../service/map.service';
import * as route from "@arcgis/core/rest/route.js";
import RouteParameters from "@arcgis/core/rest/support/RouteParameters.js";
import Graphic from '@arcgis/core/Graphic';
import WebStyleSymbol from '@arcgis/core/symbols/WebStyleSymbol';
import { MessageService } from 'primeng/api';
import FeatureSet from '@arcgis/core/rest/support/FeatureSet';
import Polygon from '@arcgis/core/geometry/Polygon';
import { esriPinCustomSymbol } from '../model/esriPinCustom';

@Component({
  selector: 'app-route-map',
  templateUrl: './route-map.component.html',
  styleUrls: ['./route-map.component.scss']
})
export class RouteMapComponent implements OnInit {

  @ViewChild('mapPanel', { static: true }) mapPanel: ElementRef;

  routeUrl = 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/NetworkAnalysis/SanDiego/NAServer/Route'
  routePoints: Graphic[] = []
  undoPointsTemp: Graphic[] = []
  isLoading: boolean = false
  directionPaths = []
  directionPathsGraphics: Graphic[] = []
  selectedDirectionPath: any
  selectedPathGraphic: any

  constructor(private mapService: MapService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.mapService.createMap(this.mapPanel.nativeElement);
    this.mapService.mapView.on('click', (event) => {
      this.createRoutingPoint(event.mapPoint)
    })
  }

  startRoute() {
    this.isLoading = true
    const routeParam = new RouteParameters({
      stops: new FeatureSet({
        features: this.routePoints
      }),
      returnDirections: true,
      outSpatialReference: this.mapService.mapView.spatialReference
    })

    route.solve(this.routeUrl, routeParam).then((response) => {
      this.isLoading = false
      console.log(response)
      this.directionPaths = response.routeResults[0].directions.features
      this.createRoutingPaths(response.routeResults[0].directions.extent);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Route create success!' })
    }).catch((error) => {
      this.isLoading = false
      console.log(error)
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Route create failed!' })
    })
  }

  createRoutingPoint(point: any) {
    const startPoint = esriPinCustomSymbol
    const stopPoint = new WebStyleSymbol({
      name: "esri-pin-2",
      styleName: "Esri2DPointSymbolsStyle"
    });
    const pointGraphic = this.mapService.createPointGraphic({ latitude: point.latitude, longtitude: point.longitude }, this.mapService.mapView.spatialReference, this.routePoints.length === 0 ? startPoint : stopPoint)
    this.routePoints.push(pointGraphic)
    this.undoPointsTemp = [];
  }

  createRoutingPaths(extent: any) {
    this.mapService.mapView.graphics.removeMany(this.directionPathsGraphics)
    this.directionPathsGraphics = [] //clear old path

    console.log(this.directionPaths)

    if (this.directionPaths.length > 0) {
      this.directionPaths.forEach((path) => {
        const pathGraphic = this.mapService.createPolylineGraphic(path.geometry.paths, this.mapService.mapView.spatialReference, [40, 227, 237])
        this.directionPathsGraphics.push(pathGraphic)
      })
    }
    this.mapService.mapView.goTo(Polygon.fromExtent(extent).extent.expand(2))

  }

  undoRoutingPoint() {
    const undoPoint = this.routePoints.pop()
    this.mapService.mapView.graphics.remove(undoPoint)
    this.undoPointsTemp.push(undoPoint)
  }

  redoRoutingPoint() {
    const redoPoint = this.undoPointsTemp.pop()
    this.routePoints.push(redoPoint)
    this.mapService.mapView.graphics.add(redoPoint)
  }

  clearRoutingPoint() {
    this.directionPathsGraphics = []
    this.directionPaths = []
    this.routePoints = []
    this.undoPointsTemp = []
    this.mapService.mapView.graphics.removeAll();
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Remove all routing points success!' })
  }

  createSpecificRouteGraphic(path) {

    const pathExtent = path.geometry.extent

    if ((pathExtent.height === 0 && pathExtent.width === 0) || path.geometry.paths[0].length <= 2) {
      this.mapService.mapView.goTo(path.geometry)
    } else {
      //this.mapService.mapView.extent = Polygon.fromExtent(pathExtent).extent.expand(3)
      this.mapService.mapView.goTo(Polygon.fromExtent(pathExtent).extent.expand(2))
    }
    this.selectedDirectionPath = path
    if (this.selectedPathGraphic) {
      this.mapService.mapView.graphics.remove(this.selectedPathGraphic)
    }
    const pathGraphic = this.mapService.createPolylineGraphic(path.geometry.paths, this.mapService.mapView.spatialReference, [235, 85, 30])
    this.selectedPathGraphic = pathGraphic
  }

}
