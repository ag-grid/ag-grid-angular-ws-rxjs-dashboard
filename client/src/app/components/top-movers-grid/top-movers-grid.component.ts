import {Component} from '@angular/core';
import {GridApi, GridReadyEvent} from "ag-grid-community";
import {WebSocketSubject} from "rxjs/internal/observable/dom/WebSocketSubject";
import {FirstDataRenderedEvent} from "ag-grid-community/dist/lib/events";
import {MESSAGE_DATA, ROW_DATA} from "../../types/types";
import {Subject} from "rxjs/Rx";

@Component({
    selector: 'top-movers-grid',
    template: `
        <ag-grid-angular style="height: 410px; width: 400px;"
                         class="ag-theme-fresh"

                         [columnDefs]="columnDefs"
                         [rowData]="rowData"

                         enableSorting
                         deltaRowDataMode

                         rowSelection="single"

                         [getRowNodeId]="getRowNodeId"

                         (firstDataRendered)="onFirstDataRendered($event)"
                         (gridReady)="onGridReady($event)">
        </ag-grid-angular>
    `,
    styles: []
})
export class TopMoversGridComponent {
    private api: GridApi;

    private columnDefs: any[];
    private rowData: ROW_DATA;

    private socket$: Subject<MESSAGE_DATA>;

    constructor() {
        this.columnDefs = [
            {
                field: 'symbol',
                headerName: 'Symbol'
            },
            {
                field: 'last',
                headerName: 'Last',
                headerClass: 'align-right',
                cellRenderer: 'agAnimateShowChangeCellRenderer',
                cellClass: 'align-right'
            },
            {
                field: 'net',
                headerName: 'Net',
                headerClass: 'align-right',
                cellRenderer: 'agAnimateShowChangeCellRenderer',
                cellClass: 'align-right'
            },
            {
                field: 'pct_net_change',
                headerName: '% NC',
                headerClass: 'align-right',
                cellRenderer: 'agAnimateShowChangeCellRenderer',
                cellClass: 'align-right',
                sort: 'desc',
                valueFormatter: this.numberFormatter
            },
        ]
    }

    private onGridReady(params: GridReadyEvent) {
        this.api = params.api;
        this.initWebSocket();
    }

    private onFirstDataRendered(params: FirstDataRenderedEvent) {
        this.api.sizeColumnsToFit();
    }

    private initWebSocket() {
        this.socket$ = new WebSocketSubject('ws:localhost:8999');

        const that = this;
        this.socket$.subscribe(
            (messageData) => that.rowData = messageData.topMovers,
            (err) => console.error(err)
        );
    }

    getRowNodeId(data) {
        return data.symbol;
    }

    numberFormatter(params) {
        if (typeof params.value === 'number') {
            return params.value.toFixed(2);
        } else {
            return params.value;
        }
    }
}

