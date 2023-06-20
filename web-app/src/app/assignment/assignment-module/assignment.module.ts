import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignmentRoutingModule } from './assignment.routing.module';
import { MapService } from '../service/map.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { QueryTaskComponent } from '../query-task/query-task.component';
import { TableModule } from 'primeng/table';
import { ClosestFacilityComponent } from '../closest-facility/closest-facility.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SketchMapComponent } from '../sketch-map/sketch-map.component';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { RouteMapComponent } from '../route-map/route-map.component';
import { LayerListComponent } from '../layer-list/layer-list.component';
import { SwipeMapComponent } from '../swipe-map/swipe-map.component';
import { SecureMapComponent } from '../secure-map/secure-map.component';
import { UserControlComponent } from '../user-control/user-control.component';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  declarations: [
    QueryTaskComponent,
    ClosestFacilityComponent,
    SketchMapComponent,
    RouteMapComponent,
    LayerListComponent,
    SwipeMapComponent,
    SecureMapComponent,
    UserControlComponent],
  imports: [
    CommonModule,
    FormsModule,
    AssignmentRoutingModule,
    ReactiveFormsModule,
    InputNumberModule,
    ButtonModule,
    TableModule,
    ProgressSpinnerModule,
    ToastModule,
    InputTextModule,
    AvatarModule,
    RadioButtonModule,
    RatingModule,
    ConfirmDialogModule
  ],
  providers: [MapService, MessageService, ConfirmationService],
  bootstrap: [QueryTaskComponent]
})
export class AssignmentModule { }
