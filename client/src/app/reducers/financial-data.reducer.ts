import {Action} from '@ngrx/store';

export type ROW_DATA = { [key: string]: string | null | number }

export interface State {
    fxData: ROW_DATA[];
    topMovers: ROW_DATA[];
}

export const initialState: State = {
    fxData: null,
    topMovers: null
};

export function reducer(state = initialState, action: Action): State {
    switch (action.type) {

        default:
            return state;
    }
}
