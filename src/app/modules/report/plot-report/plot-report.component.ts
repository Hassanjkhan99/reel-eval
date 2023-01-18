import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Chart} from "chart.js";
import {ReportService} from "../../../shared/services/report.service";

@Component({
  selector: 'app-plot-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plot-report.component.html',
  styleUrls: ['./plot-report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlotReportComponent implements OnInit {
  reportData: { x: number; y: number }[] = [];
  labelsData: string[] = [];

  constructor(private reportService: ReportService) {
  }

  ngOnInit(): void {
    this.reportService.getReportData().subscribe(e => {
      this.reportData = e.map(player => {
        return {x: player.score, y: player.iga_score ? player.iga_score : 0}
      })
      this.labelsData = e.map(e => e.prospect.first_name + ' ' + e.prospect.last_name)
      this.RenderScatterChart(this.reportData, this.labelsData);
    })
  }

  RenderScatterChart(dataset: { x: number; y: number }[], labels: string[]) {
    const data = {
      datasets: [{
        label: 'Report',
        title: 'labels',
        data: [{
          x: 4.5,
          y: 6.5,
          data: 'hii'
        }, {
          x: 7.5,
          y: 0,
          data: 'hii'

        }, {
          x: 0.5,
          y: 0,
          data: 'hii'

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
            grid: {
              display: false
            },
          },
          y: {
            type: 'linear',
            position: 'center',
            max: 100,
            min: 0,
            grid: {
              display: false
            }
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
          },
          legend: {
            display: false,
          }

        }
      },
      plugins: [quadrants]
    });

  }

}
