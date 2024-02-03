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

const TABLE_PERSONAL_RESULTS_HEAD_EXTENDED = (item) => {
  return new TableRow({
    tableHeader: true,
    children: [
      new TableCell(cellObject({ text: item.location, width: 7 })),
      new TableCell(cellObject({ text: item.number, width: 8 })),
      new TableCell(cellObject({ text: item.initials, width: 25 })),
      new TableCell(cellObject({ text: item.bday, width: 10 })),
      new TableCell(cellObject({ text: item.team, width: 20 })),
      new TableCell({
        columnSpan: 3,
        width: {
          size: 30,
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
                      width: 33.33,
                      borders: cellBorders,
                    })
                  ),
                  new TableCell(
                    cellObject({
                      text: item.second,
                      width: 33.33,
                      borders: cellBorders,
                    })
                  ),
                  new TableCell(
                    cellObject({
                      text: item.final,
                      width: 33.33,
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

const TABLE_PERSONAL_RESULTS_ROW_EXTENDED = (item) => {
  return new TableRow({
    children: [
      new TableCell(cellObject({ text: item.location, width: 7 })),
      new TableCell(cellObject({ text: item.number, width: 8 })),
      new TableCell(cellObject({ text: item.initials, width: 25 })),
      new TableCell(cellObject({ text: item.bday, width: 10 })),
      new TableCell(cellObject({ text: item.team, width: 20 })),
      new TableCell(
        cellObject({
          text: item.first,
          width: 10,
        })
      ),
      new TableCell(
        cellObject({
          text: item.second,
          width: 10,
        })
      ),
      new TableCell(
        cellObject({
          text: item.final,
          width: 10,
        })
      ),
    ],
  });
};

export const TABLE_PERSONAL_RESULTS_ZALIK = (items) => {
  return [
    ...items.reduce((acc = [], data) => {
      return [
        ...acc,
        new Paragraph({
          children: multiLine(data.name, true),
          heading: HeadingLevel.HEADING_3,
          alignment: AlignmentType.CENTER,
        }),
        new Table({
          layout: TableLayoutType.FIXED,
          rows: [
            TABLE_PERSONAL_RESULTS_HEAD_EXTENDED(data.head),
            ...data.rows.map((item) =>
              TABLE_PERSONAL_RESULTS_ROW_EXTENDED(item)
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
