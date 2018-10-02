import {Component} from '@angular/core';
import {ICellRendererParams} from "ag-grid-community";

@Component({
    selector: 'app-horizontal-bar',
    template: `
        <div style="position: relative">
            <div style="width: 50%">
                <svg width="100%" preserveAspectRatio="none">
                    <rect [attr.x]="barX" y="0"
                          [attr.width]="barWidth" height="20px"
                          rx="4" ry="4"
                          [ngStyle]="{'fill':pctNetChange >= 0 ? 'green' : 'red'}"/>
                </svg>
            </div>
            <div class="pct-value">{{pctNetChange}}</div>
        </div>
    `,
    styles: [`
        .pct-value {
            position: absolute;
            top: 0;
            width: 100%;
            text-align: right;
        }
    `]
})
export class HorizontalBarComponent {

    private pctNetChange: any;
    private barX: any;
    private barWidth: any;

    agInit(params: ICellRendererParams) {
        this.updateSvgBar(params);
    }

    refresh(params: ICellRendererParams) {
        this.updateSvgBar(params);
        return true;
    }

    private updateSvgBar(params: ICellRendererParams) {
        this.pctNetChange = params.value;

        let pctNetChangeBar = Math.min(Math.abs(this.pctNetChange) * 100, 100) / 2;
        this.barWidth = `${pctNetChangeBar}%`;
        this.barX = `${this.pctNetChange >= 0 ? '50' : 50 - pctNetChangeBar}%`;
    }
}
