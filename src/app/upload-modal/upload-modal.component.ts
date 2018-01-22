import { Component, Input, OnInit } from '@angular/core';
import { NzModalSubject } from 'ng-zorro-antd';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-upload-modal',
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.css']
})
export class UploadModalComponent implements OnInit {
  uploader: FileUploader = new FileUploader({
    url: 'http://59.110.52.133:9504/cancer/fileop/',    // http://202.117.54.95:8888/filesystem/fileop/
    method: 'POST',
    itemAlias: 'file',
    autoUpload: false,
  });
  _name: string;
  newPatient = '';
  hasBaseDropZoneOver = false;
  files: any[] = [];
  uploading = false;

  @Input()
  set name(value: string) {
    this._name = value;
  }
  selectedFileOnChanged(event: any) {
    console.log(event);
    console.log('-*->' + event.target);
  }
  file() {
    const patient = this.newPatient;
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
  emitDataOutside() {
    this.subject.next({
      status: true,
      name: this.newPatient
    });
  }
  sendUploadingSignal() {
    this.subject.next({
      status: 'uploading'
    });
  }

  handleCancel(e) {
    this.subject.destroy('onCancel');
    console.log('canceled');
  }

  constructor(private subject: NzModalSubject) {
    /*this.subject.on('onDestory', () => {
      console.log('destroy');
    });*/
    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
    };
    this.uploader.onAfterAddingFile = (f) => {
      this.files = this.uploader.queue;
      this.uploading = true;
      // console.log('onAfterAddingFile');
      return f;
    };
  }

  ngOnInit() {
    this.uploader.onBuildItemForm = (fileItem, form) => {
      form.append('name', this.newPatient);
      console.log(form);
    };
    this.uploader.onCompleteAll = () => {
      this.uploading = false;
      console.log('finished');
      this.subject.next({
        status: true,
        name: this.newPatient
      });
      this.subject.destroy('onCancel');
    };
  }
}
