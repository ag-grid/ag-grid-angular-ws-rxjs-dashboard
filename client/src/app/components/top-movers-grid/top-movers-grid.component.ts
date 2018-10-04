import {Component} from '@angular/core';
import {GridApi, GridReadyEvent} from "ag-grid-community";
import {Store} from "@ngrx/store";

import {FirstDataRenderedEvent} from "ag-grid-community/dist/lib/events";
import {ROW_DATA} from "../../types/types";
import * as fromFinancialData from '../../reducers/financial-data.reducer';

@Component({
    selector: 'top-movers-grid',
    template: `
        <ag-grid-angular style="height: 410px; width: 400px;"
                         class="ag-theme-fresh"

                         [columnDefs]="columnDefs"
                         [rowData]="rowData"

                         enableSorting
                         deltaRowDataMode
                         animateRows

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

    constructor(private store: Store<{ financialData: fromFinancialData.State }>) {
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
        this.store.subscribe((messageData) => this.rowData = messageData.financialData.topMovers);
    }

    private onFirstDataRendered(params: FirstDataRenderedEvent) {
        this.api.sizeColumnsToFit();
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

