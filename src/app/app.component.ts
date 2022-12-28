import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { saveAs } from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'pdf-viewer';
  url!: string;
  password!: string;
  downloadUrl!: string;
  fileName!:string;

  src!: any;

  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient
  ) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.url = params['url'];
      this.password = params['password'];
      this.fileName = params['fileName'];

      if (this.isParamsValid && this.password) {
        this.downloadUrl = atob(decodeURI(this.url));
        this.src = {
          url: this.downloadUrl,
          password: this.password
        };
      }
      else if (this.isParamsValid) {
        this.src = this.downloadUrl;
      }
    });
  }

  downloadFile() {
    this.httpClient.get(`${this.downloadUrl}`, { observe: 'response', responseType: 'blob' }).subscribe(response => {
      const blob = new Blob([response.body as BlobPart], { type: 'application/octet-stream' });
      const fileName = this.fileName || 'document.pdf';
      saveAs(blob, fileName);
    });
  }

  getFileName(headers: HttpHeaders) {
    const contentDisposition = decodeURIComponent(headers.get('content-disposition') || '') || '';   // decodes the encoded characters in file name
    let matches = /filename="([^;]+)"/ig.exec(contentDisposition);
    if (matches == null) {
      matches = /filename=([^;]+)/ig.exec(contentDisposition);
    }

    const fileName = ((matches || [])[1] || 'untitled').trim();
    return fileName;
  };

  get isParamsValid() {
    return this.url != null;
  }
}

