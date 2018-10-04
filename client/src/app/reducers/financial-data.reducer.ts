import {Action} from '@ngrx/store';
import {MESSAGE_DATA, TICKER_DETAIL} from "../types/types";
import {FinancialDataActionTypes, LoadFinancialData, UpdateChartData} from "../actions/financial-data.actions";

export interface State extends MESSAGE_DATA, TICKER_DETAIL {
    historicalData: any,
    pricingDelta: any
}

export const initialState: State = {
    fxData: null,
    topMovers: null,
    tickerData: null,
    historicalData: null,
    pricingDelta: null,
    tickerSummary: null,
    timestamp: null
};

export function reducer(state = initialState, action: Action): State {
    switch (action.type) {
        case FinancialDataActionTypes.LoadFinancialData: {
            const {fxData, topMovers, tickerData} = (<LoadFinancialData>action).payload;
            return {
                ...state,
                fxData,
                topMovers,
                tickerData
            }
        }
        case FinancialDataActionTypes.UpdateChartData: {
            const {historicalData, pricingDelta, tickerSummary, timestamp} = (<UpdateChartData>action).payload;
            return {
                ...state,
                historicalData,
                pricingDelta,
                tickerSummary,
                timestamp
            }
        }
        default: {
            return state;
        }
    }
}
