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
        data: [
          {
            x: 100,
            y: 0
          }, {
            x: 90.5,
            y: 0
          }, {
            x: 100,
            y: 0
          }, {
            x: 25,
            y: 55
          }, {
          x: 10.5,
            y: 50.5
        }, {
          x: 20.5,
            y: 30
        }, {
            x: 18.5,
            y: 79.5
          }, {
            x: 90.5,
            y: 0
          }, {
          x: 3.5,
            y: 0
        },
          {
            x: 4.5,
            y: 6.5
          }, {
            x: 7.5,
            y: 0
          }, {
            x: 0.5,
            y: 0
          }, {
            x: 24.5,
            y: 14.5
          }],
        backgroundColor: 'black',
        fontSize: '24'
      }],
    };
    const quadrants = {
      id: 'quadrants',
      beforeDraw(chart, args, options) {
        const {ctx, chartArea: {left, top, right, bottom}, scales: {x, y}} = chart;
        const midX = x.getPixelForValue(0);
        const midY = y.getPixelForValue(0);
        ctx.save();
        ctx.fillStyle = options.topLeft;
        ctx.fillRect(left, top, midX - left, midY - top);
        ctx.fillStyle = options.topRight;
        ctx.fillRect(midX, top, right - midX, midY - top);
        ctx.fillStyle = options.bottomRight;
        ctx.fillRect(midX, midY, right - midX, bottom - midY);
        ctx.fillStyle = options.bottomLeft;
        ctx.fillRect(left, midY, midX - left, bottom - midY);
        ctx.restore();
      }
    };
    const myChart = new Chart('scchart', {
      type: 'scatter',
      data: data,
      options: {
        scales: {
          x: {
            type: 'linear',
            position: 'center',
            max: 100,
            min: 0,
          },
          y: {
            type: 'linear',
            position: 'center',
            max: 100,
            min: 0,
          },

        },
        elements: {
          point: {
            radius: 5,
          }
        },
        plugins: {
          // @ts-ignore
          quadrants: {
            topLeft: 'black',
            topRight: 'white',
            bottomRight: 'white',
            bottomLeft: 'white',
          }
        }
      },
      plugins: [quadrants]
    });

  }

}
