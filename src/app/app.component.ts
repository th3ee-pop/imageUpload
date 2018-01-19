import { Component, OnInit } from '@angular/core';
import { FileDropModule, UploadEvent, UploadFile } from 'ngx-file-drop';
import { FileUploader } from 'ng2-file-upload';
import { HttpService } from './http.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  uploader: FileUploader = new FileUploader({
    url: 'http://59.110.52.133:9504/cancer/fileop/',    // http://202.117.54.95:8888/filesystem/fileop/
    method: 'POST',
    itemAlias: 'file',
    autoUpload: false,
  });
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

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
    console.log(e);
  }
  selectedFileOnChanged(event: any) {
    console.log('-*->' + event.target);
  }
  constructor( private httpServe: HttpService, private sanitizer: DomSanitizer) {
    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
    };
    this.uploader.onAfterAddingFile = (f) => {
      this.files = this.uploader.queue;
      // console.log('onAfterAddingFile');
      return f;
    };
  }
  test() {
    console.log(this.uploader);
  }
  file() {
    const patient = this.searchPatient;
    this.uploader.queue[0].onSuccess = (response, status, headers) => {
      // 上传文件成功
      console.log(status);
      console.log(response);
      console.log(headers);
      if (status === 200) {
        // 上传文件后获取服务器返回的数据
        const tempRes = JSON.parse(response);
        console.log('-->' + tempRes);
      }else {
        // 上传文件后获取服务器返回的数据错误
        console.log('上传文件后获取服务器返回的数据错误');
      }
    };
    this.uploader.queue[0].upload(); // 开始上传
  }
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
    this.uploader.onBuildItemForm = (fileItem, form) => {
      form.append('name', this.newPatient);
      console.log(form);
    };
    this.uploader.onCompleteAll = () => {
      console.log('finished');
      this.loading = true;
      this.searchPatient = this.newPatient;
      this.getClassification(this.newPatient);
      this.getPatientList();
    };
    this.getPatientList();
    console.log('hello');
  }
}
