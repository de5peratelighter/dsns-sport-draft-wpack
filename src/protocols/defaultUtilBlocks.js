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

const multiLine = (text = "", allCaps = false, bold = false) =>
  text
    .split("\n")
    .map((t, index) =>
      index
        ? new TextRun({
          text: t,
          break: 1,
          allCaps,
          bold,
          сolor: "000000",
          font: "Times New Roman",
          size: 22,
        })
        : new TextRun({
          text: t,
          allCaps,
          bold,
          color: "000000",
          font: "Times New Roman",
          size: 22,
        })
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
        children: [
          new TextRun({
            text: text,
            font: "Times New Roman",
            size: 22,
          }),
        ],
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

const createTextRun = (text, options = {}) => {
  return new TextRun({
    text: text,
    font: "Times New Roman",
    color: "000000",
    ...options,
  });
};

const whiteBorder = {
  size: 2, // Ви можете змінити розмір рамки за бажанням
  style: BorderStyle.SOLID,
  color: "FFFFFF",
};

const translateJudgeTitle = (title) => {
  const translations = {
    MAIN: 'Головний суддя змагань',
    MAIN_SECRETARY: 'Головний секретар змагань',
    INSPECTOR: 'Суддя-інспектор змагань',
    STARTER: 'Основний стартер',
    ASSISTANCE_STARTER: 'Помічник стартера',
  };

  return translations[title] || title;
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
    beginning,
    metrics,
  } = header;
  const items = [
    ...headerLine.split('\n').map(line => new Paragraph({
      children: [new TextRun({
        text: line.toUpperCase(),
        size: 28,
        bold: true,
        color: "000000",
        font: "Times New Roman",
      })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 200 },
    })),
    ...subLine.split('\n').map(line => new Paragraph({
      children: [new TextRun({
        text: line,
        size: 24,
        color: "000000",
        font: "Times New Roman",
      })],
      alignment: AlignmentType.CENTER,
    })),
    new Paragraph({
      children: [
        createTextRun(protocolLine.toUpperCase(), {
          size: 24,
          bold: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 50 },
    }),
    ...subProtocolLine.split('\n').map(line => new Paragraph({
      children: [new TextRun({
        text: line,
        size: 24,
        color: "000000",
        font: "Times New Roman",
      })],
      alignment: AlignmentType.CENTER,
    })),
    spacer,
    ...SPACE_BETWEEN({ location, date, track, beginning, metrics }),
  ];
  return items;
};

const SPACE_BETWEEN = (header) => {
  const {
    location,
    date,
    track,
    beginning,
    metrics
  } = header;
  const firstRowItems = [
    new TableCell({
      children: [
        new Paragraph({
          children: [new TextRun({ text: location, font: "Times New Roman", size: 22 })],
          alignment: AlignmentType.LEFT,
        }),
      ],
      verticalAlign: VerticalAlign.CENTER,
      borders: whiteBorder,
      width: {
        size: 35,
        type: WidthType.PERCENTAGE,
      },
    }),
    new TableCell({
      children: [new Paragraph("")], // Middle cell
      borders: whiteBorder,
      width: {
        size: 20,
        type: WidthType.PERCENTAGE,
      },
    }),
    new TableCell({
      children: [
        new Paragraph({
          children: [new TextRun({ text: date, font: "Times New Roman", size: 22 })],
          alignment: AlignmentType.RIGHT,
        }),
      ],
      verticalAlign: VerticalAlign.CENTER,
      borders: whiteBorder,
      width: {
        size: 35,
        type: WidthType.PERCENTAGE,
      },
    }),
  ];

  const secondRowItems = [
    new TableCell({
      children: [
        new Paragraph({
          children: [new TextRun({ text: track, font: "Times New Roman", size: 22 })],
          alignment: AlignmentType.LEFT,
        }),
      ],
      verticalAlign: VerticalAlign.CENTER,
      borders: whiteBorder,
      width: {
        size: 35,
        type: WidthType.PERCENTAGE,
      },
    }),
    new TableCell({
      children: [
        new Paragraph({
          children: [new TextRun({ text: beginning, font: "Times New Roman", size: 22 })],
          alignment: AlignmentType.CENTER,
        }),
      ],
      verticalAlign: VerticalAlign.CENTER,
      borders: whiteBorder,
      width: {
        size: 20,
        type: WidthType.PERCENTAGE,
      },
    }),
    new TableCell({
      children: [
        new Paragraph({
          children: [new TextRun({ text: metrics, font: "Times New Roman", size: 22 })],
          alignment: AlignmentType.RIGHT,
        }),
      ],
      verticalAlign: VerticalAlign.CENTER,
      borders: whiteBorder,
      width: {
        size: 35,
        type: WidthType.PERCENTAGE,
      },
    }),
  ];

  return [
    new Table({
      rows: [
        new TableRow({ children: firstRowItems, height: { value: 450 } }),
        new TableRow({ children: secondRowItems, height: { value: 450 } }),
      ],
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      borders: whiteBorder,
    }),
    spacer,
  ];
};

export const JUDGES_INFO = (judges) => {
  const judgeRows = judges.map(judge => new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: multiLine(translateJudgeTitle(judge.title), false),
            alignment: AlignmentType.CENTER,
          })
        ],
        verticalAlign: VerticalAlign.CENTER,
        borders: noBorders,
        width: {
          size: 50,
          type: WidthType.PERCENTAGE,
        },
      }),
      new TableCell({
        children: [new Paragraph({
          children: [new TextRun({ text: judge.name, font: "Times New Roman", size: 22 })],
          alignment: AlignmentType.CENTER,
        })],
        verticalAlign: VerticalAlign.CENTER,
        borders: noBorders,
        width: {
          size: 50,
          type: WidthType.PERCENTAGE,
        },
      }),
    ],
    height: { value: 800 },
  }));

  return [
    new Table({
      rows: judgeRows,
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
    }),
    spacer,
  ];
};

const noBorders = {
  top: { style: BorderStyle.NONE },
  bottom: { style: BorderStyle.NONE },
  left: { style: BorderStyle.NONE },
  right: { style: BorderStyle.NONE },
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
