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

const qualificationMapping = {
  "CMS": "КМС",
  "MS": "МС",
  "HMS": "ЗМС",
  // Додайте інші кваліфікації за необхідності
};

const TABLE_PERSONAL_RESULTS_HEAD = (item) => {
  return new TableRow({
    tableHeader: true,
    children: [
      new TableCell({
        columnSpan: 2,
        width: {
          size: 10,
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
                      text: item.zresult,
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
                      text: item.location,
                      width: 50,
                      borders: cellBorders,
                    })
                  ),
                  new TableCell(
                    cellObject({
                      text: item.time,
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
      new TableCell(cellObject({ text: item.track, width: 6 })),
      new TableCell(cellObject({ text: item.number, width: 8 })),
      new TableCell(cellObject({ text: item.qualification, width: 12 })),
      new TableCell(cellObject({ text: item.initials, width: 30 })),
      new TableCell(cellObject({ text: item.bday, width: 9 })),
      new TableCell(cellObject({ text: item.team, team: 16 })),
      new TableCell(cellObject({ text: item.results, width: 9 })),
    ],
  });
};
const TABLE_PERSONAL_RESULTS_ROW = (item) => {
  return new TableRow({
    tableHeader: true,
    children: [
      new TableCell(cellObject({ text: item.location, width: 5 })),
      new TableCell(cellObject({ text: item.time, width: 5 })),
      new TableCell(cellObject({ text: item.track, width: 6 })),
      new TableCell(cellObject({ text: item.number, width: 8 })),
      new TableCell(cellObject({ text: qualificationMapping[item.qualification] || item.qualification, width: 12 })),
      new TableCell(cellObject({ text: item.initials, width: 30 })),
      new TableCell(cellObject({ text: item.bday, width: 9 })),
      new TableCell(cellObject({ text: item.team, width: 16 })),
      new TableCell(cellObject({ text: item.results, width: 9 })),
    ],
  });
};
const TABLE_PERSONAL_RESULTS_BETWEEN = (item) => {
  return new TableRow({
    tableHeader: true,
    children: [
      new TableCell(cellObject({ width: 5, borders: { ...cellBorders, left: undefined, right: invisibleBorder } })),
      new TableCell(cellObject({ width: 5, borders: { ...cellBorders, right: invisibleBorder } })),
      new TableCell(cellObject({ width: 6, borders: { ...cellBorders, right: invisibleBorder } })),
      new TableCell(cellObject({ width: 8, borders: { ...cellBorders, right: invisibleBorder } })),
      new TableCell(cellObject({ width: 12, borders: { ...cellBorders, right: invisibleBorder } })),
      new TableCell(cellObject({ text: item, width: 30, borders: { ...cellBorders, right: invisibleBorder } })),
      new TableCell(cellObject({ width: 9, borders: { ...cellBorders, right: invisibleBorder } })),
      new TableCell(cellObject({ width: 16, borders: { ...cellBorders, right: invisibleBorder } })),
      new TableCell(cellObject({ width: 9, borders: { ...cellBorders, left: invisibleBorder, right: undefined } })),
    ],
  });
};

export const TABLE_PERSONAL_FINAL_RESULTS = (items) => {
  return [
    ...items.reduce((acc = [], data) => {
      return [
        ...acc,
        new Paragraph({
          children: multiLine(data.name, true, true),
          heading: HeadingLevel.HEADING_3,
          alignment: AlignmentType.CENTER,
        }),
        new Table({
          rows: [
            TABLE_PERSONAL_RESULTS_HEAD(data.head),
            ...data.rows.map((item) => TABLE_PERSONAL_RESULTS_ROW(item)),
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
export const TABLE_PERSONAL_HALFFINAL_RESULTS = (items) => {
  return [
    ...items.reduce((acc = [], data) => {
      return [

        new Table({
          rows: [
            TABLE_PERSONAL_RESULTS_HEAD(data.head),
            TABLE_PERSONAL_RESULTS_BETWEEN(data.nameFirstSemi),
            ...data.row1.map((item) => TABLE_PERSONAL_RESULTS_ROW(item)),
            TABLE_PERSONAL_RESULTS_BETWEEN(data.nameSecondSemi),
            ...data.row2.map((item) => TABLE_PERSONAL_RESULTS_ROW(item)),
            TABLE_PERSONAL_RESULTS_BETWEEN(data.nameFinal),
            ...data.row3.map((item) => TABLE_PERSONAL_RESULTS_ROW(item)),
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
