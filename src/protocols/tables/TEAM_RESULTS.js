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
                      columnSpan: 4,
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
                                  columnSpan: 2,
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
                                  text: "Час",
                                  width: 50,
                                  borders: cellBorders,
                                })
                              ),
                              new TableCell(
                                cellObject({
                                  text: "Місце",
                                  width: 50,
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
const TABLE_TEAM_RESULTS_ROW = (item = { columns: [] }) => {
  const ItemColumnWidth = item.columns.length ? 100 / item.columns.length : 25;
  return new TableRow({
    children: [
      new TableCell(cellObject({ text: item.teamNumber, width: 5 })),
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
                                  width: 50,
                                  borders: cellBorders,
                                })
                              ),
                              new TableCell(
                                cellObject({
                                  text: column.position,
                                  width: 50,
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
      new TableCell(cellObject({ text: item.teamTotals, width: 12 })),
    ],
  });
};

export const TABLE_TEAM_RESULTS = (items) => {
  return [
    ...items.map((data) => {
      return new Table({
        rows: [
          TABLE_TEAM_RESULTS_HEAD(data.head),
          ...data.rows.map((item) => TABLE_TEAM_RESULTS_ROW(item)),
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
