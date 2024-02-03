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

const TABLE_PERSONAL_RESULTS_HEAD = (item) => {
  return new TableRow({
    tableHeader: true,
    children: [
      new TableCell(cellObject({ text: item.location, width: 7 })),
      new TableCell(cellObject({ text: item.number, width: 7 })),
      new TableCell(cellObject({ text: item.initials, width: 23 })),
      new TableCell(cellObject({ text: item.bday, width: 10 })),
      new TableCell(cellObject({ text: item.team, width: 20 })),
      new TableCell(cellObject({ text: item.results, width: 33 })),
    ],
  });
};
const TABLE_PERSONAL_RESULTS_ROW = (item) => {
  return new TableRow({
    children: [
      new TableCell(cellObject({ text: item.location, width: 7 })),
      new TableCell(cellObject({ text: item.number, width: 7 })),
      new TableCell(cellObject({ text: item.initials, width: 23 })),
      new TableCell(cellObject({ text: item.bday, width: 10 })),
      new TableCell(cellObject({ text: item.team, width: 20 })),
      new TableCell(cellObject({ text: item.results, width: 33 })),
    ],
  });
};

export const TABLE_PERSONAL_FINAL_RESULTS = (items) => {
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
        ...acc,
        new Paragraph({
          children: multiLine(data.name, true),
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
