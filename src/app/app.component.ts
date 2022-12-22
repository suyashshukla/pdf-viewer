import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'pdf-viewer';
  url!: string;
  password!: string;

  src!: any;
  
  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params=>{
      this.url = params['url'];
      this.password = params['password'];
  
      if (this.isParamsValid && this.password) {
        this.src = {
          url: this.url,
          password: this.password
        };
      }
      else {
        this.src = this.url;
      }
    });
  }

  get isParamsValid() {
    return this.url != null;
  }


}
