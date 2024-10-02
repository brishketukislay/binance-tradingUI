import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../services/candle-stick-service/web-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit() {  }

  // sendTestMessage() {
  //    this.webSocketService.sendMessage({ type: 'test', message: 'Hello WebSocket!' });
  // }

  // closeConnection() {
  //    this.webSocketService.closeConnection();
  // }
}
