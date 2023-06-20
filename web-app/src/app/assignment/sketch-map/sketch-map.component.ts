import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MapService } from '../service/map.service';
import Graphic from '@arcgis/core/Graphic';
import GraphicLayer from '@arcgis/core/layers/GraphicsLayer';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Sketch from '@arcgis/core/widgets/Sketch';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-sketch-map',
  templateUrl: './sketch-map.component.html',
  styleUrls: ['./sketch-map.component.scss'],
  providers: [MessageService]
})
export class SketchMapComponent implements OnInit {

  @ViewChild('mapPanel', { static: true }) mapPanel: ElementRef;

  featureLayer: FeatureLayer;
  sketchLayer: GraphicLayer;
  featureLayerUrl = 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/FeatureServer/2';
  objectid: any;

  constructor(private mapService: MapService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.mapService.createMap(this.mapPanel.nativeElement);
    this.sketchLayer = new GraphicLayer();
    this.featureLayer = new FeatureLayer({
      url: this.featureLayerUrl,
    });
    this.mapService.map.add(this.sketchLayer);

    let sketch = new Sketch({
      layer: this.sketchLayer,
      view: this.mapService.mapView,
      availableCreateTools: ['polygon'],
    })

    this.mapService.mapView.ui.add(sketch, 'top-right');

    //on sketch create polygon
    sketch.on('create', (event) => {
      if (event.state === 'complete') {
        this.addFeature(event);
      }
    })

    sketch.on('update', (event) => {
      if (event.state === 'start') {
        this.queryFeature(event);
      }
      if (event.state === 'complete' && event.aborted === false) {
        console.log(this.objectid);
        this.updateFeature(event, this.objectid);
      }
    })

    sketch.on('delete', (event) => {
      this.deleteFeature(event);
    })
  }

  addFeature(event: any) {
    const feature = new Graphic({
      geometry: event.graphic.geometry,
      attributes: {
        symbolid: 1,
        description: 'test create feature'
      }
    })
    this.featureLayer.applyEdits({
      addFeatures: [feature]
    }).then((response) => {
      event.graphic.attributes = { objectid: response.addFeatureResults[0].objectId } //add objectid to graphic attributes
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Add feature success' })
    }).catch((error) => {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Add feature failed' })
    })
  }

  updateFeature(event: any, objectid: number) {
    const feature = new Graphic({
      geometry: event.graphics[0].geometry,
      attributes: {
        objectid: objectid,
        symbolid: 0,
        description: 'update feature : ' + objectid,
      }
    })
    this.featureLayer.applyEdits({
      updateFeatures: [feature]
    }).then((response) => {
      console.log(response);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Update feature success' })
    }).catch((error) => {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Update feature failed' })
    })
  }

  queryFeature(event: any) {
    console.log(event);
    let query = this.featureLayer.createQuery();
    query.where = 'objectid=' + event.graphics[0].attributes.objectid;
    query.geometry = event.graphics[0].geometry;
    query.spatialRelationship = 'intersects';
    query.returnGeometry = true;

    this.featureLayer.queryFeatures(query).then((response) => {
      console.log(response.features); //check query feature
      this.objectid = response.features[0].attributes.objectid;
    }).catch((error) => {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Query feature failed' })
      this.sketchLayer.remove(event.graphics[0]);
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'This polygon as been removed from feature layer' })
    })
  }

  deleteFeature(event: any) {

    let deleteFeature = {
      objectId: event.graphics[0].attributes.objectid
    }

    this.featureLayer.applyEdits({
      deleteFeatures: [deleteFeature]
    }).then((response) => {
      console.log(response);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Delete feature success' })
    }).catch((error) => {
      this.sketchLayer.remove(event.graphics[0]);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Delete feature failed' })
    })
  }

}
