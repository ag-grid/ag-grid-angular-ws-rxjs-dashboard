import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {WebSocketSubject} from "rxjs/internal/observable/dom/WebSocketSubject";
import {Subject} from "rxjs/Rx";

import {MESSAGE_DATA} from "./types/types";
import * as fromFinancialData from './reducers/financial-data.reducer';
import {LoadFinancialData} from "./actions/financial-data.actions";

@Component({
    selector: 'app-root',
    template: `
        <div style="width: 1250px">
            <div>
                <div style="float: left; margin-right: 25px">
                    <price-changes-grid></price-changes-grid>
                </div>
                <div style="float: left">
                    <stock-price-delta-panel></stock-price-delta-panel>
                    <stock-price-summary-panel></stock-price-summary-panel>
                    <stock-price-historical-chart-panel></stock-price-historical-chart-panel>
                </div>
            </div>
            <div style="width: 100%; clear: both; padding-top: 25px">
                <div>
                    <div style="float: left; margin-right: 25px">
                        <fx-quote-matrix></fx-quote-matrix>
                    </div>
                    <div style="float: left">
                        <top-movers-grid></top-movers-grid>
                    </div>
                </div>
            </div>
        </div>

    `,
    styles: [`
    `]
})
export class AppComponent implements OnInit {
    private socket$: Subject<MESSAGE_DATA>;

    constructor(private store: Store<{ financialData: fromFinancialData.State }>) {
    }

    ngOnInit(): void {
        this.socket$ = new WebSocketSubject('ws:localhost:8999');

        this.socket$.subscribe(
            (messageData) => this.store.dispatch(new LoadFinancialData(messageData)),
            (err) => console.error(err)
        );
    }
}