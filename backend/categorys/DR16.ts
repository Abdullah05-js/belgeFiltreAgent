import z from 'zod';
import { Paragraph } from 'docx';

export const CategoryKey = "TEZ SAVUNMA JÜRI ÖNERI FORMU (DOKTORA)"

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
    thesis: z.object({
        title: z.string().describe("Tez Adı."),
    }),
    exam: z.object({
        date: z.string().describe("Sınav tarihi."),
        clock: z.string().describe("Sınav saati."),
        link: z.string().describe("Uzaktan erişim bağlantı adresi.")
    }),
    members: z.array(z.object({
        fullName: z.string().describe("Hocanın Ünvenı Adı Soyadı  örnek:Prof. Dr. Mehmet SARIBIYIK."),
        university: z.string().describe("Hocanın Üniversitesi.")
    })).describe(`kapsamı dışında bulunan üniversitelerin asil üyeleri.`),
})

export type DR08Schema = z.infer<typeof DR08Schema>

export const getDocxOutput = (data: DR08Schema) => {
    return new Paragraph({

    })
}