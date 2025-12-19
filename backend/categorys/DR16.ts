import z from 'zod';
import { ExternalHyperlink, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from 'docx';

export const DR16CategoryKey = "TEZ SAVUNMA JÜRI ÖNERI FORMU (DOKTORA)"

export const DR16Schema = z.object({
    student: z.object({
        fullName: z.string().describe("öğrenci Adı ve Soyadı."),
        no: z.string().describe("öğrenci No."),
        department: z.string().describe("öğrenci Anabilim Dalı.")
    }).describe("öğrenci bilgileri."),
    documentDetails: z.object({
        date: z.string().describe("evrak tarihi."),
        number: z.string().describe("evrak sayısı.")
    }).describe("Evrak Tarih ve Sayısı."),
    thesis: z.object({
        title: z.string().describe("Tez Adı."),
    }),
    exam: z.object({
        date: z.string().describe("Sınav tarihi."),
        clock: z.string().describe("Sınav saati."),
        link: z.string().describe("Uzaktan erişim bağlantı adresi."),
        examPlace: z.string().describe("Sınav yeri.")
    }),
    members: z.array(z.object({
        fullName: z.string().describe("Hocanın Ünvenı Adı Soyadı  örnek:Prof. Dr. Mehmet SARIBIYIK. Not:soyadı hepsi büyük harfler yapılmalıdır."),
        university: z.string().describe("Hocanın Üniversitesi."),
        role: z.enum(["Tez izleme komitesi üyesi (danışman)", "Tez izleme komitesi üyesi", "Kurum içi", "Kurum dışı üye"]).describe("Üyenin görevi")
    })).describe(`kapsamı dışında bulunan üniversitelerin asil üyeleri.`),
})


export type IDR16Schema = z.infer<typeof DR16Schema>
export type IMember = IDR16Schema["members"][number];


export const getDR16DocxOutput = (data: IDR16Schema, index: number) => {

    const { student, documentDetails, thesis, exam, members } = data
    let targetFullMember_KOU_Count = 3
    let targetFullMemberCount = 2
    let targetSpareMember_KOU_Count = 1
    let targetSpareMemberCount = 1
    const targetFullMembers: IMember[] = []
    const targetSpareMembers: IMember[] = []
    members.forEach((member) => {
        if (targetFullMember_KOU_Count !== 0 && member.university.toLowerCase().includes("kocaeli")) {
            targetFullMember_KOU_Count--
            targetFullMembers.push(member)
        } else if (targetFullMemberCount !== 0 && !member.university.toLowerCase().includes("kocaeli")) {
            targetFullMemberCount--
            targetFullMembers.push(member)
        } else if (targetSpareMember_KOU_Count !== 0 && member.university.toLowerCase().includes("kocaeli")) {
            targetSpareMember_KOU_Count--
            targetSpareMembers.push(member)
        } else if (targetSpareMemberCount !== 0 && !member.university.toLowerCase().includes("kocaeli")) {
            targetSpareMemberCount--
            targetSpareMembers.push(member)
        }
    })

    const targetFullMembersDocx = targetFullMembers.map((member) => {
        let role: string = ""
        if (member.role === "Kurum dışı üye" || member.role === "Kurum içi") {
            role = ""
        } else {
            role = `(${member.role})`
        }

        return new Paragraph({
            children: [
                new TextRun({
                    text: `${member.fullName} (${member.university}) ${role}`,
                    bold: true,
                    size: 24
                }),
            ]
        })
    })

    const targetSpareMembersDocx = targetSpareMembers.map((member) => {
        let role: string = ""
        if (member.role === "Kurum dışı üye" || member.role === "Kurum içi") {
            role = ""
        } else {
            role = `(${member.role})`
        }
        return new Paragraph({
            children: [
                new TextRun({
                    text: `${member.fullName} (${member.university}) ${role}`,
                    bold: true,
                    size: 24
                }),
            ]
        })
    })

    return [
        new Paragraph({ text: "" }),

        new Paragraph({
            children: [
                new TextRun({
                    text: `${index}) Aşağıda belirtilen öğrencilerin lisansüstü tez sınav jürileri ilgili Anabilim Dalı Kurullarının önerileri doğrultusunda, kararı verilen lisansüstü öğrencilerinin tez sınav jürilerinin aşağıdaki şekliyle oluşturulmasına oy çokluğu ile karar verildi.`,
                    bold: true,
                    size: 24
                }),
            ]
        }),

        new Paragraph({ text: "" }),

        new Table({
            width: {
                size: 100,
                type: WidthType.PERCENTAGE,
            },
            alignment: "center",
            rows: [
                // --- ROW 1: HEADERS ---
                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "Numarası",
                                            bold: true,
                                            size: 18,
                                        }),
                                    ],
                                }),
                            ],
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "Adı Soyadı",
                                            bold: true,
                                            size: 18,
                                        }),
                                    ],
                                }),
                            ],
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "Program",
                                            bold: true,
                                            size: 18,
                                        }),
                                    ],
                                }),
                            ],
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "Anabilim Dalı",
                                            bold: true,
                                            size: 18,
                                        }),
                                    ],
                                }),
                            ],
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "Tarih ve Sayısı",
                                            bold: true,
                                            size: 18,
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
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: student.no,
                                            bold: true,
                                            size: 15,
                                        }),
                                    ],
                                }),
                            ],
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: student.fullName,
                                            bold: true,
                                            size: 15,
                                        }),
                                    ],
                                }),
                            ],
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "Doktora",
                                            bold: true,
                                            size: 15,
                                        }),
                                    ],
                                }),
                            ],
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: student.department,
                                            bold: true,
                                            size: 15,
                                        }),
                                    ],
                                }),
                            ],
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: `${documentDetails.date}-${documentDetails.number}`,
                                            bold: true,
                                            size: 15,
                                        }),
                                    ],
                                }),
                            ],
                        }),
                    ],
                }),
            ],
        }),

        new Paragraph({ text: "" }),


        new Paragraph({
            children: [
                new TextRun({
                    text: `Tez İsmi: ${thesis.title}`,
                    bold: true,
                    size: 24
                }),
            ]
        }),

        new Paragraph({ text: "" }),


        new Paragraph({
            children: [
                new TextRun({
                    text: `Asil Üye`,
                    bold: true,
                    size: 28
                }),
            ]
        }),

        ...targetFullMembersDocx,

        new Paragraph({ text: "" }),

        new Paragraph({
            children: [
                new TextRun({
                    text: `Yedek Üye`,
                    bold: true,
                    size: 28
                }),
            ]
        }),


        ...targetSpareMembersDocx,

        new Paragraph({ text: "" }),


        new Table({
            width: {
                size: 100,
                type: WidthType.PERCENTAGE,
            },
            alignment: "center",
            rows: [
                // --- ROW 1: HEADERS ---
                new TableRow({
                    children: [
                        new TableCell({
                            width: {
                                size: 30,
                                type: WidthType.PERCENTAGE,
                            },
                            children: [
                                new Paragraph({
                                    alignment: "center",
                                    children: [
                                        new TextRun({
                                            text: "Adı ve Soyadı",
                                            bold: true,
                                            size: 18,
                                        }),
                                    ],
                                }),
                            ],
                        }),
                        new TableCell({
                            width: {
                                size: 25,
                                type: WidthType.PERCENTAGE,
                            },
                            children: [
                                new Paragraph({
                                    alignment: "center",
                                    children: [
                                        new TextRun({
                                            text: "Sınav Tarihi",
                                            bold: true,
                                            size: 18,
                                        }),
                                    ],
                                }),
                            ],
                        }),
                        new TableCell({
                            width: {
                                size: 15,
                                type: WidthType.PERCENTAGE,
                            },
                            children: [
                                new Paragraph({
                                    alignment: "center",
                                    children: [
                                        new TextRun({
                                            text: "Saat",
                                            bold: true,
                                            size: 18,
                                        }),
                                    ],
                                }),
                            ],
                        }),
                        new TableCell({
                            width: {
                                size: 30,
                                type: WidthType.PERCENTAGE,
                            },
                            children: [
                                new Paragraph({
                                    alignment: "center",
                                    children: [
                                        new TextRun({
                                            text: "Yeri",
                                            bold: true,
                                            size: 18,
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
                            width: {
                                size: 30,
                                type: WidthType.PERCENTAGE,
                            },
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: student.fullName,
                                            bold: true,
                                            size: 15,
                                        }),
                                    ],
                                }),
                            ],
                        }),
                        new TableCell({
                            width: {
                                size: 25,
                                type: WidthType.PERCENTAGE,
                            },
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: exam.date,
                                            bold: true,
                                            size: 15,
                                        }),
                                    ],
                                }),
                            ],
                        }),
                        new TableCell({
                            width: {
                                size: 15,
                                type: WidthType.PERCENTAGE,
                            },
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: exam.clock,
                                            bold: true,
                                            size: 15,
                                        }),
                                    ],
                                }),
                            ],
                        }),
                        new TableCell({
                            width: {
                                size: 30,
                                type: WidthType.PERCENTAGE,
                            },
                            children: [
                                new Paragraph({

                                    children: [
                                        new ExternalHyperlink({
                                            children: [
                                                new TextRun({
                                                    text: exam.examPlace,
                                                    style: "Hyperlink",
                                                }),
                                            ],
                                            link: exam.link,
                                        }),
                                    ],
                                    wordWrap: true,

                                }),
                            ],
                        }),

                    ],
                }),
            ],
        }),


    ]
}