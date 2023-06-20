import { Injectable } from "@angular/core";
import Graphic from "@arcgis/core/Graphic";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleMarkSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import Point from "@arcgis/core/geometry/Point";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import CustomPoint from "../model/customPoint";
import Polyline from "@arcgis/core/geometry/Polyline";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";

@Injectable({
    providedIn: "root",
})
export class MapService {
    public map: Map;
    public mapView: MapView;

    createMap(container: any) {
        this.map = new Map({
            basemap: "topo-vector",
        });

        this.mapView = new MapView({
            container: container,
            map: this.map,
            center: [-117.0109026532817, 32.73071186829664],
            zoom: 11,
        });
    }

    createPolygonGraphic(rings: any, spatialReference: any, color?: any, outlineColor?: any, outlineWidth?: any) {

        let DefaultColor = [65, 204, 232, 0.3];
        let DefaultOutlineColor = [13, 144, 219, 0.5];

        let polygon = {
            type: "polygon",
            rings: rings,
            spatialReference: spatialReference
        };
        let graphic = new Graphic({
            geometry: polygon,
            symbol: new SimpleFillSymbol({
                color: color ? color : DefaultColor,
                outline: {
                    color: outlineColor ? outlineColor : DefaultOutlineColor,
                    width: outlineWidth ? outlineWidth : 1
                }
            })
        });
        this.mapView.graphics.add(graphic);
        return polygon;
    }

    //to use this method, call it like this:
    //this.mapService.createPointGraphic({ latitude: 39.85707025631872, longtitude: -100.29081082700414});
    createPointGraphic(customPoint: CustomPoint, spatialReference?: any, symbol?: any) {
        let defaultSpatialReference = { wkid: 4326 };
        const point = new Point({
            latitude: customPoint.latitude,
            longitude: customPoint.longtitude,
            spatialReference: spatialReference ? spatialReference : defaultSpatialReference
        });
        let simpleMarkerSymbol = new SimpleMarkSymbol({
            color: [119, 220, 60],
            outline: {
                color: [255, 255, 255],
                width: 2
            }
        })
        let graphic = new Graphic({
            geometry: point,
            symbol: symbol ? symbol : simpleMarkerSymbol
        });
        this.mapView.graphics.add(graphic);

        return graphic;
    }

    createPolylineGraphic(paths: any, spatialReference: any, color?: any, width?: any) {
        let DefaultColor = [255, 0, 0, 0.7];
        let DefaultWidth = 2;

        let polyline = {
            type: "polyline",
            paths: paths,
            spatialReference: spatialReference
        };
        let graphic = new Graphic({
            geometry: polyline,
            symbol: new SimpleLineSymbol({
                color: color ? color : DefaultColor,
                width: width ? width : DefaultWidth
            })
        })
        this.mapView.graphics.add(graphic);
        return graphic;
    }

    clearGraphics() {
        this.mapView.graphics.removeAll()
    }
}