import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket | null = null;
  private messagesSubject = new Subject<any>();

  constructor() {
    this.connectWebSocket();
  }

  private connectWebSocket(): void {
    if (typeof WebSocket !== 'undefined') {
      this.socket = new WebSocket('ws://localhost:8080');

      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.socket!.send(JSON.stringify({ type: 'subscribe', pair: 'SOLUSDT' }));
      };

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.messagesSubject.next(data);
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.socket.onclose = () => {
        console.log('WebSocket connection closed');
        setTimeout(() => this.connectWebSocket(), 5000);
      };
    } 
    // else {
    //   console.error('Error occured.');
    // }
  }

  getMessages() {
    return this.messagesSubject.asObservable();
  }
}
