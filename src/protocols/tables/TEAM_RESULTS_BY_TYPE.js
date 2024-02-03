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

const TABLE_TEAM_RESULTS_BY_TYPE_ROW = (item = { rows: [] }) => {
  return new TableRow({
    children: [
      new TableCell(cellObject({ text: item.number, width: 10 })),
      new TableCell({
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
                                    width: 25,
                                    borders: cellBorders,
                                  })
                                ),
                                new TableCell({
                                  width: {
                                    size: 75,
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
                                                    width: 40,
                                                    borders,
                                                  })
                                                ),
                                                new TableCell(
                                                  cellObject({
                                                    text: participant.bday,
                                                    width: 20,
                                                    borders,
                                                  })
                                                ),
                                                new TableCell(
                                                  cellObject({
                                                    text: participant.result1,
                                                    width: 20,
                                                    borders,
                                                  })
                                                ),
                                                new TableCell(
                                                  cellObject({
                                                    text: participant.result2,
                                                    width: 20,
                                                    borders: {
                                                      ...borders,
                                                      right: invisibleBorder,
                                                    },
                                                  })
                                                ),
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
                                        width: 25,
                                        borders: cellBorders,
                                      })
                                    ),
                                    new TableCell({
                                      width: {
                                        size: 75,
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
                                                        width: 40,
                                                        borders,
                                                      })
                                                    ),
                                                    new TableCell({
                                                      width: {
                                                        size: 20,
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
                                                        width: 20,
                                                        borders,
                                                      })
                                                    ),
                                                    new TableCell(
                                                      cellObject({
                                                        text: participant.result2,
                                                        width: 20,
                                                        borders: {
                                                          ...borders,
                                                          right:
                                                            invisibleBorder,
                                                        },
                                                      })
                                                    ),
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

export const TABLE_TEAM_RESULTS_BY_TYPE = (items) => {
  return [
    ...items.reduce((acc = [], data) => {
      return [
        ...acc,
        new Table({
          rows: [
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
