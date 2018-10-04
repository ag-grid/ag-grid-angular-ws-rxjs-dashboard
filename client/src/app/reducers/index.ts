import {ActionReducerMap, MetaReducer} from '@ngrx/store';
import {environment} from '../../environments/environment';
import * as fromFinancialData from './financial-data.reducer';

export interface State {
    financialData: fromFinancialData.State;
}

export const reducers: ActionReducerMap<State> = {

    financialData: fromFinancialData.reducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
