import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QueryTaskComponent } from '../query-task/query-task.component';
import { ClosestFacilityComponent } from '../closest-facility/closest-facility.component';
import { SketchMapComponent } from '../sketch-map/sketch-map.component';
import { RouteMapComponent } from '../route-map/route-map.component';
import { LayerListComponent } from '../layer-list/layer-list.component';
import { SwipeMapComponent } from '../swipe-map/swipe-map.component';
import { SecureMapComponent } from '../secure-map/secure-map.component';
import { UserControlComponent } from '../user-control/user-control.component';

const routes: Routes = [
  {
    path: 'query-task',
    component: QueryTaskComponent,
  },
  {
    path: 'closest-facility',
    component: ClosestFacilityComponent,
  },
  {
    path: 'sketch-map',
    component: SketchMapComponent,
  },
  {
    path: 'route-map',
    component: RouteMapComponent,
  },
  {
    path: 'layer-list',
    component: LayerListComponent,
  },
  {
    path: 'swipe-map',
    component: SwipeMapComponent,
  },
  {
    path: 'secure-map',
    component: SecureMapComponent,
  },
  {
    path: 'user',
    component: UserControlComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssignmentRoutingModule { }