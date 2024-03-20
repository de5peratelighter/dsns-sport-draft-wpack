import {
  Paragraph,
  HeadingLevel,
  AlignmentType,
  WidthType,
  Table,
  TableRow,
  TableCell,
  VerticalAlign,
  TableLayoutType,
  HeightRule,
} from "docx";

import {
  spacer,
  invisibleBorder,
  cellBorders,
  rowBorders,
  allCellBorders,
  multiLine,
  cellObject,
} from "../defaultUtilBlocks";

const TABLE_TEAM_RESULTS_HEAD = (item = { columns: [] }) => {
  const ItemColumnWidth = item.columns.length ? 100 / item.columns.length : 25;
  return new TableRow({
    children: [
      new TableCell(cellObject({ text: item.locationHeader, width: 10 })),
      new TableCell(cellObject({ text: item.teamHeader, width: 15 })),
      new TableCell({
        width: {
          size: 60,
          type: WidthType.PERCENTAGE,
        },
        children: [
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell(
                    cellObject({
                      text: item.unitedHeader,
                      borders: {
                        top: invisibleBorder,
                        left: invisibleBorder,
                        right: invisibleBorder,
                      },
                      columnSpan: 3,
                    })
                  ),
                ],
                tableHeader: true,
              }),
              new TableRow({
                children: item.columns.map((columnName, index) => {
                  return new TableCell({
                    children: [
                      new Table({
                        width: {
                          size: 100,
                          type: WidthType.PERCENTAGE,
                        },
                        rows: [
                          new TableRow({
                            height: { value: 700, rule: HeightRule.ATLEAST },
                            children: [
                              new TableCell(
                                cellObject({
                                  text: columnName,
                                  borders: {
                                    top: invisibleBorder,
                                    left: invisibleBorder,
                                    right: invisibleBorder,
                                  },
                                  columnSpan: 3,
                                })
                              ),
                            ],
                            tableHeader: true,
                          }),
                          new TableRow({
                            height: { value: 400, rule: HeightRule.EXACT },
                            children: [
                              new TableCell(
                                cellObject({
                                  text: "час",
                                  width: 100/3,
                                  borders: cellBorders,
                                })
                              ),
                              new TableCell(
                                cellObject({
                                  text: "зкс",
                                  width: 100/3,
                                  borders: cellBorders,
                                })
                              ),
                              new TableCell(
                                cellObject({
                                  text: "місце",
                                  width: 100/3,
                                  borders: {
                                    ...cellBorders,
                                    right: invisibleBorder,
                                  },
                                })
                              ),
                            ],
                          }),
                        ],
                      }),
                    ],
                    width: {
                      size: ItemColumnWidth,
                      type: WidthType.PERCENTAGE,
                    },
                    borders:
                      index === item.columns.length - 1
                        ? { ...cellBorders, right: invisibleBorder }
                        : cellBorders,
                  });
                }),
              }),
            ],
          }),
        ],
      }),
      new TableCell(cellObject({ text: item.totalHeader, width: 15 })),
    ],
  });
};

const TABLE_TEAM_RESULTS_NUM = (item = { columns: [] }) => {
  const ItemColumnWidth = item.columns.length ? 100 / item.columns.length : 25;
  //const cellWidth = 100/9; // Calculate the width for each cell
  return new TableRow({
    children:[
      new TableCell(cellObject ({text: "1", width: 10 })),
      new TableCell(cellObject ({text: "2", width: 15 })),
      new TableCell({
        children: [
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [
              new TableRow({
                children: item.columns.map((column, index) => {
                  return new TableCell({ 
                    children: [
                      new Table({
                        width: {
                          size: 100,
                          type: WidthType.PERCENTAGE,
                        },
                        rows: [
                          new TableRow({
                            children: [
                              new TableCell(
                                cellObject({
                                  text: column.three,
                                  width: 100/9,
                                  borders: cellBorders,
                                })
                              ),
                              new TableCell(
                                cellObject({
                                  text: column.four,
                                  width: 100/9,
                                  borders: cellBorders,
                                })
                              ),
                              new TableCell(
                                cellObject({
                                  text: column.five,
                                  width: 100/9,
                                  borders: cellBorders,
                                })
                              ),
                              new TableCell(
                                cellObject({
                                  text: column.six,
                                  width: 100/9,
                                  borders: cellBorders,
                                })
                              ),
                              new TableCell(
                                cellObject({
                                  text: column.seven,
                                  width: 100/9,
                                  borders: cellBorders,
                                })
                              ),
                              new TableCell(
                                cellObject({
                                  text: column.eight,
                                  width: 100/9,
                                  borders: cellBorders,
                                })
                              ),
                              new TableCell(
                                cellObject({
                                  text: column.nine,
                                  width: 100/9,
                                  borders: cellBorders,
                                })
                              ),
                              new TableCell(
                                cellObject({
                                  text: column.ten,
                                  width: 100/9,
                                  borders: cellBorders,
                                })
                              ),
                              new TableCell(
                                cellObject({
                                  text: column.eleven,
                                  width: 100/9,
                                  borders: {
                                    ...cellBorders,
                                    right: invisibleBorder,
                                  },
                                })
                              ),
                            ],
                          }),
                        ],
                      }),
                    ],
                    width: {
                      size: ItemColumnWidth,
                      type: WidthType.PERCENTAGE,
                    },
                    borders:
                      index === item.columns.length - 1
                        ? { ...cellBorders, right: invisibleBorder }
                        : cellBorders,
                  });
                }),
              }),
            ],
          }),
        ],
        width: {
          size: 65,
          type: WidthType.PERCENTAGE,
        },
        verticalAlign: VerticalAlign.CENTER,
      }),
      new TableCell(cellObject ({text: "12", width: 15 })),
    ]
  });
};


const TABLE_TEAM_RESULTS_ROW = (item = { columns: [] }) => {
  const ItemColumnWidth = item.columns.length ? 100 / item.columns.length : 25;
  return new TableRow({
    children: [
      new TableCell(cellObject({ text: item.teamNumber, width: 10 })),
      new TableCell(cellObject({ text: item.teamName, width: 18 })),
      new TableCell({
        children: [
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [
              new TableRow({
                children: item.columns.map((column, index) => {
                  return new TableCell({
                    children: [
                      new Table({
                        width: {
                          size: 100,
                          type: WidthType.PERCENTAGE,
                        },
                        rows: [
                          new TableRow({
                            children: [
                              new TableCell(
                                cellObject({
                                  text: column.time,
                                  width: 100/3,
                                  borders: cellBorders,
                                })
                              ),
                              new TableCell(
                                cellObject({
                                  text: column.zks,
                                  width: 100/3,
                                  borders: cellBorders,
                                })
                              ),
                              new TableCell(
                                cellObject({
                                  text: column.position,
                                  width: 100/3,
                                  borders: {
                                    ...cellBorders,
                                    right: invisibleBorder,
                                  },
                                })
                              ),
                            ],
                          }),
                        ],
                      }),
                    ],
                    width: {
                      size: ItemColumnWidth,
                      type: WidthType.PERCENTAGE,
                    },
                    borders:
                      index === item.columns.length - 1
                        ? { ...cellBorders, right: invisibleBorder }
                        : cellBorders,
                  });
                }),
              }),
            ],
          }),
        ],
        width: {
          size: 65,
          type: WidthType.PERCENTAGE,
        },
        verticalAlign: VerticalAlign.CENTER,
      }),
      new TableCell(cellObject({ text: item.teamTotals, width: 15 })),
    ],
  });
};

export const TABLE_TEAM_RESULTS = (items) => {
  return [
    ...items.map((data) => {
      const rowBetween = Array.isArray(data.rowBetween) ? data.rowBetween : [];
      const rows = Array.isArray(data.rows) ? data.rows : [];

      return new Table({
        rows: [
          TABLE_TEAM_RESULTS_HEAD(data.head),
          ...rowBetween.map((item) => TABLE_TEAM_RESULTS_NUM(item)),
          ...rows.map((item) => TABLE_TEAM_RESULTS_ROW(item)),
        ],
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
      });
    }),
    spacer,
  ];
};
