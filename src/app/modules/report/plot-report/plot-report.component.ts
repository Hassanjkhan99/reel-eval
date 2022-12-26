import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Chart} from "chart.js";

@Component({
  selector: 'app-plot-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plot-report.component.html',
  styleUrls: ['./plot-report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlotReportComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
    this.RenderScatterchart()
  }

  RenderScatterchart() {
    const data = {
      datasets: [{
        label: 'Scatter Dataset',
        data: [{
          x: -10,
          y: 9.5
        }, {
          x: 19.5,
          y: 10.5
        }, {
          x: 10,
          y: 5
        }, {
          x: -2.5,
          y: -5.5
        }, {
          x: 10.5,
          y: 5.5
        }, {
          x: 20.5,
          y: 3
        }, {
          x: 1.5,
          y: 7.5
        }, {
          x: 0.5,
          y: 6.5
        }, {
          x: 3.5,
          y: -5.5
        },
          {
            x: 4.5,
            y: 6.5
          }, {
            x: 7.5,
            y: -5.5
          }, {
            x: 0.5,
            y: 3.5
          }, {
            x: -24.5,
            y: -14.5
          }],
        backgroundColor: 'rgb(255, 99, 132)',
      }],
    };
    const myChart = new Chart('scchart', {
      type: 'scatter',
      data: data,
      options: {
        scales: {
          x: {
            type: 'linear',
            position: 'center',
          },
          y: {
            type: 'linear',
            position: 'center'
          }
        }
      }
    });
  }

}
