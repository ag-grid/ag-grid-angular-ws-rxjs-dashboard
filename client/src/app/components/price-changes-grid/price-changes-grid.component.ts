import {Component} from '@angular/core';
import {WebSocketSubject} from 'rxjs/webSocket';
import {Subject} from "rxjs/Rx";
import {GridApi, GridReadyEvent} from "ag-grid-community";
import {MESSAGE_DATA, ROW_DATA} from "../../types/types";
import {FirstDataRenderedEvent} from "ag-grid-community/dist/lib/events";
import {StockChartService} from "../../services/stock-chart.service";

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

    private socket$: Subject<MESSAGE_DATA>;

    constructor(private stockChartService: StockChartService) {
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
        this.initWebSocket();
    }

    private onFirstDataRendered(params: FirstDataRenderedEvent) {
        // select the first symbol to show the chart
        this.api.getModel().getRow(0).setSelected(true);

        this.api.sizeColumnsToFit();
    }

    private initWebSocket() {
        this.socket$ = new WebSocketSubject('ws:localhost:8999');

        const that = this;
        this.socket$.subscribe(
            (messageData) => that.rowData = messageData.tickerData,
            (err) => console.error(err)
        );
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

        this.stockChartService.setSelectedTickerDetail(selectedNode ? selectedNode.data.tickerDetail : null)
    }
}
