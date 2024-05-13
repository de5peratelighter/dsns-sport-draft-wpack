// стартовий (бойове розгортання)

import { WidthType, Table, TableRow, TableCell, TableLayoutType } from "docx";

import {
    spacer,
    invisibleBorder,
    cellBorders,
    rowBorders,
    allCellBorders,
    cellObject,
} from "../defaultUtilBlocks";

const categoryMapping = {
    "CMS": "КМС",
    "MS": "МС",
    "HMS": "ЗМС",
    // Додайте інші кваліфікації за необхідності
};

const TABLE_START_PROTOCOL_COMBAT_RESULTS_HEAD = (item) => {
    return new TableRow({
        children: [
            new TableCell(cellObject({ text: item.set, width: 6 })),
            new TableCell({
                width: {
                    size: 94,
                    type: WidthType.PERCENTAGE,
                },
                children: [
                    new Table({
                        layout: TableLayoutType.FIXED,
                        width: {
                            size: 100,
                            type: WidthType.PERCENTAGE,
                        },
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell(
                                        cellObject({
                                            text: item.track,
                                            width: 7,
                                            size: 24,
                                            borders: cellBorders,
                                        }) 
                                    ),
                                    new TableCell(
                                        cellObject({
                                            text: item.team,
                                            width: 18,
                                            size: 24,
                                            borders: cellBorders,
                                        })
                                    ),
                                    new TableCell(
                                        cellObject({
                                            text: item.number,
                                            width: 8,
                                            size: 24,
                                            borders: cellBorders,
                                        })
                                    ),
                                    new TableCell(
                                        cellObject({
                                            text: categoryMapping[item.category] || item.category,
                                            width: 10,
                                            size: 24,
                                            borders: cellBorders,
                                            vertical: true,
                                        })
                                    ),
                                    new TableCell(
                                        cellObject({
                                            text: item.initials,
                                            width: 20,
                                            size: 24,
                                            borders: cellBorders,
                                        })
                                    ),
                                    new TableCell(
                                        cellObject({
                                            text: item.bday,
                                            width: 10,
                                            borders: cellBorders,
                                        })
                                    ),
                                    new TableCell(
                                        cellObject({
                                            text: item.first,
                                            width: 10,
                                            borders: cellBorders,
                                        })
                                    ),
                                    new TableCell(
                                        cellObject({
                                            text: item.second,
                                            width: 10,
                                            borders: cellBorders,
                                        })
                                    ),
                                    new TableCell(
                                        cellObject({
                                            text: item.best,
                                            width: 10,
                                            borders: allCellBorders,
                                        })
                                    ),
                                ],
                            }),
                        ],
                    }),
                ],
            }),
        ],
    });
};

const TABLE_START_PROTOCOL_COMBAT_RESULTS_ROW = (item) => {
    return new TableRow({
        children: [
            new TableCell(
                cellObject({
                    text: item.set,
                    width: 6,
                    borders: rowBorders, // Додаємо border для рядка
                })
            ),
            new TableCell({
                width: {
                    size: 94,
                    type: WidthType.PERCENTAGE,
                },
                children: [
                    new Table({
                        layout: TableLayoutType.FIXED,
                        width: {
                            size: 100,
                            type: WidthType.PERCENTAGE,
                        },
                        rows: item.participants.map((participant, index) => {
                            const borders = index === item.participants.length - 1 ? { ...rowBorders, bottom: invisibleBorder } : rowBorders;
                            return new TableRow({
                                children: [
                                    new TableCell(
                                        cellObject({
                                            text: participant.track,
                                            width: 7,
                                            size: 24,
                                            borders: cellBorders,
                                        })
                                    ),
                                    new TableCell(
                                        cellObject({
                                            text: participant.team,
                                            width: 18,
                                            size: 24,
                                            borders: cellBorders,
                                        })
                                    ),
                                    new TableCell(
                                        cellObject({
                                            text: participant.number,
                                            width: 8,
                                            size: 24,
                                            borders,
                                        })
                                    ),
                                    new TableCell(
                                        cellObject({
                                            text: categoryMapping[participant.category] || participant.category,
                                            width: 10,
                                            size: 24,
                                            borders,
                                            vertical: true,
                                        })
                                    ),
                                    new TableCell(
                                        cellObject({
                                            text: participant.initials,
                                            width: 20,
                                            size: 24,
                                            borders,
                                        })
                                    ),
                                    new TableCell(
                                        cellObject({
                                            text: participant.bday,
                                            width: 10,
                                            borders,
                                        })
                                    ),
                                    new TableCell(
                                        cellObject({
                                            text: participant.firstResult,
                                            width: 10,
                                            borders: cellBorders,
                                        })
                                    ),
                                    new TableCell(
                                        cellObject({
                                            text: participant.secondResult,
                                            width: 10,
                                            borders: cellBorders,
                                        })
                                    ),
                                    new TableCell(
                                        cellObject({
                                            text: participant.bestResult,
                                            width: 10,
                                            borders: allCellBorders,
                                        })
                                    ),
                                ],
                            });
                        }),
                    }),
                ],
            }),
        ],
    });
};


export const TABLE_START_PROTOCOL_COMBAT_RESULTS = (items) => {
    return [
        ...items.map((data) => {
            return new Table({
                rows: [
                    TABLE_START_PROTOCOL_- COMBAT_RESULTS_HEAD(data.head),
                    ...data.rows.map((item) => TABLE_START_PROTOCOL_COMBAT_RESULTS_ROW(item)),
                ],                             
                layout: TableLayoutType.FIXED,
                width: {
                    size: 100,
                    type: WidthType.PERCENTAGE,
                },
            });
        }),
        spacer,
    ];
};