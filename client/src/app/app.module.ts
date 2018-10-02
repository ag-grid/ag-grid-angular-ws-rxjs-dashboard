import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';

import {AgGridModule} from 'ag-grid-angular';
import { HorizontalBarComponent } from './components/renderers/horizontal-bar/horizontal-bar.component';

@NgModule({
    declarations: [
        AppComponent,
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
