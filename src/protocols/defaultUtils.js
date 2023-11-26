import { Paragraph, HeightRule, TextRun, HeadingLevel, AlignmentType, WidthType, Table, TableRow, TableCell, BorderStyle, VerticalAlign, TableLayoutType, PageBreak   } from "docx";

const spacer = new Paragraph({
    children: [ new TextRun(" ")],
});
const invisibleBorder = {
    size: 0,
    style: BorderStyle.NONE,
    color: "FFFFFF",
};
const cellBorders = ({
    top: invisibleBorder,
    bottom: invisibleBorder,
    left: invisibleBorder,
});
const rowBorders = ({
    top: invisibleBorder,
    left: invisibleBorder,
});
const allCellBorders = ({...cellBorders, right: invisibleBorder});

const spacing = { before: 50, after: 50 };

const multiLine = (text, allCaps = false) => text.split('\n').map((t, index) => index ? new TextRun({text: t, break: 1, allCaps }) : new TextRun({text: t, allCaps }))

/**
 * 
 * @param {{ width: number, text: string }} - cell properties 
 * @returns 
 */
const cellObject = ({width, text, borders, columnSpan}) => {
    const celData = {
        children: [
            new Paragraph({
                text: text,
                alignment: AlignmentType.CENTER
            })
        ],
        verticalAlign: VerticalAlign.CENTER,
        spacing
    };
    if (width) celData.width = {
        size: width,
        type: WidthType.PERCENTAGE,
    }
    if (borders) celData.borders = borders;
    if (columnSpan) celData.columnSpan = columnSpan;
    return celData;
};

const PAGE_HEADER = (header) => {
    const { headerLine, subLine, protocolLine, subProtocolLine, location, date, track, metrics } = header;
    const items = [
        new Paragraph({
            children: multiLine(headerLine, true),
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER
        }),
        new Paragraph({
            children: multiLine(subLine),
            heading: HeadingLevel.HEADING_3,
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 400 } 
        }),
        new Paragraph({
            children: multiLine(protocolLine, true),
            heading: HeadingLevel.HEADING_3,
            alignment: AlignmentType.CENTER
        }),
        new Paragraph({
            children: multiLine(subProtocolLine),
            heading: HeadingLevel.HEADING_3,
            alignment: AlignmentType.CENTER,
        }),
        spacer,
        ...SPACE_BETWEEN(location, date)
    ];
    const optionalItems = track || metrics 
        ? [...SPACE_BETWEEN(track, metrics)] 
        : [];
    return [ ...items, ...optionalItems ];
}

const SPACE_BETWEEN = (leftText, rightText, options = { space: 0, heading: undefined} ) => {
    const items = [
        new TableCell({
            children: [new Paragraph({
                children: multiLine(leftText),
                alignment: AlignmentType.LEFT,
                heading: options.heading ? options.heading : undefined,
                width: {
                    size: 25,
                    type: WidthType.PERCENTAGE,
                },
            })],
            verticalAlign: VerticalAlign.CENTER,
            borders: allCellBorders,
        }),
        new TableCell({
            children: [new Paragraph("")], // Middle cell
            borders: allCellBorders,
        }),
        new TableCell({
            children: [new Paragraph({
                children: multiLine(rightText),
                alignment: AlignmentType.RIGHT,
                heading: options.heading ? options.heading : undefined,
                width: {
                    size: 25,
                    type: WidthType.PERCENTAGE,
                },
            })],
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
                    children: options.space ? [
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
                    ] : items
                })
            ],
            width: {
                size: 100,
                type: WidthType.PERCENTAGE,
            },
        }),
        spacer
    ]
};

