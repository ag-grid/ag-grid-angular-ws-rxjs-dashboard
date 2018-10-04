import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromFinancialData from './financial-data.reducer';
import * as fromChartData from './chart-data.reducer';

export interface State {

  financialData: fromFinancialData.State;
  chartData: fromChartData.State;
}

export const reducers: ActionReducerMap<State> = {

  financialData: fromFinancialData.reducer,
  chartData: fromChartData.reducer,
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
