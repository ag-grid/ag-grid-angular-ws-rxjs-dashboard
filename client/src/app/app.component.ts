import {Component} from '@angular/core';

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
export class AppComponent {
}