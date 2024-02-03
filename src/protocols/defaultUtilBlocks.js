import {
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  WidthType,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  VerticalAlign,
} from "docx";
const spacer = new Paragraph({
  children: [new TextRun(" ")],
});
const invisibleBorder = {
  size: 0,
  style: BorderStyle.NONE,
  color: "FFFFFF",
};
const cellBorders = {
  top: invisibleBorder,
  bottom: invisibleBorder,
  left: invisibleBorder,
};
const rowBorders = {
  top: invisibleBorder,
  left: invisibleBorder,
};
const allCellBorders = { ...cellBorders, right: invisibleBorder };

const spacing = { before: 50, after: 50 };

const multiLine = (text = "", allCaps = false) =>
  text
    .split("\n")
    .map((t, index) =>
      index
        ? new TextRun({ text: t, break: 1, allCaps })
        : new TextRun({ text: t, allCaps })
    );

/**
 *
 * @param {{ width: number, text: string }} - cell properties
 * @returns
 */
const cellObject = ({ width, text, borders, columnSpan }) => {
  const celData = {
    children: [
      new Paragraph({
        text: text,
        alignment: AlignmentType.CENTER,
      }),
    ],
    verticalAlign: VerticalAlign.CENTER,
    spacing,
  };
  if (width)
    celData.width = {
      size: width,
      type: WidthType.PERCENTAGE,
    };
  if (borders) celData.borders = borders;
  if (columnSpan) celData.columnSpan = columnSpan;
  return celData;
};

const PAGE_HEADER = (header) => {
  const {
    headerLine,
    subLine,
    protocolLine,
    subProtocolLine,
    location,
    date,
    track,
    metrics,
  } = header;
  const items = [
    new Paragraph({
      children: multiLine(headerLine, true),
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: multiLine(subLine),
      heading: HeadingLevel.HEADING_3,
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 400 },
    }),
    new Paragraph({
      children: multiLine(protocolLine, true),
      heading: HeadingLevel.HEADING_3,
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: multiLine(subProtocolLine),
      heading: HeadingLevel.HEADING_3,
      alignment: AlignmentType.CENTER,
    }),
    spacer,
    ...SPACE_BETWEEN(location, date),
  ];
  const optionalItems =
    track || metrics ? [...SPACE_BETWEEN(track, metrics)] : [];
  return [...items, ...optionalItems];
};

const SPACE_BETWEEN = (
  leftText,
  rightText,
  options = { space: 0, heading: undefined }
) => {
  const items = [
    new TableCell({
      children: [
        new Paragraph({
          children: multiLine(leftText),
          alignment: AlignmentType.LEFT,
          heading: options.heading ? options.heading : undefined,
          width: {
            size: 25,
            type: WidthType.PERCENTAGE,
          },
        }),
      ],
      verticalAlign: VerticalAlign.CENTER,
      borders: allCellBorders,
    }),
    new TableCell({
      children: [new Paragraph("")], // Middle cell
      borders: allCellBorders,
    }),
    new TableCell({
      children: [
        new Paragraph({
          children: multiLine(rightText),
          alignment: AlignmentType.RIGHT,
          heading: options.heading ? options.heading : undefined,
          width: {
            size: 25,
            type: WidthType.PERCENTAGE,
          },
        }),
      ],
      verticalAlign: VerticalAlign.CENTER,
      borders: allCellBorders,
    }),
  ];
  return [
    new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      rows: [
        new TableRow({
          children: options.space
            ? [
                new TableCell({
                  children: [new Paragraph(" ")],
                  width: {
                    size: options.space,
                    type: WidthType.PERCENTAGE,
                  },
                  borders: allCellBorders,
                }),
                ...items,
                new TableCell({
                  children: [new Paragraph(" ")],
                  width: {
                    size: options.space,
                    type: WidthType.PERCENTAGE,
                  },
                  borders: allCellBorders,
                }),
              ]
            : items,
        }),
      ],
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
    }),
    spacer,
  ];
};

export {
  spacer,
  invisibleBorder,
  cellBorders,
  rowBorders,
  allCellBorders,
  multiLine,
  cellObject,
  PAGE_HEADER,
  SPACE_BETWEEN,
};
