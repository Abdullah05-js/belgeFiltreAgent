import z from 'zod';
import { UniversitiesInKocaeli } from './shared';
import { Paragraph } from 'docx';

export const DR08CategoryKey = "YETERLIK SINAVI JÜRI BELIRLEME FORMU (DOKTORA)"

export const DR08Schema = z.object({
    student: z.object({
        fullName: z.string().describe("öğrenci Adı ve Soyadı."),
        no: z.string().describe("öğrenci No."),
        department: z.string().describe("öğrenci Anabilim Dalı.")
    }).describe("öğrenci bilgileri."),
    documentDetails: z.object({
        date: z.string().describe("evrak tarihi."),
        number: z.string().describe("evrak sayısı.")
    }).describe("Evrak Tarih ve Sayısı."),
    fullMembers: z.array(z.object({
        fullName: z.string().describe("Hocanın Ünvenı Adı Soyadı  örnek:Prof. Dr. Mehmet SARIBIYIK."),
    })).describe(`${UniversitiesInKocaeli.join("/")} kapsamı dışında bulunan üniversitelerin asil üyeleri.`),
    spareMembers: z.array(z.object({
        fullName: z.string().describe("Hocanın Ünvenı Adı Soyadı  örnek:Prof. Dr. Mehmet SARIBIYIK."),
    })).describe(`${UniversitiesInKocaeli.join("/")} kapsamı dışında bulunan üniversitelerin yedek Üyeleri.`),
    isAccept: z.boolean().describe("ANABILIM DALI BAŞKANI ONAYI")
})

export type IDR08Schema = z.infer<typeof DR08Schema>

export const getDR08DocxOutput = (data: IDR08Schema) => {

    return new Paragraph({

    })
}