import {Component} from '@angular/core';
import {GridApi, GridReadyEvent} from "ag-grid-community";
import {Store} from "@ngrx/store";

import {ROW_DATA} from "../../types/types";
import {FirstDataRenderedEvent} from "ag-grid-community/dist/lib/events";
import * as fromFinancialData from '../../reducers/financial-data.reducer';
import {UpdateChartData} from "../../actions/financial-data.actions";

@Component({
    selector: 'price-changes-grid',
    template: `
        <ag-grid-angular style="height: 410px; width: 800px;"
                         class="ag-theme-fresh"

                         [columnDefs]="columnDefs"
                         [rowData]="rowData"

                         enableSorting
                         deltaRowDataMode

                         rowSelection="single"

                         [getRowNodeId]="getRowNodeId"

                         (selectionChanged)="onSelectionChanged()"
                         (firstDataRendered)="onFirstDataRendered($event)"
                         (gridReady)="onGridReady($event)">
        </ag-grid-angular>
    `,
    styles: []
})
export class PriceChangesGridComponent {
    private api: GridApi;

    private columnDefs: any[];
    private rowData: ROW_DATA;

    constructor(private store: Store<{ financialData: fromFinancialData.State }>) {
        this.columnDefs = [
            {
                field: 'symbol',
                headerName: 'Symbol',
                sort: 'asc'
            },
            {
                field: 'price',
                headerName: 'Price',
                valueFormatter: this.numberFormatter,
                cellRenderer: 'agAnimateShowChangeCellRenderer',
                cellStyle: {'text-align': 'right'}
            },
            {
                field: 'bid',
                headerName: 'Bid',
                valueFormatter: this.numberFormatter,
                cellRenderer: 'agAnimateShowChangeCellRenderer',
                cellStyle: {'text-align': 'right'}
            },
            {
                field: 'ask',
                headerName: 'Ask',
                valueFormatter: this.numberFormatter,
                cellRenderer: 'agAnimateShowChangeCellRenderer',
                cellStyle: {'text-align': 'right'}
            }
        ]
    }

    private onGridReady(params: GridReadyEvent) {
        this.api = params.api;
        this.store.subscribe((messageData) => this.rowData = messageData.financialData.tickerData);
    }

    private onFirstDataRendered(params: FirstDataRenderedEvent) {
        // select the first symbol to show the chart
        this.api.getModel().getRow(0).setSelected(true);

        this.api.sizeColumnsToFit();
    }

    numberFormatter(params) {
        if (typeof params.value === 'number') {
            return params.value.toFixed(2);
        } else {
            return params.value;
        }
    }

    getRowNodeId(data) {
        return data.symbol;
    }

    onSelectionChanged() {
        let selectedNode = this.api.getSelectedNodes()[0];
        this.store.dispatch(new UpdateChartData(selectedNode.data.tickerDetail))
    }
}