const TABLE_TEAM_RESULTS_HEAD = (item = { columns: []}) => {
    const ItemColumnWidth = item.columns.length ? 100 / item.columns.length : 25;
    return new TableRow({
        children: [
            new TableCell(cellObject({text: item.locationHeader, width: 10})),
            new TableCell(cellObject({text: item.teamHeader, width: 15})),
            new TableCell({
                width: {
                    size: 60,
                    type: WidthType.PERCENTAGE,
                },
                children: [
                    new Table({
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell(cellObject({text: item.unitedHeader, borders: {
                                    top: invisibleBorder,
                                    left: invisibleBorder,
                                    right: invisibleBorder,
                                }, columnSpan: 4 })),
                            ],
                            tableHeader: true,
                        }),
                        new TableRow({
                            children: item.columns
                                .map((columnName, index) => {
                                    return new TableCell({
                                        children: [
                                        new Table({
                                            width: {
                                                size: 100,
                                                type: WidthType.PERCENTAGE,
                                            },
                                            rows: [
                                                new TableRow({
                                                    height: { value: 700, rule: HeightRule.ATLEAST },
                                                    children: [
                                                    new TableCell(cellObject({text: columnName, borders: {
                                                        top: invisibleBorder,
                                                        left: invisibleBorder,
                                                        right: invisibleBorder,
                                                    }, columnSpan: 2 }))
                                                    ],
                                                    tableHeader: true,
                                                }),
                                                new TableRow({
                                                    height: { value: 400, rule: HeightRule.EXACT },
                                                    children: [
                                                        new TableCell(
                                                            cellObject({text: 'Час', width: 50, borders: cellBorders})
                                                        ),
                                                        new TableCell(
                                                            cellObject({text: 'Місце', width: 50, borders: {
                                                                ...cellBorders,
                                                                right: invisibleBorder
                                                            }})
                                                        )
                                                    ],
                                                }),
                                            ],
                                        })
                                        ],
                                        width: {
                                            size: ItemColumnWidth,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        borders: index === item.columns.length - 1 ? { ...cellBorders, right: invisibleBorder } : cellBorders,
                                    })
                                })
                            }),
                        ],
                    }),
                ],
            }),
            new TableCell(cellObject({text: item.totalHeader, width: 15})),
        ],
    })
};

const TABLE_PERSONAL_RESULTS_HEAD = (item) => {
    return new TableRow({
        tableHeader: true,
        children: [
            new TableCell(cellObject({text: item.location, width: 7})),
            new TableCell(cellObject({text: item.number, width: 8})),
            new TableCell(cellObject({text: item.initials, width: 25})),
            new TableCell(cellObject({text: item.bday, width: 10})),
            new TableCell(cellObject({text: item.team, width: 20})),
            new TableCell(cellObject({text: item.results, width: 30})),
        ]
    });
};
const TABLE_PERSONAL_RESULTS_ROW = (item) => {
    return new TableRow({
        children: [
            new TableCell(cellObject({text: item.location, width: 7})),
            new TableCell(cellObject({text: item.number, width: 8})),
            new TableCell(cellObject({text: item.initials, width: 25})),
            new TableCell(cellObject({text: item.bday, width: 10})),
            new TableCell(cellObject({text: item.team, width: 20})),
            new TableCell(cellObject({text: item.results, width: 30})),
        ]
    });
};

