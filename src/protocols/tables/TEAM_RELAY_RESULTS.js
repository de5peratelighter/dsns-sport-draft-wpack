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

const TABLE_TEAM_RELAY_RESULTS_HEAD = (item) => {
  return new TableRow({
    children: [
      new TableCell(cellObject({ text: item.location, width: 10 })),
      new TableCell({
        width: {
          size: 45,
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
                      width: 25,
                      borders: cellBorders,
                    })
                  ),
                  new TableCell(
                    cellObject({
                      text: item.initials,
                      width: 45,
                      borders: cellBorders,
                    })
                  ),
                  new TableCell(
                    cellObject({
                      text: item.bday,
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
      new TableCell(cellObject({ text: item.team, width: 21 })),
      new TableCell(cellObject({ text: item.first, width: 8 })),
      new TableCell(cellObject({ text: item.second, width: 8 })),
      new TableCell(cellObject({ text: item.final, width: 8 })),
    ],
  });
};

const TABLE_TEAM_RELAY_RESULTS_ROW = (item) => {
  return new TableRow({
    children: [
      new TableCell(cellObject({ text: item.location, width: 10 })),
      new TableCell({
        width: {
          size: 45,
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
                    cellObject({ text: participant.number, width: 25, borders })
                  ),
                  new TableCell(
                    cellObject({
                      text: participant.initials,
                      width: 45,
                      borders,
                    })
                  ),
                  new TableCell(
                    cellObject({
                      text: participant.bday,
                      width: 30,
                      borders: { ...borders, right: invisibleBorder },
                    })
                  ),
                ],
              });
            }),
          }),
        ],
      }),
      new TableCell(cellObject({ text: item.team, width: 21 })),
      new TableCell(cellObject({ text: item.first, width: 8 })),
      new TableCell(cellObject({ text: item.second, width: 8 })),
      new TableCell(cellObject({ text: item.final, width: 8 })),
    ],
  });
};

export const TABLE_TEAM_RELAY_RESULTS = (items) => {
  return [
    ...items.map((data) => {
      return new Table({
        rows: [
          TABLE_TEAM_RELAY_RESULTS_HEAD(data.head),
          ...data.rows.map((item) => TABLE_TEAM_RELAY_RESULTS_ROW(item)),
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
