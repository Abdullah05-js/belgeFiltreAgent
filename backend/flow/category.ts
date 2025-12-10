import { z } from "genkit";
import { Document, Paragraph, TextRun, AlignmentType, HeadingLevel, type ISectionOptions } from "docx";
import type { FilteredDocumentResult } from "./FilterDocumentFlow";

const studentSchema = z.object({
    no: z.number().describe("öğrenci no."),
    fullName: z.string().describe("öğrenci Adı, Soyadı."),
    majoring: z.string().describe("öğrenci Anabilim Dalı."),
}).describe("öğrenci bilgileri.");

const yuksekLisansSavunmaOutput = z.object({
    student: studentSchema,
    isTez: z.boolean().describe("ortak rapor tez türünde ise true tezsiz ise false olur."),
    tez: z.object({
        name: z.string().describe("tez isimi."),
        nameEng: z.string().describe("inglizce tez isimi."),
        isNameChange: z.boolean().describe("tez isimi değişikliği."),
        ChangedName: z.string().describe("yeni tez isimi tez isimi değişikliği yoksa boş bırakılır."),
        ChangedNameEng: z.string().describe("yeni inglizce tez isimi değişikliği yoksa boş bırakılır."),
        advisor: z.string().describe("Danışman Unvanı, Adı, Soyadı."),
    }).nullable().describe("isTez true ise doldur değil ise null"),
    project: z.object({
        name: z.string().describe("proje isimi."),
        nameEng: z.string().describe("inglizce proje isimi."),
        isNameChange: z.boolean().describe("tez isimi değişikliği."),
    }).nullable().describe("isTez false ise doldur değil ise null"),
    isAccept: z.boolean().describe("kabul durumu")
});

const doktoraSavunmaOutput = z.object({
    student: studentSchema,
    tez: z.object({
        name: z.string().describe("tez başlığı."),
        nameEng: z.string().describe("inglizce tez başlığı."),
        advisor: z.string().describe("Danışman Unvanı, Adı, Soyadı."),
    }),
    isAccept: z.boolean().describe("kabul durumu")
});

const yuksekLisansKonuBildirimiOutput = z.object({
    student: z.object({
        no: z.number().describe("öğrenci no."),
        fullName: z.string().describe("öğrenci Adı, Soyadı."),
        majoring: z.string().describe("öğrenci Anabilim Dalı."),
        address: z.string().describe("öğrenci adres."),
        email: z.string().email().describe("öğrenci e-posta."),
        phone: z.string().describe("öğrenci telefon numarası.")
    }),
    isTez: z.boolean().describe("Belge tez türünde ise true tezsiz ise false olur."),
    tez: z.object({
        name: z.string().describe("tez başliğı."),
        nameEng: z.string().describe("inglizce tez başlığı."),
        lang: z.enum(["TÜRKÇE", "İNGİLİZCE"]).describe("tez dili"),
        summery: z.string().describe("tez özeti")
    }).nullable().describe("isTez true ise doldur değil ise null"),
    project: z.object({
        name: z.string().describe("proje başlığı."),
        nameEng: z.string().describe("inglizce proje başlığı."),
        lang: z.enum(["TÜRKÇE", "İNGİLİZCE"]).describe("proje dili"),
        summery: z.string().describe("proje özeti")
    }).nullable().describe("isTez false ise doldur değil ise null"),
});