const TABLE_DUELING_PERSONAL_RESULTS_HEAD = (item) => {
    const ItemColumnWidth = item.columns.length ? 100 / item.columns.length : 25;
    return new TableRow({
        tableHeader: true,
        children: [
            new TableCell(cellObject({text: item.location, width: 7})),
            new TableCell(cellObject({text: item.number, width: 7})),
            new TableCell(cellObject({text: item.initials, width: 25})),
            new TableCell(cellObject({text: item.bday, width: 10})),
            new TableCell(cellObject({text: item.team, width: 20})),
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
                                    return new TableCell(cellObject({
                                        text: columnText, width: ItemColumnWidth, 
                                        borders: index === item.columns.length -1 ? {...cellBorders, right: invisibleBorder} : cellBorders
                                    }))
                                })
                            })
                        ]
                    })
                ],
                width: {
                    size: 30,
                    type: WidthType.PERCENTAGE,
                },
                verticalAlign: VerticalAlign.CENTER,
            }),
        ]
    });
};
const TABLE_DUELING_PERSONAL_RESULTS_ROW = (item) => {
    const ItemColumnWidth = item.columns.length ? 100 / item.columns.length : 25;
    return new TableRow({
        children: [
            new TableCell(cellObject({text: item.location, width: 7})),
            new TableCell(cellObject({text: item.number, width: 8})),
            new TableCell(cellObject({text: item.initials, width: 25})),
            new TableCell(cellObject({text: item.bday, width: 10})),
            new TableCell(cellObject({text: item.team, width: 20})),
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
                                    return new TableCell(cellObject({
                                        text: columnText, 
                                        width: ItemColumnWidth,
                                        borders: index === item.columns.length -1 ? {...cellBorders, right: invisibleBorder} : cellBorders
                                    })) 
                                })
                            })
                        ]
                    })
                ],
                width: {
                    size: 30,
                    type: WidthType.PERCENTAGE,
                },
                verticalAlign: VerticalAlign.CENTER,
            }),
        ]
    });
};

const TABLE_PERSONAL_RESULTS_HEAD_EXTENDED = (item) => {
    return new TableRow({
        tableHeader: true,
        children: [
            new TableCell(cellObject({text: item.location, width: 7})),
            new TableCell(cellObject({text: item.number, width: 8})),
            new TableCell(cellObject({text: item.initials, width: 25})),
            new TableCell(cellObject({text: item.bday, width: 10})),
            new TableCell(cellObject({text: item.team, width: 20})),
            new TableCell({
                width: {
                    size: 30,
                    type: WidthType.PERCENTAGE,
                },
                verticalAlign: VerticalAlign.CENTER,
                children: [
                    new Table({
                        width: {
                            size: 100,
                            type: WidthType.PERCENTAGE,
                        },
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell(cellObject({text: item.first, width: 33.33, borders: cellBorders})),
                                    new TableCell(cellObject({text: item.second, width: 33.33, borders: cellBorders})),
                                    new TableCell(cellObject({text: item.final, width: 33.33, borders: allCellBorders}))
                                ]
                            })
                        ]
                    })
                ],
            }),
        ]
    });
};
const TABLE_PERSONAL_RESULTS_ROW_EXTENDED = (item) => {
    return new TableRow({
        children: [
            new TableCell(cellObject({text: item.location, width: 7})),
            new TableCell(cellObject({text: item.number, width: 8})),
            new TableCell(cellObject({text: item.initials, width: 25})),
            new TableCell(cellObject({text: item.bday, width: 10})),
            new TableCell(cellObject({text: item.team, width: 20})),
            new TableCell({
                children: [
                    new Table({
                        width: {
                            size: 100,
                            type: WidthType.PERCENTAGE,
                        },
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell(cellObject({text: item.first, width: 33.33, borders: cellBorders})),
                                    new TableCell(cellObject({text: item.second, width: 33.33, borders: cellBorders})),
                                    new TableCell(cellObject({text: item.final, width: 33.33, borders: allCellBorders}))
                                ]
                            })
                        ]
                    })
                ],
                width: {
                    size: 30,
                    type: WidthType.PERCENTAGE,
                },
                verticalAlign: VerticalAlign.CENTER,
            }),
        ]
    });
};

