import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CandleStickChartComponent } from './candle-stick-chart/candle-stick-chart.component';
import { OrderBookComponent } from './order-book/order-book.component';
import { WebSocketService } from '../services/candle-stick-service/web-socket.service';
import { NgApexchartsModule } from "ng-apexcharts";
import { HeaderComponent } from './header/header.component';
import { DayDetailsComponent } from './day-details/day-details.component';
import { OrderDetailsComponent } from './order-details/order-details.component';



@NgModule({
  declarations: [
    AppComponent,
    OrderBookComponent,
    CandleStickChartComponent,
    HeaderComponent,
    DayDetailsComponent,
    OrderDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgApexchartsModule
  ],
  providers: [
    provideClientHydration(),
    WebSocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
