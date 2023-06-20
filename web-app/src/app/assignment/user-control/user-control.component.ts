import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MapService } from '../service/map.service';
import { AxRequestService } from '@atlasx/core/http-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import MapView from '@arcgis/core/views/MapView';
import { ConfirmationService, MessageService } from 'primeng/api';
import CustomPoint from '../model/customPoint';
import Graphic from '@arcgis/core/Graphic';

@Component({
  selector: 'app-user-control',
  templateUrl: './user-control.component.html',
  styleUrls: ['./user-control.component.scss']
})
export class UserControlComponent implements OnInit {

  @ViewChild("mapPanel", { static: true }) mapPanel: ElementRef;


  sp_api_url: string = 'https://atlasx.cdg.co.th/axws-demo/api/appdata'
  apphoro_api_url: string = 'https://localhost:5001/api/apphoro'
  sp_name: string = '?APP_DATA_PROCEDURE=TEMP_USER';

  userForm: FormGroup;

  searchValue: string = '';
  users = [];
  selectedUser: any;
  selectedGender = null;
  horoPoint: any = 0;
  pointGraphic: Graphic;

  constructor(private mapService: MapService,
    private requestService: AxRequestService,
    public formBuilder: FormBuilder,
    public messageService: MessageService,
    private confirmationService: ConfirmationService) {
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      gender: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.mapService.createMap(this.mapPanel.nativeElement);
    this.mapService.mapView = new MapView({
      container: this.mapService.mapView.container,
      map: this.mapService.map,
      center: [100.523186, 13.736717], //Bangkok Coordinates
      zoom: 14,
    });

    this.fetchUserData();

    this.userForm.get('name').valueChanges.subscribe((value) => {
      this.calculateHoroPoint({ target: { value: value } });
    })

    this.mapService.mapView.on('click', (event) => {
      this.mapService.mapView.graphics.remove(this.pointGraphic);
      let point = new CustomPoint(event.mapPoint.latitude, event.mapPoint.longitude);
      this.pointGraphic = this.mapService.createPointGraphic(point);
      this.mapService.mapView.goTo(this.pointGraphic.geometry);
      this.userForm.patchValue({
        latitude: String(this.pointGraphic.geometry['latitude']),
        longitude: String(this.pointGraphic.geometry['longitude'])
      })
    })
  }

  fetchUserData() {
    this.requestService.request(this.sp_api_url + this.sp_name + '_Q', 'GET').subscribe((res: any) => {
      this.users = res.data;
      console.log(this.users);
    }, err => {
      console.log(err);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load user data', sticky: true })
    })
  }

