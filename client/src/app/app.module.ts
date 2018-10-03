import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';

import {AgGridModule} from 'ag-grid-angular';
import {HorizontalBarComponent} from './components/renderers/horizontal-bar/horizontal-bar.component';
import {FxQuoteMatrixComponent} from "./components/fx-quote-matrix/fx-quote-matrix.component";
import {PriceChangesGridComponent} from './components/price-changes-grid/price-changes-grid.component';
import {TopMoversGridComponent} from './components/top-movers-grid/top-movers-grid.component';
import {StockPriceDeltaPanelComponent} from './components/stock-price-delta-panel/stock-price-delta-panel.component';
import {StockPriceSummaryPanelComponent} from './components/stock-price-summary-panel/stock-price-summary-panel.component';
import {StockPriceHistoricalChartPanelComponent} from './components/stock-price-historical-chart-panel/stock-price-historical-chart-panel.component';

@NgModule({
    declarations: [
        AppComponent,
        FxQuoteMatrixComponent,
        HorizontalBarComponent,
        PriceChangesGridComponent,
        TopMoversGridComponent,
        StockPriceDeltaPanelComponent,
        StockPriceSummaryPanelComponent,
        StockPriceHistoricalChartPanelComponent,
    ],
    imports: [
        BrowserModule,
        AgGridModule.withComponents([HorizontalBarComponent])
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
