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

const TABLE_TEAM_RELAY_RESULTS_BY_TYPE_ROW = (item = {}) => {
  return new TableRow({
    children: [
      new TableCell(cellObject({ text: item.location, width: 5 })),
      new TableCell({
        columnSpan: 5,
        width: {
          size: 95,
          type: WidthType.PERCENTAGE,
        },
        verticalAlign: VerticalAlign.CENTER,
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
                      text: item.team,
                      width: 18,
                      borders: cellBorders,
                    })
                  ),
                  new TableCell(
                    cellObject({
                      text: item.number,
                      width: 8,
                      borders: cellBorders,
                    })
                  ),
                  new TableCell(
                    cellObject({
                      text: item.initials,
                      width: 22,
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
                      text: item.result,
                      width: 11,
                      borders: cellBorders,
                    })
                  ),
                  new TableCell(
                    cellObject({
                      text: item.sum,
                      width: 11,
                      borders: cellBorders,
                    })
                  ),
                  new TableCell({
                    columnSpan: 4,
                    width: {
                      size: 20,
                      type: WidthType.PERCENTAGE,
                    },
                    borders: {
                      top: invisibleBorder,
                      right: invisibleBorder,
                      bottom: invisibleBorder,
                    },
                    verticalAlign: VerticalAlign.CENTER,
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
                                  text: item.category,
                                  width: 100,
                                  borders: {
                                    ...rowBorders,
                                    right: invisibleBorder,
                                  },
                                  columnSpan: 4,
                                })
                              ),
                            ],
                          }),
                          new TableRow({
                            children: [
                              new TableCell(
                                cellObject({
                                  text: item.before,
                                  width: 50,
                                  borders: cellBorders,
                                })
                              ),
                              new TableCell(
                                cellObject({
                                  text: item.after,
                                  width: 50,
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

const TABLE_TEAM_RESULTS_BY_TYPE_ROW = (item = { rows: [] }) => {
  return new TableRow({
    children: [
      new TableCell(cellObject({ text: item.location, width: 5 })),
      new TableCell({
        columnSpan: 4,
        width: {
          size: 95,
          type: WidthType.PERCENTAGE,
        },
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: {
                      size: 100,
                      type: WidthType.PERCENTAGE,
                    },
                    borders: allCellBorders,
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
                                  text: item.team.name,
                                  width: 17.9,
                                  borders: cellBorders,
                                })
                              ),
                              new TableCell({
                                columnSpan: 5,
                                width: {
                                  size: 78,
                                  type: WidthType.PERCENTAGE,
                                },
                                borders: {
                                  ...cellBorders,
                                  right: invisibleBorder,
                                },
                                children: [
                                  new Table({
                                    width: {
                                      size: 100,
                                      type: WidthType.PERCENTAGE,
                                    },
                                    rows: item.team.participants.reduce(
                                      (acc, participant, nextIndex) => {
                                        const borders =
                                          item.team.participants.length ===
                                            nextIndex + 1
                                            ? cellBorders
                                            : rowBorders;
                                        return [
                                          ...acc,
                                          new TableRow({
                                            children: [
                                              new TableCell(
                                                cellObject({
                                                  text: participant.number,
                                                  width: 8,
                                                  borders,
                                                })
                                              ),
                                              new TableCell(
                                                cellObject({
                                                  text: participant.initials,
                                                  width: 22,
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
                                                  text: participant.result1,
                                                  width: 11,
                                                  borders,
                                                })
                                              ),
                                              new TableCell(
                                                cellObject({
                                                  text: participant.result2,
                                                  width: 11,
                                                  borders,
                                                })
                                              ),
                                              new TableCell({
                                                columnSpan: 4,
                                                width: {
                                                  size: 20,
                                                  type: WidthType.PERCENTAGE,
                                                },
                                                borders: {
                                                  ...borders,
                                                  right: invisibleBorder,
                                                },
                                                verticalAlign:
                                                  VerticalAlign.CENTER,
                                                children: [
                                                  new Table({
                                                    layout:
                                                      TableLayoutType.FIXED,
                                                    width: {
                                                      size: 100,
                                                      type: WidthType.PERCENTAGE,
                                                    },
                                                    rows: [
                                                      new TableRow({
                                                        children: [
                                                          new TableCell(
                                                            cellObject({
                                                              text: participant.before,
                                                              width: 50,
                                                              borders:
                                                                cellBorders,
                                                            })
                                                          ),
                                                          new TableCell(
                                                            cellObject({
                                                              text: participant.after,
                                                              width: 50,
                                                              borders:
                                                                allCellBorders,
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
                                        ];
                                      },
                                      []
                                    ),
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
          }),
        ],
      }),
    ],
  });
};

export const TABLE_TEAM_RESULTS_BY_TYPE = (items) => {
  return [
    ...items.reduce((acc = [], data) => {
      return [
        ...acc,
        new Table({
          rows: [
            TABLE_TEAM_RELAY_RESULTS_BY_TYPE_ROW(data.head),
            ...data.rows.map((item) => TABLE_TEAM_RESULTS_BY_TYPE_ROW(item)),
          ],
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
        }),
        spacer,
      ];
    }, []),
  ];
};