export const Categorys = {
    "Yüksek Lisans TEZ/PROJE SAVUNMASI JÜRİ ORTAK RAPORU": {
        output: yuksekLisansSavunmaOutput,
        docx: (data: z.infer<typeof yuksekLisansSavunmaOutput>): ISectionOptions => {
            const { isAccept, student, isTez, tez, project } = data;

            return {
                properties: {},
                children: [
                    new Paragraph({
                        text: "YÜKSEK LİSANS TEZ/PROJE SAVUNMASI JÜRİ ORTAK RAPORU",
                        heading: HeadingLevel.HEADING_1,
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Öğrenci Bilgileri", bold: true, size: 24 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: `Adı Soyadı: ${student.fullName}` }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: `Öğrenci No: ${student.no}` }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: `Anabilim Dalı: ${student.majoring}` }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: isTez ? "Tez Bilgileri" : "Proje Bilgileri", bold: true, size: 24 }),
                        ],
                    }),
                    ...(isTez && tez ? [
                        new Paragraph({
                            children: [
                                new TextRun({ text: `Tez Adı: ${tez.name}` }),
                            ],
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({ text: `Thesis Title: ${tez.nameEng}` }),
                            ],
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({ text: `Danışman: ${tez.advisor}` }),
                            ],
                        }),
                        ...(tez.isNameChange ? [
                            new Paragraph({ text: "" }),
                            new Paragraph({
                                children: [
                                    new TextRun({ text: "Tez İsim Değişikliği", bold: true }),
                                ],
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({ text: `Yeni Tez Adı: ${tez.ChangedName}` }),
                                ],
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({ text: `New Thesis Title: ${tez.ChangedNameEng}` }),
                                ],
                            }),
                        ] : []),
                    ] : []),
                    ...(!isTez && project ? [
                        new Paragraph({
                            children: [
                                new TextRun({ text: `Proje Adı: ${project.name}` }),
                            ],
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({ text: `Project Title: ${project.nameEng}` }),
                            ],
                        }),
                        ...(project.isNameChange ? [
                            new Paragraph({ text: "" }),
                            new Paragraph({
                                children: [
                                    new TextRun({ text: "Proje İsim Değişikliği Talep Edildi", bold: true }),
                                ],
                            }),
                        ] : []),
                    ] : []),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Savunma Sonucu: ", bold: true }),
                            new TextRun({
                                text: isAccept ? "KABUL" : "RED",
                                bold: true,
                                color: isAccept ? "00FF00" : "FF0000"
                            }),
                        ],
                    }),
                ],
            }
        }
    },

    "Doktora TEZ SAVUNMASI JÜRİ ORTAK RAPORU": {
        output: doktoraSavunmaOutput,
        docx: (data: z.infer<typeof doktoraSavunmaOutput>): ISectionOptions => {
            const { isAccept, student, tez } = data;

            return {
                properties: {},
                children: [
                    new Paragraph({
                        text: "DOKTORA TEZ SAVUNMASI JÜRİ ORTAK RAPORU",
                        heading: HeadingLevel.HEADING_1,
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Öğrenci Bilgileri", bold: true, size: 24 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: `Adı Soyadı: ${student.fullName}` }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: `Öğrenci No: ${student.no}` }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: `Anabilim Dalı: ${student.majoring}` }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Tez Bilgileri", bold: true, size: 24 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: `Tez Başlığı: ${tez.name}` }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: `Thesis Title: ${tez.nameEng}` }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: `Danışman: ${tez.advisor}` }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Savunma Sonucu: ", bold: true }),
                            new TextRun({
                                text: isAccept ? "KABUL" : "RED",
                                bold: true,
                                color: isAccept ? "00FF00" : "FF0000"
                            }),
                        ],
                    }),
                ],
            }
        }
    },

    "Yüksek Lisans TEZ/PROJE KONUSU BİLDİRİMİ VE KONU DEĞİŞİKLİĞİ FORMU": {
        output: yuksekLisansKonuBildirimiOutput,
        docx: (data: z.infer<typeof yuksekLisansKonuBildirimiOutput>): ISectionOptions => {
            const { student, isTez, tez, project } = data;
            return {
                properties: {},
                children: [
                    new Paragraph({
                        text: "YÜKSEK LİSANS TEZ/PROJE KONUSU BİLDİRİMİ VE KONU DEĞİŞİKLİĞİ FORMU",
                        heading: HeadingLevel.HEADING_1,
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Öğrenci Bilgileri", bold: true, size: 24 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: `Adı Soyadı: ${student.fullName}` }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: `Öğrenci No: ${student.no}` }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: `Anabilim Dalı: ${student.majoring}` }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: `Adres: ${student.address}` }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: `E-posta: ${student.email}` }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: `Telefon: ${student.phone}` }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: isTez ? "Tez Konusu Bildirimi" : "Proje Konusu Bildirimi", bold: true, size: 24 }),
                        ],
                    }),
                    ...(isTez && tez ? [
                        new Paragraph({
                            children: [
                                new TextRun({ text: `Tez Başlığı: ${tez.name}` }),
                            ],
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({ text: `Thesis Title: ${tez.nameEng}` }),
                            ],
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({ text: `Tez Dili: ${tez.lang}` }),
                            ],
                        }),
                        new Paragraph({ text: "" }),
                        new Paragraph({
                            children: [
                                new TextRun({ text: "Tez Özeti:", bold: true }),
                            ],
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({ text: tez.summery }),
                            ],
                        }),
                    ] : []),
                    ...(!isTez && project ? [
                        new Paragraph({
                            children: [
                                new TextRun({ text: `Proje Başlığı: ${project.name}` }),
                            ],
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({ text: `Project Title: ${project.nameEng}` }),
                            ],
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({ text: `Proje Dili: ${project.lang}` }),
                            ],
                        }),
                        new Paragraph({ text: "" }),
                        new Paragraph({
                            children: [
                                new TextRun({ text: "Proje Özeti:", bold: true }),
                            ],
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({ text: project.summery }),
                            ],
                        }),
                    ] : []),
                ],
            }
        }
    },
};

export function combineDocuments(items: FilteredDocumentResult[]): Document {
    const allSections: ISectionOptions[] = [];

    items.forEach((item, index) => {
        const sections = Categorys[item.category].docx(item.data as any);
        allSections.push(sections);
    });

    return new Document({ sections: allSections });
}


export type CategoryKey = keyof typeof Categorys;