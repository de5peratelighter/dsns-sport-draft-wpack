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
  const ItemColumnWidth = item.columns.length ? 100 / item.columns.length : 25;
  return new TableRow({
    tableHeader: true,
    children: [
      new TableCell(cellObject({ text: item.location, width: 7 })),
      new TableCell(cellObject({ text: item.number, width: 7 })),
      new TableCell(cellObject({ text: item.initials, width: 25 })),
      new TableCell(cellObject({ text: item.bday, width: 10 })),
      new TableCell(cellObject({ text: item.team, width: 20 })),
      new TableCell({
        children: [
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [
              new TableRow({
                children: item.columns.map((columnText, index) => {
                  return new TableCell(
                    cellObject({
                      text: columnText,
                      width: ItemColumnWidth,
                      borders:
                        index === item.columns.length - 1
                          ? { ...cellBorders, right: invisibleBorder }
                          : cellBorders,
                    })
                  );
                }),
              }),
            ],
          }),
        ],
        width: {
          size: 30,
          type: WidthType.PERCENTAGE,
        },
        verticalAlign: VerticalAlign.CENTER,
      }),
    ],
  });
};
const TABLE_DUELING_PERSONAL_RESULTS_ROW = (item) => {
  const ItemColumnWidth = item.columns.length ? 100 / item.columns.length : 25;
  return new TableRow({
    children: [
      new TableCell(cellObject({ text: item.location, width: 7 })),
      new TableCell(cellObject({ text: item.number, width: 8 })),
      new TableCell(cellObject({ text: item.initials, width: 25 })),
      new TableCell(cellObject({ text: item.bday, width: 10 })),
      new TableCell(cellObject({ text: item.team, width: 20 })),
      new TableCell({
        children: [
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [
              new TableRow({
                children: item.columns.map((columnText, index) => {
                  return new TableCell(
                    cellObject({
                      text: columnText,
                      width: ItemColumnWidth,
                      borders:
                        index === item.columns.length - 1
                          ? { ...cellBorders, right: invisibleBorder }
                          : cellBorders,
                    })
                  );
                }),
              }),
            ],
          }),
        ],
        width: {
          size: 30,
          type: WidthType.PERCENTAGE,
        },
        verticalAlign: VerticalAlign.CENTER,
      }),
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
