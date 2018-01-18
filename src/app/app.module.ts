import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { AppComponent } from './app.component';
import { FileDropModule } from 'ngx-file-drop';
import { FileUploadModule } from 'ng2-file-upload';
import { HttpService } from './http.service';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FileDropModule,
    FileUploadModule,
    NgZorroAntdModule.forRoot()
  ],
  bootstrap: [AppComponent],
  providers: [HttpService]
})
export class AppModule { }