const TABLE_TEAM_RESULTS_BY_TYPE_ROW = (item = { rows: []}) => {
    return new TableRow({
        children: [
            new TableCell(cellObject({text: item.number, width: 10})),
            new TableCell({
                width: {
                    size: 90,
                    type: WidthType.PERCENTAGE,
                },
                verticalAlign: VerticalAlign.CENTER,
                children: [new Table({
                    width: {
                        size: 100,
                        type: WidthType.PERCENTAGE,
                    },
                    rows: (() => {
                        const showExcluded = !!item.team?.excluded?.length;
                        const rows = [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        width: {
                                            size: 100,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        borders: showExcluded ? { ...rowBorders, right: invisibleBorder } : allCellBorders,
                                        children: [
                                            new Table({
                                                width: {
                                                    size: 100,
                                                    type: WidthType.PERCENTAGE,
                                                },
                                                rows: [
                                                    new TableRow({
                                                        children: [
                                                            new TableCell(cellObject({text: item.team.name, width: 25, borders: cellBorders})),
                                                            new TableCell({
                                                                width: {
                                                                    size: 75,
                                                                    type: WidthType.PERCENTAGE,
                                                                },
                                                                borders: {
                                                                    ...cellBorders,
                                                                    right: invisibleBorder
                                                                },
                                                                children: [
                                                                    new Table({
                                                                        width: {
                                                                            size: 100,
                                                                            type: WidthType.PERCENTAGE,
                                                                        },
                                                                        rows: item.team.participants.reduce((acc, participant, nextIndex) => {
                                                                            const borders = item.team.participants.length === nextIndex + 1
                                                                                ? cellBorders
                                                                                : rowBorders;
                                                                            return [...acc,
                                                                                new TableRow({
                                                                                    children: [
                                                                                        new TableCell(cellObject({text: participant.initials, width: 40, borders })),
                                                                                        new TableCell(cellObject({text: participant.bday, width: 20, borders })),
                                                                                        new TableCell(cellObject({text: participant.result1, width: 20, borders })),
                                                                                        new TableCell(cellObject({text: participant.result2, width: 20, borders: { ...borders, right: invisibleBorder } }))
                                                                                    ]
                                                                                })
                                                                            ]
                                                                        }, [])
                                                                    })
                                                                ],
                                                            })
                                                        ]
                                                    })
                                                ]
                                            })
                                        ],
                                    })
                                ]
                            })
                        ];
                        return showExcluded 
                            ? [
                                ...rows,
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            width: {
                                                size: 100,
                                                type: WidthType.PERCENTAGE,
                                            },
                                            borders: {...cellBorders, right: invisibleBorder},
                                            children: [
                                                new Table({
                                                    width: {
                                                        size: 100,
                                                        type: WidthType.PERCENTAGE,
                                                    },
                                                    rows: [
                                                        new TableRow({
                                                            children: [
                                                                new TableCell(cellObject({text: item.team.others, width: 25, borders: cellBorders })),
                                                                new TableCell({
                                                                    width: {
                                                                        size: 75,
                                                                        type: WidthType.PERCENTAGE,
                                                                    },
                                                                    children: [
                                                                        new Table({
                                                                            width: {
                                                                                size: 100,
                                                                                type: WidthType.PERCENTAGE,
                                                                            },
                                                                            rows: item.team.excluded.reduce((acc, participant, nextIndex) => {
                                                                                const borders = item.team.excluded.length === nextIndex + 1
                                                                                    ? cellBorders
                                                                                    : rowBorders;
                                                                                return [...acc,
                                                                                    new TableRow({
                                                                                        children: [
                                                                                            new TableCell(cellObject({text: participant.initials, width: 40, borders })),
                                                                                            new TableCell({
                                                                                                width: {
                                                                                                    size: 20,
                                                                                                    type: WidthType.PERCENTAGE,
                                                                                                },
                                                                                                borders,
                                                                                                children: [
                                                                                                    new Paragraph({text: participant.bday, alignment: AlignmentType.CENTER})
                                                                                                ],
                                                                                                verticalAlign: VerticalAlign.CENTER,
                                                                                            }),
                                                                                            new TableCell(cellObject({text: participant.result1, width: 20, borders })),
                                                                                            new TableCell(cellObject({text: participant.result2, width: 20, borders: { ...borders, right: invisibleBorder } }))
                                                                                        ]
                                                                                    })
                                                                                ]
                                                                            }, [])
                                                                        })
                                                                    ],
                                                                    borders: {
                                                                        ...cellBorders,
                                                                        right: invisibleBorder
                                                                    },
                                                                })
                                                            ]
                                                        })
                                                    ]
                                                })
                                            ],
                                        })
                                    ]
                                }),
                            ]
                            : rows;
                    })(),
                })
                ],
            })
        ]
    });
};


