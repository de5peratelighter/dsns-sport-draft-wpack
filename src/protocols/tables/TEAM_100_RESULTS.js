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

const TABLE_TEAM_100_RESULTS_HEAD = (item = {}) => {
  return new TableRow({
    children: [
      new TableCell(cellObject({ text: item.number, width: 10 })),
      new TableCell({
        columnSpan: 5,
        width: {
          size: 90,
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
                      width: 20,
                      borders: cellBorders,
                    })
                  ),
                  new TableCell(
                    cellObject({
                      text: item.initials,
                      width: 25,
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
                      width: 10,
                      borders: cellBorders,
                    })
                  ),
                  new TableCell(
                    cellObject({
                      text: item.sum,
                      width: 10,
                      borders: allCellBorders,
                    })
                  ),
                  new TableCell({
                    columnSpan: 2,
                    width: {
                      size: 25,
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
                                  columnSpan: 2,
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

const TABLE_TEAM_100_RESULTS_ROW = (item = { rows: [] }) => {
  return new TableRow({
    children: [
      new TableCell(cellObject({ text: item.number, width: 10 })),
      new TableCell({
        columnSpan: 5,
        width: {
          size: 90,
          type: WidthType.PERCENTAGE,
        },
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: (() => {
              const showExcluded = !!item.team?.excluded?.length;
              const rows = [
                new TableRow({
                  children: [
                    new TableCell({
                      width: {
                        size: 100,
                        type: WidthType.PERCENTAGE,
                      },
                      borders: showExcluded
                        ? { ...rowBorders, right: invisibleBorder }
                        : allCellBorders,
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
                                    width: 20,
                                    borders: cellBorders,
                                  })
                                ),
                                new TableCell({
                                  columnSpan: 4,
                                  width: {
                                    size: 80,
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
                                                    text: participant.initials,
                                                    width: 31,
                                                    borders,
                                                  })
                                                ),
                                                new TableCell(
                                                  cellObject({
                                                    text: participant.bday,
                                                    width: 12.66,
                                                    borders,
                                                  })
                                                ),
                                                new TableCell(
                                                  cellObject({
                                                    text: participant.result1,
                                                    width: 12.66,
                                                    borders,
                                                  })
                                                ),
                                                new TableCell(
                                                  cellObject({
                                                    text: participant.result2,
                                                    width: 12.66,
                                                    borders,
                                                  })
                                                ),
                                                new TableCell({
                                                  columnSpan: 2,
                                                  width: {
                                                    size: 31,
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
                                                                text: item.before,
                                                                width: 50,
                                                                borders:
                                                                  cellBorders,
                                                              })
                                                            ),
                                                            new TableCell(
                                                              cellObject({
                                                                text: item.after,
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
              ];
              return showExcluded
                ? [
                    ...rows,
                    new TableRow({
                      children: [
                        new TableCell({
                          width: {
                            size: 100,
                            type: WidthType.PERCENTAGE,
                          },
                          borders: { ...cellBorders, right: invisibleBorder },
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
                                        text: item.team.others,
                                        width: 20,
                                        borders: cellBorders,
                                      })
                                    ),
                                    new TableCell({
                                      width: {
                                        size: 80,
                                        type: WidthType.PERCENTAGE,
                                      },
                                      children: [
                                        new Table({
                                          width: {
                                            size: 100,
                                            type: WidthType.PERCENTAGE,
                                          },
                                          rows: item.team.excluded.reduce(
                                            (acc, participant, nextIndex) => {
                                              const borders =
                                                item.team.excluded.length ===
                                                nextIndex + 1
                                                  ? cellBorders
                                                  : rowBorders;
                                              return [
                                                ...acc,
                                                new TableRow({
                                                  children: [
                                                    new TableCell(
                                                      cellObject({
                                                        text: participant.initials,
                                                        width: 31,
                                                        borders,
                                                      })
                                                    ),
                                                    new TableCell({
                                                      width: {
                                                        size: 12.66,
                                                        type: WidthType.PERCENTAGE,
                                                      },
                                                      borders,
                                                      children: [
                                                        new Paragraph({
                                                          text: participant.bday,
                                                          alignment:
                                                            AlignmentType.CENTER,
                                                        }),
                                                      ],
                                                      verticalAlign:
                                                        VerticalAlign.CENTER,
                                                    }),
                                                    new TableCell(
                                                      cellObject({
                                                        text: participant.result1,
                                                        width: 12.66,
                                                        borders,
                                                      })
                                                    ),
                                                    new TableCell(
                                                      cellObject({
                                                        text: participant.result2,
                                                        width: 12.66,
                                                        borders,
                                                      })
                                                    ),
                                                    new TableCell({
                                                      columnSpan: 2,
                                                      width: {
                                                        size: 31,
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
                                                                    text: item.before,
                                                                    width: 50,
                                                                    borders:
                                                                      cellBorders,
                                                                  })
                                                                ),
                                                                new TableCell(
                                                                  cellObject({
                                                                    text: item.after,
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
                                      borders: {
                                        ...cellBorders,
                                        right: invisibleBorder,
                                      },
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  ]
                : rows;
            })(),
          }),
        ],
      }),
    ],
  });
};

export const TABLE_TEAM_100_RESULTS = (items) => {
  return [
    ...items.reduce((acc = [], data) => {
      return [
        ...acc,
        new Table({
          rows: [
            TABLE_TEAM_100_RESULTS_HEAD(data.head),
            ...data.rows.map((item) => TABLE_TEAM_100_RESULTS_ROW(item)),
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
