import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';

import {AgGridModule} from 'ag-grid-angular';
import { HorizontalBarComponent } from './components/renderers/horizontal-bar/horizontal-bar.component';
import {FxQuoteMatrixComponent} from "./components/fx-quote-matrix/fx-quote-matrix.component";

@NgModule({
    declarations: [
        AppComponent,
        FxQuoteMatrixComponent,
        HorizontalBarComponent,
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
