// протокол з пожежної естафети

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
  
  const START_PROTOCOL_RELAY_RESULTS_HEAD = (item) => {
    return new TableRow({
      children: [
        new TableCell(cellObject({ text: item.set, width: 5 })),
        new TableCell({
          width: {
            size: 30,
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
                        width: 20,
                        borders: cellBorders,
                      })
                    ),
                    new TableCell(
                      cellObject({
                        text: item.team,
                        width: 80,
                        borders: {
                            ...rowBorders,
                            right: invisibleBorder,
                            bottom:invisibleBorder,
                          },
                      })
                    ),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableCell({
            width: {
              size: 55,
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
                          text: item.number,
                          width: 15,
                          borders: cellBorders,
                        })
                      ),
                      new TableCell(
                        cellObject({
                          text: item.qualification,
                          width: 20,
                          borders: cellBorders,
                        })
                      ),
                      new TableCell(
                        cellObject({
                          text: item.name,
                          width: 45,
                          borders: cellBorders,
                        })
                      ),
                      new TableCell(
                        cellObject({
                          text: item.bday,
                          width: 20,
                          borders: {
                            ...rowBorders,
                            right: invisibleBorder,
                            bottom: invisibleBorder,
                          },
                        })
                      ),
                    ],
                  }),
                ],
              }),
            ],
        }),
        new TableCell(cellObject({ text: item.results, width: 10 })),
      ],
    });
  };
  
  const START_PROTOCOL_RELAY_RESULTS_ROW = (item) => {
    return new TableRow({
      children: [
        new TableCell(cellObject({ text: item.set, width: 5 })),
        new TableCell({
          width: {
            size: 30,
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
                        text: item.trackTeamOne,
                        width: 20,
                        borders: {top:invisibleBorder,left:invisibleBorder},
                      })
                    ),
                    new TableCell(
                        cellObject({
                          text: item.teamTeamOne,
                          width: 80,
                          borders: {right:invisibleBorder,left:invisibleBorder,top:invisibleBorder},
                        })
                      ),
                  ],
                  height: { value: 1040, rule: HeightRule.EXACT }, // Встановлення висоти рядка
                }),
                new TableRow({
                    children: [
                      new TableCell(
                        cellObject({
                          text: item.trackTeamTwo,
                          width: 20,
                          borders: {top:invisibleBorder,left:invisibleBorder, bottom:invisibleBorder},
                        })
                      ),
                      new TableCell(
                          cellObject({
                            text: item.teamTeamTwo,
                            width: 80,
                            borders: {right:invisibleBorder,left:invisibleBorder,top:invisibleBorder, bottom:invisibleBorder},
                          })
                        ),
                    ],
                    height: { value: 1040, rule: HeightRule.EXACT }, // Встановлення висоти рядка
                  }),
              ],
            }),
          ],
        }),
        new TableCell({
            width: {
                size: 55,
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
                        // Mapping for participantsTeamOne
                        ...item.participantsTeamOne.map((participantsTeamOne, index) => {
                            const borders = (index === item.participantsTeamOne.length - 1)
                                ? { ...rowBorders }
                                : rowBorders;
                            return new TableRow({
                                children: [
                                    new TableCell(cellObject({ text: participantsTeamOne.number, width: 15, borders })),
                                    new TableCell(cellObject({ text: participantsTeamOne.qualification, width: 20, borders })),
                                    new TableCell(cellObject({ text: participantsTeamOne.name, width: 45, borders })),
                                    new TableCell(cellObject({ text: participantsTeamOne.bday, width: 20, borders: { ...borders, right: invisibleBorder } })),
                                ],
                            });
                        }),
                        // Mapping for participantsTeamTwo
                        ...item.participantsTeamTwo.map((participantsTeamTwo, index) => {
                            const borders = (index === item.participantsTeamTwo.length - 1)
                                ? { ...rowBorders, bottom: invisibleBorder }
                                : rowBorders;
                            return new TableRow({
                                children: [
                                    new TableCell(cellObject({ text: participantsTeamTwo.number, width: 15, borders })),
                                    new TableCell(cellObject({ text: participantsTeamTwo.qualification, width: 20, borders })),
                                    new TableCell(cellObject({ text: participantsTeamTwo.name, width: 45, borders })),
                                    new TableCell(cellObject({ text: participantsTeamTwo.bday, width: 20, borders: { ...borders, right: invisibleBorder } })),
                                ],
                            });
                        }),
                    ],
                }),
            ],
        }),
        
        new TableCell({
            width: {
              size: 10,
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
                          text: item.resultTeamOne,
                          width: 100,
                          borders: {top:invisibleBorder,left:invisibleBorder, right:invisibleBorder},
                        })
                      ),
                    ],
                    height: { value: 1040, rule: HeightRule.EXACT }, // Встановлення висоти рядка
                  }),
                  new TableRow({
                      children: [
                        new TableCell(
                          cellObject({
                            text: item.resultTeamTwo,
                            width: 100,
                            borders: {top:invisibleBorder,left:invisibleBorder, bottom:invisibleBorder,right:invisibleBorder},
                          })
                        ),
                      ],
                      height: { value: 1040, rule: HeightRule.EXACT }, // Встановлення висоти рядка
                    }),
                ],
              }),
            ],
          }),
      ],
    });
  };
  
  export const START_PROTOCOL_RELAY_RESULTS = (items) => {
    return [
      ...items.map((data) => {
        return new Table({
          rows: [
            START_PROTOCOL_RELAY_RESULTS_HEAD(data.head),
            ...data.rows.map((item) => START_PROTOCOL_RELAY_RESULTS_ROW(item)),
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
  