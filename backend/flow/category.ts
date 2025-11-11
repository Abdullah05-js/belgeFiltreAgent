import { z } from "genkit";


const studentSchema = z.object({
    no: z.number().describe("öğrenci no."),
    fullName: z.string().describe("öğrenci Adı, Soyadı."),
    majoring: z.string().describe("öğrenci Anabilim Dalı."),
}).describe("öğrenci bilgileri.");

export const Categorys = {
    "Yüksek Lisans TEZ/PROJE SAVUNMASI JÜRİ ORTAK RAPORU": {
        output: z.object({
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
        }),
        docx: {

        }
    },
    "Doktora TEZ SAVUNMASI JÜRİ ORTAK RAPORU": {
        output: z.object({
            student: studentSchema,
            isAccept: z.boolean().describe("kabul durumu")
        }),
        docx: {

        }
    },

    "Yüksek Lisans TEZ/PROJE KONUSU BİLDİRİMİ VE KONU DEĞİŞİKLİĞİ FORMU": {
        output: z.object({
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

        }),
        docx: {

        }
    },

}

export type CategoryKey = keyof typeof Categorys;