const TABLE_TEAM_RESULTS_ROW = (item = { columns: []}) => {
    const ItemColumnWidth = item.columns.length ? 100 / item.columns.length : 25;
    return new TableRow({
        children: [
            new TableCell(cellObject({text: item.teamNumber, width: 5 })),
            new TableCell(cellObject({text: item.teamName, width: 18 })),
            new TableCell({
                children: [
                new Table({
                    width: {
                        size: 100,
                        type: WidthType.PERCENTAGE,
                    },
                    rows: [
                    new TableRow({
                        children: item.columns.map((column, index) => {
                        return new TableCell({
                            children: [
                            new Table({
                                width: {
                                    size: 100,
                                    type: WidthType.PERCENTAGE,
                                },
                                rows: [
                                new TableRow({
                                    children: [
                                        new TableCell(cellObject({text: column.time, width: 50, borders: cellBorders })),
                                        new TableCell(cellObject({text: column.position, width: 50, borders: { ...cellBorders, right: invisibleBorder } }))
                                    ]
                                })
                                ]
                            })
                            ],
                            width: {
                                size: ItemColumnWidth,
                                type: WidthType.PERCENTAGE,
                            },
                            borders: index === item.columns.length -1 ? {...cellBorders, right: invisibleBorder} : cellBorders,
                        });
                    })
                    }),
                    ],
                }),
                ],
                width: {
                    size: 65,
                    type: WidthType.PERCENTAGE,
                },
                verticalAlign: VerticalAlign.CENTER,
            }),
            new TableCell(cellObject({text: item.teamTotals, width: 12})),
        ]
  });
};



const TABLE_TEAM_RELAY_RESULTS_HEAD = (item) => {
    return new TableRow({
        children: [
            new TableCell(cellObject({text: item.location, width: 10})),
            new TableCell({
                width: {
                    size: 45,
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
                                    new TableCell(cellObject({text: item.number, width: 25, borders: cellBorders })),
                                    new TableCell(cellObject({text: item.initials, width: 45, borders: cellBorders })),
                                    new TableCell(cellObject({text: item.bday, width: 30, borders: allCellBorders }))
                                ],
                            }),
                        ]
                    }),
                ],
            }),
            new TableCell(cellObject({text: item.team, width: 21 })),
            new TableCell(cellObject({text: item.first, width: 8 })),
            new TableCell(cellObject({text: item.second, width: 8 })),
            new TableCell(cellObject({text: item.final, width: 8 })),
        ],
    })
};

const TABLE_TEAM_RELAY_RESULTS_ROW = (item) => {
    return new TableRow({
        children: [
            new TableCell(cellObject({text: item.location, width: 10 })),
            new TableCell({
                width: {
                    size: 45,
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
                            const borders = index === item.participants.length - 1 ? { ...rowBorders, bottom: invisibleBorder } : rowBorders;
                            return new TableRow({
                                children: [
                                    new TableCell(cellObject({text: participant.number, width: 25, borders })),
                                    new TableCell(cellObject({text: participant.initials, width: 45, borders })),
                                    new TableCell(cellObject({text: participant.bday, width: 30, borders: { ...borders, right: invisibleBorder } }))
                                ],
                            })
                        })
                    }),
                ],
            }),
            new TableCell(cellObject({text: item.team, width: 21 })),
            new TableCell(cellObject({text: item.first, width: 8 })),
            new TableCell(cellObject({text: item.second, width: 8 })),
            new TableCell(cellObject({text: item.final, width: 8 })),
        ],
  });
};

// Add the header rows to the table
const TABLE_TEAM_RESULTS = (items) => {
    return [
        ...items.map((data) => {
            return new Table({
                rows: [
                  TABLE_TEAM_RESULTS_HEAD(data.head),
                  ...data.rows.map((item) => TABLE_TEAM_RESULTS_ROW(item)),
                ],
                width: {
                  size: 100,
                  type: WidthType.PERCENTAGE,
                },
            })
        }),
        spacer
    ];
};

