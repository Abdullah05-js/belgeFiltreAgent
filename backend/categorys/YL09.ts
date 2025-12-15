import z from 'zod';
import { Paragraph } from 'docx';

export const YL09CategoryKey = "TEZ SAVUNMASI JÜRI ORTAK RAPORU (TEZLI YÜKSEK LISANS)"

const NoChangeSchema = z.object({
    tezBasligiDegisikligi: z.literal("hayir"),
});

const ChangeSchema = z.object({
    tezBasligiDegisikligi: z.literal("evet"),
    yeniTezBasligiTR: z.string().min(1, "Türkçe tez başlığı zorunludur").describe("DEĞIŞTIRILEN TEZ BAŞLIĞI"),
});

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
    advisor: z.string().describe("Öğrenci Danışmanı"),
    isAccept: z.boolean().describe("JÜRI ORTAK KARARI ")
})

export type IYL09Schema = z.infer<typeof YL09Schema>

export const getYL09DocxOutput = (data: IYL09Schema) => {
    return new Paragraph({

    })
}