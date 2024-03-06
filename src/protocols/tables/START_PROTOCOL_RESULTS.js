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
                      width: 6,
                      size: 24,
                      borders: cellBorders,
                    })
                  ),
                  new TableCell(
                    cellObject({
                      text: item.number,
                      width: 6,
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
                      width: 16,
                      size: 24,
                      borders: cellBorders,
                    })
                  ),
                  new TableCell(
                    cellObject({
                      text: item.bday,
                      width: 9,
                      borders: cellBorders,
                    })
                  ),
                  new TableCell(
                    cellObject({
                      text: item.team,
                      width: 14,
                      size: 24,
                      borders: cellBorders,
                    })
                  ),
                  new TableCell(
                    cellObject({
                      text: item.first,
                      width: 8,
                      size: 24,
                      borders: cellBorders,
                    })
                  ),
                  new TableCell(
                    cellObject({
                      text: item.second,
                      width: 8,
                      size: 24,
                      borders: cellBorders,
                    })
                  ),
                  new TableCell(
                    cellObject({
                      text: item.final,
                      width: 8,
                      size: 24,
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
                      width: 6,
                      size: 24,
                      borders,
                    })
                  ),
                  new TableCell(
                    cellObject({
                      text: participant.number,
                      width: 6,
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
                      width: 16,
                      size: 24,
                      borders,
                    })
                  ),
                  new TableCell(
                    cellObject({
                      text: participant.bday,
                      width: 9,
                      size: 24,
                      borders,
                    })
                  ),
                  new TableCell(
                    cellObject({
                      text: participant.team,
                      width: 14,
                      size: 24,
                      borders,
                    })
                  ),
                  new TableCell(
                    cellObject({
                      text: participant.first,
                      width: 8,
                      size: 24,
                      borders,
                    })
                  ),
                  new TableCell(
                    cellObject({
                      text: participant.second,
                      width: 8,
                      size: 24,
                      borders,
                    })
                  ),
                  new TableCell(
                    cellObject({
                      text: participant.final,
                      width: 8,
                      size: 24,
                      borders: { ...borders, right: invisibleBorder },
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

export const TABLE_START_PROTOCOL_RESULTS = (items) => {
  return [
    ...items.map((data) => {
      return new Table({
        rows: [
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