const TABLE_PERSONAL_RESULTS = (items) => {
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
                    rows: data.zalik 
                        ? [
                            TABLE_PERSONAL_RESULTS_HEAD_EXTENDED(data.head),
                            ...data.rows.map((item) => TABLE_PERSONAL_RESULTS_ROW_EXTENDED(item)),
                        ] 
                        : [
                            TABLE_PERSONAL_RESULTS_HEAD(data.head),
                            ...data.rows.map((item) => TABLE_PERSONAL_RESULTS_ROW(item)),
                        ]
                    ,
                    width: {
                      size: 100,
                      type: WidthType.PERCENTAGE,
                    },
                }),
                spacer
            ];
        }, [])
    ];
};

const TABLE_DUELING_PERSONAL_RESULTS = (items) => {
    return [
        ...items.reduce((acc = [], data) => {
            return [
                ...acc,
                new Table({
                    rows: [
                        TABLE_DUELING_PERSONAL_RESULTS_HEAD(data.head),
                        ...data.rows.map((item) => TABLE_DUELING_PERSONAL_RESULTS_ROW(item)),
                    ],
                    width: {
                      size: 100,
                      type: WidthType.PERCENTAGE,
                    },
                }),
                spacer
            ];
        }, [])
    ];
};

const TABLE_TEAM_RESULTS_BY_TYPE = (items) => {
    return [
        ...items.reduce((acc = [], data) => {
            return [
                ...acc,
                new Table({
                    rows: [
                      ...data.rows.map((item) => TABLE_TEAM_RESULTS_BY_TYPE_ROW(item)),
                    ],
                    width: {
                      size: 100,
                      type: WidthType.PERCENTAGE,
                    },
                }),
                spacer
            ];
        }, [])
    ];
};

// Add the header rows to the table
const TABLE_TEAM_RELAY_RESULTS = (items) => {
    return [
        ...items.map((data) => {
            return new Table({
                rows: [
                    TABLE_TEAM_RELAY_RESULTS_HEAD(data.head),
                    ...data.rows.map((item) => TABLE_TEAM_RELAY_RESULTS_ROW(item)),
                ],
                width: {
                  size: 100,
                  type: WidthType.PERCENTAGE,
                },
            })
        }),
        spacer
    ];
};

const GIVE_TABLE_BY_TYPE = (type, tables) => {
    switch (type) {
        case 'TEAM_RESULTS':
            return TABLE_TEAM_RESULTS(tables)
        case 'TEAM_RELAY_RESULTS':
            return TABLE_TEAM_RELAY_RESULTS(tables)
        case 'TEAM_RESULTS_BY_TYPE':
            return TABLE_TEAM_RESULTS_BY_TYPE(tables)
        case 'DUELING_PERSONAL_RESULTS':
            return TABLE_DUELING_PERSONAL_RESULTS(tables)
        case 'PERSONAL_RESULTS':
            return TABLE_PERSONAL_RESULTS(tables)
        default:
            console.error(`Incorrect table type`);
      }
};

const PAGE_JUDGES = (judges) => {
    return judges.reduce((acc = [], judge) => [...acc, ...SPACE_BETWEEN(judge.title, judge.name, { space: 5, heading: HeadingLevel.HEADING_3 })], []);
};

// 7 
export const DATA_TO_DOC_PAGES = (pages) => {
    return pages.reduce((acc, next, index) => {
        let mergedTable = [
            ...PAGE_HEADER(next.header),
            ...GIVE_TABLE_BY_TYPE(next.type, next.tables),
            ...PAGE_JUDGES(next.judges),
        ];
        if (index !== pages.length - 1) mergedTable.push(new Paragraph({ children: [ new PageBreak() ] }));
        return [...acc, ...mergedTable]
    }, [])
};
