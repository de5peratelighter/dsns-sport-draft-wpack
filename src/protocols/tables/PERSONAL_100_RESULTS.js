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
  HeightRule
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
      new TableCell(cellObject({ text: item.qualification, width: 10 })),
      new TableCell(cellObject({ text: item.initials, width: 24 })),
      new TableCell(cellObject({ text: item.bday, width: 9 })),
      new TableCell(cellObject({ text: item.team, width: 25 })),
      new TableCell(cellObject({ text: item.results, width: 18 })),
    ],
  });
};

const TABLE_PERSONAL_RESULTS_ROW_CATEGORY = (item) => {
  return new TableRow({
    children: [
      new TableCell(cellObject({ text: item.location, width: 7 })),
      new TableCell(cellObject({ text: item.number, width: 7 })),
      new TableCell(cellObject({ text: item.qualification, width: 10 })),
      new TableCell(cellObject({ text: item.initials, width: 24 })),
      new TableCell(cellObject({ text: item.bday, width: 9 })),
      new TableCell(cellObject({ text: item.team, width: 25 })),
      new TableCell(cellObject({ text: item.results, width: 18 })),
    ],
  });
};

const TABLE_PERSONAL_RESULTS_HEAD_CATEGORY_EXTENDED = (item) => {
  return new TableRow({
    tableHeader: true,
    children: [
      new TableCell(cellObject({ text: item.location, width: 7 })),
      new TableCell(cellObject({ text: item.number, width: 7 })),
      new TableCell(cellObject({ text: item.initials, width: 19 })),
      new TableCell(cellObject({ text: item.bday, width: 9 })),
      new TableCell(cellObject({ text: item.team, width: 18 })),
      new TableCell({
        columnSpan: 3,
        width: {
          size: 20,
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
                height: { value: 500, rule: HeightRule.EXACT }, // Встановлення висоти рядка
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
      new TableCell({
        columnSpan: 2,
        width: {
          size: 20,
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

const TABLE_PERSONAL_RESULTS_ROW_CATEGORY_EXTENDED = (item) => {
  return new TableRow({
    children: [
      new TableCell(cellObject({ text: item.location, width: 7 })),
      new TableCell(cellObject({ text: item.number, width: 7 })),
      new TableCell(cellObject({ text: item.initials, width: 19 })),
      new TableCell(cellObject({ text: item.bday, width: 9 })),
      new TableCell(cellObject({ text: item.team, width: 18 })),
      new TableCell(
        cellObject({
          text: item.first,
          width: 8,
        })
      ),
      new TableCell(
        cellObject({
          text: item.second,
          width: 8,
        })
      ),
      new TableCell(
        cellObject({
          text: item.final,
          width: 8,
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
          width: 8,
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
          children: multiLine(data.nameFinal, true),
          heading: HeadingLevel.HEADING_3,
          alignment: AlignmentType.CENTER,
        }),
        new Table({
          rows: [
            TABLE_PERSONAL_RESULTS_HEAD_CATEGORY(data.headFinals),
            ...data.rowsFinal.map((item) =>
              TABLE_PERSONAL_RESULTS_ROW_CATEGORY(item)
            ),
          ],
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
        }),
        spacer,
        new Paragraph({
          children: multiLine(data.nameSemiFinal, true),
          heading: HeadingLevel.HEADING_3,
          alignment: AlignmentType.CENTER,
        }),
        new Table({
          rows: [
            TABLE_PERSONAL_RESULTS_HEAD_CATEGORY(data.headFinals),
            ...data.rowsSemiFinal.map((item) =>
              TABLE_PERSONAL_RESULTS_ROW_CATEGORY(item)
            ),
          ],
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
        }),
        spacer,
        new Paragraph({
          children: multiLine(data.nameZalik, true),
          heading: HeadingLevel.HEADING_3,
          alignment: AlignmentType.CENTER,
        }),
        new Table({
          rows: [
            TABLE_PERSONAL_RESULTS_HEAD_CATEGORY_EXTENDED(data.headZalik),
            ...data.rowsZalik.map((item) =>
              TABLE_PERSONAL_RESULTS_ROW_CATEGORY_EXTENDED(item)
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