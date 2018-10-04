import {sampleSize, cloneDeep} from "lodash";
import {FX_CURRENCY_MATRIX, FX_CURRENCY_SYMBOLS} from '../static_data/staticData'
import {random} from "../utils/utils";

type ROW_DATA = { [key: string]: string | null | number }

export function createFxMatrixSnapshot() : ROW_DATA[]{
    const columns = FX_CURRENCY_MATRIX[0];
    const data = FX_CURRENCY_MATRIX.slice(1);

    let rowData = [];
    for (let i = 0; i < data.length; i++) {
        let currentRow = data[i];

        let row: ROW_DATA = {};
        for (let j = 0; j < columns.length; j++) {
            row[String(columns[j])] = currentRow[j];
        }

        // last, net and % change are different
        row['last'] = Math.floor(random(7000, 170000));
        row['net'] = Math.floor(random(-500, 500));

        let multiplier = ((Math.random() * 10) > 5) ? -1 : 1;
        row['pct_net_change'] = (multiplier * (random(30, 100) / 100)).toFixed(2);

        rowData.push(row);
    }

    return rowData;
}

export function applyDeltasToFxData(fxMatrixData: ROW_DATA[]) {
    let fxSymbolsToUpdate = sampleSize(FX_CURRENCY_SYMBOLS, FX_CURRENCY_SYMBOLS.length / 5);
    let rowsToUpdate = sampleSize(fxMatrixData, fxMatrixData.length / 5);
    for (let i = 0; i < rowsToUpdate.length; i++) {
        let row = rowsToUpdate[i];

        let last: number = <number>row.last;
        let maxSwing = last * 0.05; // max 5% swing
        let swing = Math.floor(random(-maxSwing, maxSwing));
        row.last = last + swing;
        row.net = swing;

        let multiplier = ((Math.random() * 10) > 5) ? -1 : 1;
        row['pct_net_change'] = (multiplier * (random(30, 100) / 100)).toFixed(2);

        for (let symbolToUpdate of fxSymbolsToUpdate) {
            if (row[symbolToUpdate] === null) {
                continue;
            }

            let multiplier = ((Math.random() * 10) > 8) ? -1 : 1;
            row[symbolToUpdate] = (multiplier * Math.random()).toFixed(2);
        }
    }
}

export function calculateTopMovers(fxMatrixData: ROW_DATA[]) {
    let fxData = cloneDeep(fxMatrixData);
    fxData.sort((a: ROW_DATA, b: ROW_DATA) => {
        return Math.abs(<number>b.pct_net_change) - Math.abs(<number>a.pct_net_change);
    });

    return fxData.slice(0, 20);
}