  CreateUserData() {
    this.requestService.request(this.sp_api_url + this.sp_name + '_I', 'POST', null, {
      NAME: this.userForm.get('name').value,
      SURNAME: this.userForm.get('surname').value,
      GENDER: this.selectedGender,
      MOBILE: this.userForm.get('mobile').value,
      LATITUDE: this.userForm.get('latitude').value,
      LONGITUDE: this.userForm.get('longitude').value
    }).subscribe((res: any) => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'สร้างข้อมูลผู้ใช้สำเร็จ' })
      this.onClickCreateUser();
    }, err => {
      console.log(err);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'สร้างข้อมูลผู้ใช้ไม่สำเร็จ' })
    })
  }

  UpdateUserData() {
    this.requestService.request(this.sp_api_url + this.sp_name + '_U', 'POST', null, {
      USER_ID: this.selectedUser.USER_ID,
      NAME: this.userForm.get('name').value,
      SURNAME: this.userForm.get('surname').value,
      GENDER: this.selectedGender,
      MOBILE: this.userForm.get('mobile').value,
      LATITUDE: this.userForm.get('latitude').value,
      LONGITUDE: this.userForm.get('longitude').value
    }).subscribe((res: any) => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'อัพเดตข้อมูลผู้ใช้สำเร็จ' })
      this.onClickCreateUser();
    }, err => {
      console.log(err);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'อัพเดตข้อมูลผู้ใช้ไม่สำเร็จ' })
    })
  }

  avatarColorClass(gender: string) {
    if (gender == 'M' || gender == 'Male' || gender == 'ชาย') {
      return 'bg-blue-400 text-white';
    } else if (gender == 'F' || gender == 'Female' || gender == 'หญิง') {
      return 'bg-pink-400 text-white';
    }
  }

  calculateHoroPoint({ target }) {
    let name = target.value;
    if (name) {
      this.requestService.request(this.apphoro_api_url + '?name=' + name, 'GET').subscribe((res: any) => {
        switch (res.result) {
          case 'Bad': this.horoPoint = 1; break;
          case 'So So': this.horoPoint = 2; break;
          case 'Good': this.horoPoint = 3; break;
        }
      }, err => {
        console.log(err);
        this.horoPoint = 0
        //this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load fortune rating' })
      })
    } else {
      this.horoPoint = 0;
    }
  }

  onSubmit() {
    console.log(this.userForm.value);
    if (this.userForm.valid) {
      if (this.selectedUser) {
        this.UpdateUserData();
      } else {
        this.CreateUserData();
      }
    } else if (this.validator('fieldRequiredNotDirty')) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'กรุณากรอกข้อมูลให้ครบ' })
    } else if (this.validator('mobileLength')) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก' })
    }
    if (this.validator('mapPoint')) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'กรุณาระบุพิกัดบนแผนที่' })
    }

    this.fetchUserData();
  }

  onDelete() {
    this.confirmationService.confirm({
      message: 'คุณต้องการลบผู้ใช้นี้ออกหรือไม่',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.requestService.request(this.sp_api_url + this.sp_name + '_D', 'POST', null, { USER_ID: this.selectedUser.USER_ID }).subscribe((res: any) => {
          this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'ลบข้อมูลผู้ใช้สำเร็จ' });
          this.fetchUserData();
          this.onClickCreateUser();
        }, err => {
          console.log(err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'ลบข้อมูลผู้ใช้ไม่สำเร็จ' })
        })
      },
      acceptLabel: 'ใช่',
      rejectLabel: 'ไม่ใช่',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
    });
  }

  onSelectUser(user: any) {
    this.selectedUser = user;
    if (user.GENDER == 'M' || user.GENDER == 'Male' || user.GENDER == 'ชาย') {
      this.selectedGender = 'M'
    } else if (user.GENDER == 'F' || user.GENDER == 'Female' || user.GENDER == 'หญิง') {
      this.selectedGender = 'F'
    } else {
      this.selectedGender = null;
    }

    let userPoint = new CustomPoint(parseFloat(user.LATITUDE), parseFloat(user.LONGITUDE));
    // console.log(userPoint);
    this.mapService.mapView.graphics.remove(this.pointGraphic);
    if ((user.LATITUDE != null && user.LATITUDE != 'undefined') || (user.LONGITUDE != null && user.LONGITUDE != 'undefined')) {
      let userPoint = new CustomPoint(parseFloat(user.LATITUDE), parseFloat(user.LONGITUDE));
      this.pointGraphic = this.mapService.createPointGraphic(userPoint);
      this.mapService.mapView.goTo(this.pointGraphic.geometry);
    }

    this.userForm.patchValue({
      name: user.NAME,
      surname: user.SURNAME,
      mobile: user.MOBILE,
      latitude: String(this.pointGraphic.geometry['latitude']),
      longitude: String(this.pointGraphic.geometry['longitude'])
    })

  }

  onClickCreateUser() {
    this.selectedUser = null;
    this.selectedGender = null;
    this.userForm.reset();
    this.mapService.mapView.graphics.remove(this.pointGraphic);
  }

  onClearForm() {
    this.userForm.reset();
    this.mapService.mapView.graphics.remove(this.pointGraphic);
  }

  filterUser(): any[] {
    return this.users.filter((user) => {
      const fullname = (user.NAME || '').toLowerCase() + ' ' + (user.SURNAME || '').toLowerCase() + ' ' + (user.MOBILE || '').toLowerCase();
      return (fullname.includes(this.searchValue.toLowerCase()))
    });
  }

  validator(text) {
    if (text == 'fieldRequired') {
      return (this.userForm.get('name').dirty && this.userForm.get('name').errors?.['required']) ||
        (this.userForm.get('surname').dirty && this.userForm.get('surname').errors?.['required']) ||
        (this.userForm.get('mobile').dirty && this.userForm.get('mobile').errors?.['required'])
    }
    if (text == 'fieldRequiredNotDirty') {
      return (this.userForm.get('name').errors?.['required']) ||
        (this.userForm.get('surname').errors?.['required']) ||
        (this.userForm.get('mobile').errors?.['required']) ||
        (this.userForm.get('gender').errors?.['required'])
    }
    if (text == 'mobilePattern') {
      return this.userForm.hasError('pattern', 'mobile')
    }
    if (text == 'mobileLength') {
      if (this.userForm.get('mobile').dirty && !this.userForm.get('mobile').value) {
        return true
      }
      return this.userForm.hasError('minlength', 'mobile') || this.userForm.hasError('maxlength', 'mobile')
    }
    if (text == 'mapPoint') {
      return this.userForm.hasError('required', 'latitude') || this.userForm.hasError('required', 'longitude')
    }
  }
}
