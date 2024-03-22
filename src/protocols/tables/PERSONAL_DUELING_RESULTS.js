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

const TABLE_DUELING_PERSONAL_RESULTS_HEAD = (item) => {
  return new TableRow({
    tableHeader: true,
    children: [
      new TableCell(cellObject({ text: item.location, width: 7 })),
      new TableCell(cellObject({ text: item.number, width: 7 })),
      new TableCell(cellObject({ text: item.initials, width: 17 })),
      new TableCell(cellObject({ text: item.bday, width: 7 })),
      new TableCell(cellObject({ text: item.team, width: 17 })),
      new TableCell({
        columnSpan: 3,
        width: {
          size: 25,
          type: WidthType.PERCENTAGE,
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
                      text: item.results,
                      width: 99.99,
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
                      width: 40,
                      borders: cellBorders,
                    })
                  ),
                  new TableCell(
                    cellObject({
                      text: item.final,
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
      new TableCell({
        columnSpan: 2,
        width: {
          size: 25,
          type: WidthType.PERCENTAGE,
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
                      text: item.qualification,
                      width: 99.99,
                      borders: { ...rowBorders, right: invisibleBorder },
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
  });
};
const TABLE_DUELING_PERSONAL_RESULTS_ROW = (item) => {
  return new TableRow({
    children: [
      new TableCell(cellObject({ text: item.location, width: 7 })),
      new TableCell(cellObject({ text: item.number, width: 7 })),
      new TableCell(cellObject({ text: item.initials, width: 17 })),
      new TableCell(cellObject({ text: item.bday, width: 7 })),
      new TableCell(cellObject({ text: item.team, width: 17 })),
      new TableCell(
        cellObject({
          text: item.first,
          width: 10,
        })
      ),
      new TableCell(
        cellObject({
          text: item.second,
          width: 13,
        })
      ),
      new TableCell(
        cellObject({
          text: item.final,
          width: 10,
        })
      ),
      new TableCell(
        cellObject({
          text: item.before,
          width: 8,
        })
      ),
      new TableCell(
        cellObject({
          text: item.after,
          width: 12,
        })
      ),
    ],
  });
};

export const TABLE_PERSONAL_DUELING_RESULTS = (items) => {
  return [
    ...items.reduce((acc = [], data) => {
      return [
        ...acc,
        new Table({
          rows: [
            TABLE_DUELING_PERSONAL_RESULTS_HEAD(data.head),
            ...data.rows.map((item) =>
              TABLE_DUELING_PERSONAL_RESULTS_ROW(item)
            ),
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
