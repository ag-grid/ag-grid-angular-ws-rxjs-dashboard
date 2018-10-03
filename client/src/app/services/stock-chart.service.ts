import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable({
    providedIn: 'root'
})
export class StockChartService {
    private currentExchangeTickerDataSource = new Subject<void>();
    public currentExchangeTickerData$ = this.currentExchangeTickerDataSource.asObservable();

    public setSelectedTickerDetail(tickerDetail: any) {
        this.currentExchangeTickerDataSource.next(tickerDetail);
    }
}
