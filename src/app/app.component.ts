import { Component, OnInit } from '@angular/core';
import { FileDropModule, UploadEvent, UploadFile } from 'ngx-file-drop';
import { FileUploader } from 'ng2-file-upload';
import { HttpService } from './http.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NzModalService } from 'ng-zorro-antd';
import { UploadModalComponent } from './upload-modal/upload-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  imageData: any;

  hasBaseDropZoneOver = false;
  files: any[] = [];
  searchPatient = '';
  newPatient = '';
  searchSlice: string;
  slicelist = [];
  results: string;
  loading = false;
  patientList: Array<string>;
  check(e: any) {
    console.log(e);
  }
  constructor( private httpServe: HttpService,
               private sanitizer: DomSanitizer,
               private modalService: NzModalService
  ) { }
  getPng(searchName: string, slice: any) {
    console.log(slice);
    console.log('searching');
    this.httpServe.getPng(searchName, slice).subscribe(res => {
      const urlCreator = window.URL;
      this.imageData = this.sanitizer.bypassSecurityTrustUrl(
        urlCreator.createObjectURL(res));
    });
  }
  getSlices(searchName: string) {
    this.httpServe.getList(searchName).subscribe(res => {
      this.loading = false;
      this.slicelist = res.Slices;
      console.log(this.slicelist.sort((a, b) => {
        return a - b;
      }));
      this.searchSlice = this.slicelist[0];
      this.getPng(searchName, this.searchSlice);
    });
  }
  getClassification(searchName: string) {
    this.loading = true;
    this.httpServe.getClassification(searchName).subscribe(res => {
      console.log(res);
      this.results = res.Result.prediction;
      this.getSlices(searchName);
    });
  }
  getPatientList() {
    this.httpServe.getPatientList().subscribe(res => {
      this.patientList = res.Patients;
    });
  }
  ngOnInit() {
    this.getPatientList();
    console.log('hello');
  }
  showModalForUpload() {
    const subscription = this.modalService.open({
      title: '影像上传',
      content: UploadModalComponent,
      onCancel() {
      },
      footer: false,
      componentParams: {
        name: '测试component'
      },
      maskClosable: false,
      closable: false
    });
    subscription.subscribe(result => {
      console.log(result);
      if (result.status === true) {
        this.getPatientList();
        this.getClassification(result.name);
        this.searchPatient = result.name;
      }
    });
  }
}
