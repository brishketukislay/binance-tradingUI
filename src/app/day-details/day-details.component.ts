import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../../services/candle-stick-service/web-socket.service';

@Component({
  selector: 'app-day-details',
  templateUrl: './day-details.component.html',
  styleUrls: ['./day-details.component.scss'],
})
export class DayDetailsComponent implements OnInit {
  public currentPrice: number = 0;
  public dayHigh: number = 0;
  public dayLow: number = 0;
  public turnover: number = 0;
  public turnoverUSD: number = 0;
  public changePercentage: number = 0;
  public previousClose: number = 0;
  public priceUSD: number = 0;
  public changeClass: string = '';

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.subscribeToWebSocket();
  }

  private subscribeToWebSocket(): void {
    this.webSocketService.getMessages().subscribe((message) => {
      // console.log('web socket started', message.type);
      // && message.data.k
      if (message && message.type === 'candlestick' ) {
        this.updateDayDetails(message.data.k);
      }
    });
  }

  // Update the details based on the candlestick data
  private updateDayDetails(data: any): void {
    // console.log('data here',data);
    this.currentPrice = parseFloat(data.c);
    this.dayHigh = parseFloat(data.h);
    this.dayLow = parseFloat(data.l);
    this.turnover = parseFloat(data.v);
    this.turnoverUSD = parseFloat(data.q);
    this.previousClose = parseFloat(data.o);
    this.changePercentage = parseFloat((((this.currentPrice - this.previousClose) / this.previousClose) * 100).toFixed(2));

    this.changeClass = this.changePercentage >= 0 ? 'positive' : 'negative';
    this.priceUSD = this.currentPrice;
    // console.log('day details ->','crrnt', this.currentPrice, this.dayHigh, this.dayLow, this.turnover, this.changePercentage )
  }
}
