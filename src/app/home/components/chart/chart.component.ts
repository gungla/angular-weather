import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  @Input() chartData: Object[];

  forecastDataForChart: Object[] = []
  view: number[] = [600, 300];
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'celsius°';
  colorScheme: Object = { domain: ['#5542ff'] };
  showLabels: boolean = true;
  showDataLebel: boolean = true
  roundDomains: boolean = true
  yScaleMin: number = 0
  roundEdges: boolean = false

  constructor() { }

  ngOnInit() {
    for (let i: number = 0; i < this.chartData.length; i++) {
      let name: string = this.chartData[i]['dt_txt'].split(' ')[1]
      this.forecastDataForChart.push({
        'name': name.substring(0, name.length - 3),
        'value': this.chartData[i]['main']['temp']
      })
    }
    let temperatures = []
    for (const data in this.forecastDataForChart) {
      temperatures.push(this.forecastDataForChart[data]['value'])
    }
    this.yScaleMin = Math.min(...temperatures)
  }

}
