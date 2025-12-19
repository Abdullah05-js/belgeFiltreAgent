import { AlignmentType, BorderStyle, Document, Header, ImageRun, Packer, PageBreak, Paragraph, Table, TableCell, TableRow, TextRun, WidthType, type ITableCellBorders } from "docx";
import { noBorders } from "../categorys/shared";
const file = await Bun.file("./karar_başlık.png").arrayBuffer()

const table = new Table({
    width: {
        size: 0, type: WidthType.AUTO
    },
    rows: [
        // --- ROW 1: HEADERS ---
        new TableRow({
            children: [
                new TableCell({
                    width: { size: 0, type: WidthType.AUTO },
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "TOPLANTI NO",
                                    bold: true,
                                    size: 20,
                                    underline: { type: "single" },
                                }),
                            ],
                        }),
                    ],
                }),
                new TableCell({
                    width: { size: 0, type: WidthType.AUTO },
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "TOPLANTI TARİHİ",
                                    bold: true,
                                    size: 20,
                                    underline: { type: "single" },
                                }),
                            ],
                        }),
                    ],
                }),
            ],
        }),

        // --- ROW 2: DATA ---
        new TableRow({
            children: [
                new TableCell({
                    width: { size: 0, type: WidthType.AUTO },
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "2023/49",
                                    bold: true,
                                    size: 18,
                                }),
                            ],
                        }),
                    ],
                }),
                new TableCell({
                    width: { size: 0, type: WidthType.AUTO },
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "27/12/2023",
                                    bold: true,
                                    size: 18,
                                }),
                            ],
                        }),
                    ],
                }),
            ],
        }),
    ],
});


export default function generateDocx(data: (Paragraph | Table)[][]): Document {

    return new Document({
        sections: [
            {
                properties: {
                    titlePage: true,
                    page: {
                        margin: {
                            left: 20 * 20,
                            right: 20 * 20,
                            top: 20 * 20,
                        }
                    }
                },
                headers: {
                    first: new Header({
                        children: [],
                    }),

                    default: new Header({
                        children: [
                            table
                        ],
                    }),
                },
                children: [
                    // 1. Image Paragraph
                    new Paragraph({
                        children: [
                            new ImageRun({
                                type: "png",
                                data: file,
                                transformation: {
                                    width: 780,
                                    height: 200,
                                }
                            }),
                        ],
                    }),

                    new Paragraph({ text: "" }),

                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Sayı : 14029370.050.02.04-",
                                bold: true,
                                size: 24
                            }),
                        ]
                    }),

                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Konu : Enstitü Yönetim Kurulu Toplantısı Kararları",
                                bold: true,
                                size: 24
                            }),
                        ]
                    }),

                    new Paragraph({ text: "" }),

                    table,

                    ...data.flat()

                ],
            },
        ],
    });
}