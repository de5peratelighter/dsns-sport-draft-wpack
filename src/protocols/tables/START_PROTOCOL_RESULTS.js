import { WidthType, Table, TableRow, TableCell, TableLayoutType } from "docx";

import {
  spacer,
  invisibleBorder,
  cellBorders,
  rowBorders,
  allCellBorders,
  cellObject,
} from "../defaultUtilBlocks";

const TABLE_START_PROTOCOL_RESULTS_HEAD = (item) => {
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
                      text: item.number,
                      width: 8,
                      size: 24,
                      borders: cellBorders,
                    })
                  ),
                  new TableCell(
                    cellObject({
                      text: item.category,
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
                      text: item.team,
                      width: 18,
                      size: 24,
                      borders: cellBorders,
                    })
                  ),
                  new TableCell({
                    columnSpan: 3,
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
                                  text: item.results,
                                  width: 90,
                                  borders: { ...rowBorders, right: invisibleBorder },
                                  columnSpan: 3,
                                })
                              ),
                            ],
                          }),
                          new TableRow({
                            children: [
                              new TableCell(
                                cellObject({
                                  text: item.first,
                                  width: 30,
                                  borders: cellBorders,
                                })
                              ),
                              new TableCell(
                                cellObject({
                                  text: item.second,
                                  width: 30,
                                  borders: cellBorders,
                                })
                              ),
                              new TableCell(
                                cellObject({
                                  text: item.best,
                                  width: 30,
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
              }),
            ],
          }),
        ],
      }),
    ],
  });
};

const TABLE_START_PROTOCOL_RESULTS_ROW = (item) => {
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
            rows: item.participants.map((participant, index) => {
              const borders =
                index === item.participants.length - 1
                  ? { ...rowBorders, bottom: invisibleBorder }
                  : rowBorders;
              return new TableRow({
                children: [
                  new TableCell(
                    cellObject({
                      text: participant.track,
                      width: 7,
                      size: 24,
                      borders,
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
                      text: participant.category,
                      width: 10,
                      size: 24,
                      borders,
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
                      size: 24,
                      borders,
                    })
                  ),
                  new TableCell(
                    cellObject({
                      text: participant.team,
                      width: 18,
                      size: 24,
                      borders,
                    })
                  ),
                  new TableCell({
                    columnSpan: 3,
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
                                  text: participant.firstResult,
                                  width: 30,
                                  borders: cellBorders,
                                })
                              ),
                              new TableCell(
                                cellObject({
                                  text: participant.secondResult,
                                  width: 30,
                                  borders: cellBorders,
                                })
                              ),
                              new TableCell(
                                cellObject({
                                  text: participant.bestResult,
                                  width: 30,
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
            }),
          }),
        ],
      }),
    ],
  });
};

const TABLE_CATEGORY_RECORDS_ROW = (item) => {
  return [
    new TableRow({
      children: [
        new TableCell(
          cellObject({
            text: item.category,
            width: 100,
            size: 24,
            borders: cellBorders,
            columnSpan: 7 // Якщо в таблиці 7 колонок, тоді використовуємо columnSpan: 7
          })
        ),
      ],
    }),
    new TableRow({
      children: [
        new TableCell(
          cellObject({
            text: item.records,
            width: 100,
            size: 24,
            borders: cellBorders,
            columnSpan: 7 // Якщо в таблиці 7 колонок, тоді використовуємо columnSpan: 7
          })
        ),
      ],
      margins: { bottom: 200 }
    }),
  ];
};

export const TABLE_START_PROTOCOL_RESULTS = (items) => {
  return [
    ...items.map((data) => {
      return new Table({
        rows: [
          ...TABLE_CATEGORY_RECORDS_ROW(data.head), // Додаємо нові рядки перед головкою таблиці
          TABLE_START_PROTOCOL_RESULTS_HEAD(data.head),
          ...data.rows.map((item) => TABLE_START_PROTOCOL_RESULTS_ROW(item)),
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
