import {Component} from '@angular/core';
import {WebSocketSubject} from 'rxjs/webSocket';
import {Subject} from "rxjs/Rx";
import {HorizontalBarComponent} from "./components/renderers/horizontal-bar/horizontal-bar.component";
import {FX_CURRENCY_SYMBOLS} from "./data/staticData";
import {GridApi, GridReadyEvent} from "ag-grid-community";

export class RowData {
    constructor(public content: string) {
    }
}

@Component({
    selector: 'app-root',
    template: `
        <ag-grid-angular style="height: 410px; width: 900px;"
                         class="ag-theme-fresh"

                         [columnDefs]="columnDefs"
                         [rowData]="rowData"

                         deltaRowDataMode

                         [getRowNodeId]="getRowNodeId"

                         (gridReady)="onGridReady($event)">
        </ag-grid-angular>
    `,
    styles: [`
    `]
})
export class AppComponent {
    private api: GridApi;

    private columnDefs: any;
    private rowData: RowData;

    private socket$: Subject<RowData>;

    constructor() {
        this.columnDefs = this.createColumnDefs();
    }

    private onGridReady(params: GridReadyEvent) {
        this.api = params.api;
        this.initWebSocket();
    }

    private initWebSocket() {
        this.socket$ = new WebSocketSubject('ws:localhost:8999');

        const that = this;
        this.socket$.subscribe(
            (rowData) => that.rowData = rowData,
            (err) => console.error(err)
        );
    }

    getRowNodeId(data) {
        return data.symbol;
    }

    createColumnDefs(): any {
        const FX_DELTA_HEADERS = [
            {
                field: 'symbol',
                headerName: 'Symbol',
                width: 85
            },
            {
                field: 'last',
                headerName: 'Last',
                headerClass: 'align-right',
                cellRenderer: 'agAnimateShowChangeCellRenderer',
                cellClass: 'align-right',
                width: 80
            },
            {
                field: 'net',
                headerName: 'Net',
                headerClass: 'align-right',
                cellRenderer: 'agAnimateShowChangeCellRenderer',
                cellClass: 'align-right',
                width: 80
            },
            {
                field: 'pct_net_change',
                headerName: '% NC',
                cellRendererFramework: HorizontalBarComponent,
                width: 85
            }
        ];

        let currencyColumns: any[] = FX_CURRENCY_SYMBOLS.map((symbol) => {
            "use strict";
            return {
                field: symbol,
                headerName: symbol,
                width: 96,
                cellClass: 'align-right',
                cellRenderer: 'agAnimateShowChangeCellRenderer',
                cellClassRules: {
                    'fx-positive': 'x > 0.8',
                    'fx-null': 'x === null',
                    'fx-negative': 'x < -0.8'
                }
            }
        });

        return FX_DELTA_HEADERS.concat(currencyColumns);
    }

}