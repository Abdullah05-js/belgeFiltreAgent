import z from 'zod';
import { Paragraph, TextRun } from 'docx';

export const YL09CategoryKey = "TEZ SAVUNMASI JÜRI ORTAK RAPORU (TEZLI YÜKSEK LISANS)"

const NoChangeSchema = z.object({
    tezBasligiDegisikligi: z.literal("hayir"),
});

const ChangeSchema = z.object({
    tezBasligiDegisikligi: z.literal("evet"),
    yeniTezBasligiTR: z.string().min(1, "Türkçe tez başlığı zorunludur").describe("DEĞIŞTIRILEN TEZ BAŞLIĞI"),
});

const acceptTypes = ["OY BİRLİĞİ", "OY ÇOKLUĞU"] as const

export const YL09Schema = z.object({
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
        change: z.discriminatedUnion("tezBasligiDegisikligi", [NoChangeSchema, ChangeSchema]),
        title: z.string().describe("TEZ BAŞLIĞI"),
    }),
    date: z.string().describe("JÜRİ ORTAK KARARI Savunma tarihi."),
    advisor: z.string().describe("Öğrenci Danışmanı Hocanın Ünvenı Adı Soyadı  örnek:Prof. Dr. Mehmet SARIBIYIK."),
    AcceptType: z.enum(acceptTypes).describe("JÜRİ ORTAK KARARI Oy."),
    acceptStatus: z.boolean().describe("JÜRİ ORTAK KARARI: kabul ise true DÜZELTME veya RET ise false")
})

export type IYL09Schema = z.infer<typeof YL09Schema>

export const getYL09DocxOutput = (data: IYL09Schema, index: number) => {
    const { student, documentDetails, date, thesis, advisor, AcceptType, acceptStatus } = data

    if (thesis.change.tezBasligiDegisikligi === "evet")
        return [
            new Paragraph({ text: "" }),

            new Paragraph({
                children: [
                    new TextRun({
                        text: `${index}) ${student.department} Anabilim Dalının ${documentDetails.date} tarihli ve ${documentDetails.number} sayılı yazısı ekinde Anabilim Dalı ${student.no} nolu yüksek lisans öğrencisi ${student.fullName}’nın, ${date} tarihli yüksek lisans sınav jürisinin oybirliği ile aldığı karar doğrultusunda yüksek lisans tez isminin aşağıdaki gibi değiştirilmesine oybirliği ile karar verildi.`,
                        bold: true,
                        size: 24
                    }),
                ]
            }),

            new Paragraph({ text: "" }),

            new Paragraph({
                children: [
                    new TextRun({
                        text: `Eski Tez İsmi: ${thesis.title}`,
                        bold: true,
                        size: 24
                    }),
                ]
            }),


            new Paragraph({ text: "" }),

            new Paragraph({
                children: [
                    new TextRun({
                        text: `Yeni Tez İsmi: ${thesis.change.yeniTezBasligiTR}`,
                        bold: true,
                        size: 24
                    }),
                ]
            }),


            new Paragraph({ text: "" }),

            new Paragraph({
                children: [
                    new TextRun({
                        text: `${index}.1) ${student.department} Anabilim Dalının ${documentDetails.date} tarihli ve ${documentDetails.number} sayılı yazısı ekindeki ${student.no} nolu yüksek lisans öğrencisi ${student.fullName}’ya ait ${date} tarihli jüri ortak raporu görüşüldü. ${advisor} danışmanlığında yürütülen “${thesis.title}” isimli yüksek lisans tez sınavında ilgili jüri ortak raporunda başarılı bulunan öğrencinin mezuniyetinin ${acceptStatus ? "onaylanmasına" : "onaylanmamasına"} ${AcceptType} ile karar verildi.`,
                        bold: true,
                        size: 24
                    }),
                ]
            })
        ]

    return [
        new Paragraph({ text: "" }),

        new Paragraph({
            children: [
                new TextRun({
                    text: `${index}) ${student.department} Anabilim Dalının ${documentDetails.date} tarihli ve ${documentDetails.number} sayılı yazısı ekindeki ${student.no} nolu yüksek lisans öğrencisi ${student.fullName}’ya ait ${date} tarihli jüri ortak raporu görüşüldü. ${advisor} danışmanlığında yürütülen “${thesis.title}” isimli yüksek lisans tez sınavında ilgili jüri ortak raporunda başarılı bulunan öğrencinin mezuniyetinin ${acceptStatus ? "onaylanmasına" : "onaylanmamasına"} ${AcceptType} ile karar verildi.`,
                    bold: true,
                    size: 24
                }),
            ]
        })
    ]
}