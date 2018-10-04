import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";

import * as fromFinancialData from '../../reducers/financial-data.reducer';

@Component({
    selector: 'stock-price-delta-panel',
    template: `
        <div *ngIf="pricingDelta">
            <span class="price">
                {{numberFormatter(currentPrice)}}
            </span>
            <div style="display: inline-block">
                <span class="delta">
                    <span [ngClass]="{'positiveSwingStyle': delta >= 0, 'negativeSwingStyle': delta < 0}">
                        {{this.numberFormatter(delta)}}
                    </span>
                    <span [ngClass]="{'positiveSwingStyle': delta >= 0, 'negativeSwingStyle': delta < 0}">
                        ({{numberFormatter(deltaPercentage)}}%)
                    </span>
                </span>
            </div>
        </div>
    `,
    styles: [`
        .price {
            font-size: 2.6em;
            font-weight: bold;
            margin-right: 10px
        }

        .delta {
            font-weight: normal;
            font-size: 1.8em;
            vertical-align: bottom
        }

        .positiveSwingStyle {
            color: #093;
            margin-right: 5px
        }

        .negativeSwingStyle {
            color: #d14836;
            margin-right: 5px
        }
    `]
})
export class StockPriceDeltaPanelComponent implements OnInit {
    private pricingDelta: any;
    private currentPrice: any;
    private delta: any;
    private deltaPercentage: any;

    constructor(private store: Store<{ financialData: fromFinancialData.State }>) {
    }

    ngOnInit() {
        this.store.subscribe((messageData) => {
                this.pricingDelta = messageData ? messageData.financialData.pricingDelta : null;
                this.updatePricingData();
            }
        );
    }

    updatePricingData() {
        if (!this.pricingDelta) {
            return;
        }
        this.currentPrice = this.pricingDelta.currentPrice;
        this.delta = this.pricingDelta.currentPrice - this.pricingDelta.previousPrice;
        this.deltaPercentage = (this.pricingDelta.currentPrice - this.pricingDelta.previousPrice) / this.pricingDelta.currentPrice;
    }

    numberFormatter(input) {
        return input ? input.toFixed(2) : null;
    }
}
