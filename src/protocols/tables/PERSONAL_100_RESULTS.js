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

const TABLE_PERSONAL_RESULTS_HEAD_CATEGORY = (item) => {
  return new TableRow({
    tableHeader: true,
    children: [
      new TableCell(cellObject({ text: item.location, width: 7 })),
      new TableCell(cellObject({ text: item.number, width: 7 })),
      new TableCell(cellObject({ text: item.initials, width: 19 })),
      new TableCell(cellObject({ text: item.bday, width: 9 })),
      new TableCell(cellObject({ text: item.team, width: 18 })),
      new TableCell(cellObject({ text: item.results, width: 18 })),
      new TableCell({
        columnSpan: 2,
        width: {
          size: 22,
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
                      text: item.category,
                      width: 100,
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

const TABLE_PERSONAL_RESULTS_ROW_CATEGORY = (item) => {
  return new TableRow({
    children: [
      new TableCell(cellObject({ text: item.location, width: 7 })),
      new TableCell(cellObject({ text: item.number, width: 7 })),
      new TableCell(cellObject({ text: item.initials, width: 19 })),
      new TableCell(cellObject({ text: item.bday, width: 9 })),
      new TableCell(cellObject({ text: item.team, width: 18 })),
      new TableCell(cellObject({ text: item.results, width: 18 })),
      new TableCell(
        cellObject({
          text: item.before,
          width: 11,
        })
      ),
      new TableCell(
        cellObject({
          text: item.after,
          width: 11,
        })
      ),
    ],
  });
};

export const TABLE_PERSONAL_FINAL_100_RESULTS = (items) => {
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
          rows: [
            TABLE_PERSONAL_RESULTS_HEAD_CATEGORY(data.head),
            ...data.rows.map((item) =>
              TABLE_PERSONAL_RESULTS_ROW_CATEGORY(item)
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

export const TABLE_PERSONAL_HALFFINAL_100_RESULTS = (items) => {
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
          rows: [
            TABLE_PERSONAL_RESULTS_HEAD_CATEGORY(data.head),
            ...data.rows.map((item) =>
              TABLE_PERSONAL_RESULTS_ROW_CATEGORY(item)
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
