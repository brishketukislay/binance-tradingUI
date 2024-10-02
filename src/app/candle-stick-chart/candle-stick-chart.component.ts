import { Component, OnInit, ViewChild } from '@angular/core';
import { WebSocketService } from '../../services/candle-stick-service/web-socket.service';
import { ChartComponent, ApexAxisChartSeries, ApexChart, ApexYAxis, ApexXAxis, ApexTitleSubtitle } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-candle-stick-chart',
  templateUrl: './candle-stick-chart.component.html',
  styleUrls: ['./candle-stick-chart.component.scss'],
})
export class CandleStickChartComponent implements OnInit {
  public chartData: any[] = []; // Array for candlestick data
  public storedData: any;
  @ViewChild('chart') chart: ChartComponent | undefined;
  public chartOptions: Partial<ChartOptions> = {
    series: [],
    chart: { type: 'candlestick', height: 300 },
    title: { text: 'CandleStick Chart', align: 'left' },
    xaxis: { type: 'datetime' },
    yaxis: { tooltip: { enabled: true } },
  };

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit(): void {
    this.loadStoredCandlestickData();
    this.initializeChart();
    this.subscribeToWebSocket();
  }


  private loadStoredCandlestickData(): void {
    if(typeof window !== 'undefined'){ // to avoid sessionstorage error
      this.storedData = sessionStorage?.getItem('candlestickData');
    }    
    if (this.storedData) {
      this.chartData = JSON.parse(this.storedData).map((candle: any) => ({
        ...candle,
        x: new Date(candle.x), // converting timestamps to Date objects
      }));
      if (this.chartData.length > 15) {
        this.chartData = this.chartData.slice(-15); // only last 15 candles to show
      }
    }
  }

  private initializeChart(): void {
    this.chartOptions.series = [
      {
        name: 'candle',
        data: this.chartData,
      },
    ];
  }

  // Subscribe to the WebSocket
  private subscribeToWebSocket(): void {
    this.webSocketService.getMessages().subscribe((message) => {
      if (message && message.type === 'candlestick') {
        this.processCandlestickData(message.data.k);
      }
    });
  }

  // Process incoming WebSocket candlestick data and update the chart
  private processCandlestickData(candlestickData: any): void {
    if (candlestickData) {
      const newCandle = {
        x: new Date(candlestickData.t), // Timestamp
        y: [
          candlestickData.o,
          candlestickData.h,
          candlestickData.l,
          candlestickData.c,
        ],
      };

      // Check if the timestamp already exists in the chartData
      const existingIndex = this.chartData.findIndex((candle) => candle.x.getTime() === newCandle.x.getTime());

      if (existingIndex === -1) {
        this.chartData.push(newCandle);
      } else {
        this.chartData[existingIndex] = newCandle;// updat existing candle
      }

      if (this.chartData.length > 15) {
        this.chartData.shift();
      }

      if (this.chartOptions && this.chartOptions.series) {
        this.chartOptions.series = [
          {
            name: 'candle',
            data: [...this.chartData],
          },
        ];
      }

      if (this.chart) {
        this.chart.updateSeries(this.chartOptions.series as ApexAxisChartSeries, true);
      }
        sessionStorage.setItem('candlestickData', JSON.stringify(this.chartData));
    }
  }
}
