import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../../services/candle-stick-service/web-socket.service';

@Component({
  selector: 'app-order-book',
  templateUrl: './order-book.component.html',
  styleUrls: ['./order-book.component.scss']
})
export class OrderBookComponent implements OnInit {

  orderBook: { bids: [number, number][], asks: [number, number][] } = {
    bids: [],
    asks: [],
  };
  maxEntries: number = 8;  // We want exactly 8 entries

  previousBids: [number, number][] = [];
  previousAsks: [number, number][] = [];

  constructor(private websocketService: WebSocketService) { }

  ngOnInit(): void {
    this.subscribeToWebSocket();
  }

  private subscribeToWebSocket(): void {
    this.websocketService.getMessages().subscribe((message: any) => {
      if (message.data.b && message.data.a) {
        this.updateOrderBook(message.data.b, 'bids');
        this.updateOrderBook(message.data.a, 'asks');
      }
    });
  }

  private updateOrderBook(newData: any[], type: 'bids' | 'asks'): void {
    // Format each bid/ask value to ensure two decimal places
    const formattedData: [number, number][] = newData.map((item: any) => [
      parseFloat(item[0]), // price
      parseFloat(item[1])  // quantity
    ]);

    // Sort bids and asks: 
    // - Bids remain sorted in descending order (highest to lowest)
    // - Asks should also be sorted in descending order (highest to lowest)
    const sortedData = (type === 'bids') ? 
      formattedData.sort((a, b) => b[0] - a[0]) :  // Sort bids in descending order
      formattedData.sort((a, b) => b[0] - a[0]);   // Sort asks in descending order as well

    // Keep track of the previous records
    const currentData = this.orderBook[type];

    // Always ensure we have exactly 8 records
    if (sortedData.length > 0) {
      // Merge the new data with previous data and slice to maxEntries (8)
      this.orderBook[type] = [...sortedData, ...currentData].slice(0, this.maxEntries);
    } else {
      // If no new data, maintain the previous data, limiting to maxEntries (8)
      this.orderBook[type] = currentData.slice(0, this.maxEntries);
    }

    // Store the current data for the next update to ensure fallback if data is missing
    if (type === 'bids') {
      this.previousBids = [...this.orderBook.bids];
    } else {
      this.previousAsks = [...this.orderBook.asks];
    }
  }
}
