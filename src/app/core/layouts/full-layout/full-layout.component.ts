import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-full-layout',
  templateUrl: './full-layout.component.html',
  imports: [
    RouterOutlet
  ],
  standalone: true
})

export class FullLayoutComponent  {
    constructor() { }
}
