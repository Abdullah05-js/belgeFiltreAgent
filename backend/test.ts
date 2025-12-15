// import { googleAI } from '@genkit-ai/google-genai';
// import { genkit } from 'genkit';
// import mammoth from 'mammoth';
// import { z } from "genkit"
// import JSZip from "jszip";
// import { DOMParser } from "@xmldom/xmldom";

import { google } from "@ai-sdk/google";
import { generateText } from "ai";

// const ai = genkit({
//     plugins: [googleAI({
//         apiKey: process.env.GEMINI_API_KEY
//     })],
//     model: googleAI.model("gemini-2.5-flash")
// })


// const mainSchema = z.object({
//     category: z.string().describe("belge başlığı"),
//     tipi: z.enum(["TEZLİ YÜKSEK LİSANS", "TEZSİZ YÜKSEK LİSANS", "DOKTORA"]).describe("belge türü"),
//     studentName: z.string().describe("öğrenic isimi"),
//     studentNo: z.number().describe("öğrenci no"),
//     isAccepted: z.boolean().describe("kabul dürümü")
// })


// interface Iinput {
//     fileURL: string
// }

// export const FilterDocumentFlow = ai.defineFlow({
//     name: "FilterDocumentFlow",
//     inputSchema: z.object({
//         fileURL: z.string().describe("Object storage'dan dosya bağlantısı"),
//     }),
// }, async ({ fileURL }: Iinput) => {
//     try {
//         const file = await fetch(fileURL);
//         const arrayBuffer = await file.arrayBuffer();

//         const zip = await JSZip.loadAsync(Buffer.from(arrayBuffer));
//         const headerFiles = Object.keys(zip.files).filter(f => f.match(/word\/header\d*\.xml$/));
//         const result = await mammoth.convertToHtml({
//             buffer: Buffer.from(arrayBuffer),
//         });


//         let xmlText = "";

//         if (headerFiles.length > 0) {
//             // Sort them to ensure "header1.xml" is first
//             headerFiles.sort();

//             const firstHeaderFile = headerFiles[0]!;
//             xmlText = await zip.file(firstHeaderFile)!.async("text");
//         }



//         console.log("📄 Extracted Text Length:", xmlText);

//         const response = await ai.generate({
//             prompt: `

//             belge başlığı:
//                 ${xmlText}

//             belgenin ana bilgileri:
//                 ${result.value}


//             `,
//             output: { schema: mainSchema },
//         });


//         console.log("✅ Parsed Output:", response.output);


//     } catch (error) {
//         if (error instanceof z.ZodError) {
//             console.error("❌ Validation Error:", error.errors);
//         } else {
//             console.error("❌ Flow Error:", (error as Error).message);
//         }
//         throw error;
//     }
// });



// const file = await Bun.file("./ödev.pdf").arrayBuffer()
// const result = await generateText({
//     model: google('gemini-2.5-flash'),
//     messages: [
//         {
//             role: 'user',
//             content: [
//                 {
//                     type: 'text',
//                     text: 'burda ne görüyorsun ',
//                 },
//                 {
//                     type: 'file',
//                     data: file,
//                     mediaType: 'application/pdf',
//                 },
//             ],
//         },
//     ],
// });

// console.log(result.text, "\n----------------------------------\n", result.content);


import { AlignmentType, BorderStyle, Document, Header, ImageRun, Packer, PageBreak, Paragraph, Table, TableCell, TableRow, TextRun, WidthType, type ITableCellBorders } from "docx";

const file = await Bun.file("./karar_başlık.png").arrayBuffer()

const noBorders = {
    top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
};

const table = new Table({
    width: {
        size: 100 * 50,
        type: WidthType.PERCENTAGE,
    },
    rows: [
        // --- ROW 1: HEADERS ---
        new TableRow({
            children: [
                new TableCell({
                    borders: noBorders,
                    width: { size: 50 * 50, type: WidthType.PERCENTAGE },
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
                    borders: noBorders,
                    width: { size: 50 * 50, type: WidthType.PERCENTAGE },
                    children: [
                        new Paragraph({
                            alignment: AlignmentType.RIGHT, // Right Align
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
                    borders: noBorders,
                    width: { size: 50 * 50, type: WidthType.PERCENTAGE },
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
                    borders: noBorders,
                    width: { size: 50 * 50, type: WidthType.PERCENTAGE },
                    children: [
                        new Paragraph({
                            alignment: AlignmentType.RIGHT, // Right Align
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

// --- DOCUMENT DEFINITION ---
const doc = new Document({
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

                // 2. Spacer
                new Paragraph({ text: "" }),

                // 3. "Sayı" Paragraph
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "Sayı : 14029370.050.02.04-",
                            bold: true,
                            size: 24
                        }),
                    ]
                }),

                // 4. "Konu" Paragraph
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

                // 6. THE TABLE (Now a direct child of the section, NOT inside a Paragraph)
                table,
            

            ],
        },
    ],
});

Packer.toBuffer(doc).then((buffer) => {
    Bun.write("My Document.docx", buffer);
});