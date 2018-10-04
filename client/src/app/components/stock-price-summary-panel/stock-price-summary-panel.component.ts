import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import * as fromFinancialData from '../../reducers/financial-data.reducer';

@Component({
    selector: 'stock-price-summary-panel',
    template: `
        <div>
            {{timestamp}}
        </div>
        <div style="font-size: 13px" *ngIf="tickerSummary">
            <table style="display: inline-block; vertical-align: top; border-collapse: collapse">
                <tbody>
                <tr>
                    <td class="key">Range</td>
                    <td class="value">{{tickerSummary.range}}</td>
                </tr>
                <tr>
                    <td class="key">52 week</td>
                    <td class="value">{{tickerSummary.fiftyTwoWeek}}</td>
                </tr>
                <tr>
                    <td class="key">Open</td>
                    <td class="value">{{tickerSummary.open}}</td>
                </tr>
                <tr>
                    <td class="key">Vol / Avg.</td>
                    <td class="value">{{tickerSummary.vol}}/{{tickerSummary.avg}}
                    </td>
                </tr>
                </tbody>
            </table>
            <table class="table">
                <tbody>
                <tr>
                    <td class="key">Div/yield</td>
                    <td class="value">{{tickerSummary.dividend}}/{{tickerSummary.yld}}</td>
                </tr>
                <tr>
                    <td class="key">EPS</td>
                    <td class="value">{{tickerSummary.eps}}</td>
                </tr>
                <tr>
                    <td class="key">Shares</td>
                    <td class="value">{{tickerSummary.shares}}</td>
                </tr>
                <tr>
                    <td class="key">Market Cap</td>
                    <td class="value">{{tickerSummary.marketCap}}</td>
                </tr>
                </tbody>
            </table>
        </div>
    `,
    styles: [`
        .key {
            color: #666
        }

        .value {
            text-align: right;
        }

        .table {
            display: inline-block;
            vertical-align: top;
            border-collapse: collapse
        }
    `]
})
export class StockPriceSummaryPanelComponent implements OnInit {
    private tickerSummary: any;
    private timestamp: string;

    constructor(private store: Store<{ financialData: fromFinancialData.State }>) {
    }

    ngOnInit() {
        this.store.subscribe((messageData) => {
                this.tickerSummary = messageData ? messageData.financialData.tickerSummary : null;
                this.timestamp = messageData.financialData ? messageData.financialData.timestamp : null;
            }
        );
    }
}
