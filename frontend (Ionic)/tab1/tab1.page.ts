import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';

import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  constructor(public http: Http) {
    let currentMovies = [];

    let url = "https://api.themoviedb.org/3/movie/now_playing?api_key=ce54eab5f21943ef32228205704ddaf4&page=1";

    this.http.get(url)
          .subscribe(data => {
            console.log("Data:");
            currentMovies = data.json().results;
            console.log(currentMovies);

          }, error => {
            // Error getting the data
            console.log(error);
    });


  }
}
