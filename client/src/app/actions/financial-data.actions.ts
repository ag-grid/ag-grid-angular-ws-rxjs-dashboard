import {Action} from '@ngrx/store';
import {MESSAGE_DATA, TICKER_DETAIL} from "src/app/types/types";

export enum FinancialDataActionTypes {
    LoadFinancialData = '[FinancialData] Load FinancialData',
    UpdateChartData = '[FinancialData] UpdateChartData'
}

export class LoadFinancialData implements Action {
    readonly type = FinancialDataActionTypes.LoadFinancialData;

    constructor(public payload: MESSAGE_DATA) {
    }
}

export class UpdateChartData implements Action {
    readonly type = FinancialDataActionTypes.UpdateChartData;

    constructor(public payload: TICKER_DETAIL) {
    }
}

export type FinancialDataActions = LoadFinancialData | UpdateChartData;
