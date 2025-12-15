import z from 'zod';
import { Document, Paragraph, TextRun, AlignmentType, HeadingLevel, type ISectionOptions } from "docx";

const studentSchema = z.object({
    no: z.number().describe("öğrenci no."),
    fullName: z.string().describe("öğrenci Adı, Soyadı."),
    majoring: z.string().describe("öğrenci Anabilim Dalı."),
}).describe("öğrenci bilgileri.");

// 2. Extended Student Schema (for Konu Bildirimi)
const extendedStudentSchema = studentSchema.extend({
    address: z.string().describe("öğrenci adres."),
    email: z.string().email().describe("öğrenci e-posta."),
    phone: z.string().describe("öğrenci telefon numarası.")
});

const ylSavunmaTez = z.object({
    docType: z.literal("TEZ").describe("Belge bir Tez Savunması ise bunu seç."),
    student: studentSchema,
    isAccept: z.boolean().describe("kabul durumu"),
    data: z.object({
        name: z.string().describe("tez isimi."),
        nameEng: z.string().describe("inglizce tez isimi."),
        advisor: z.string().describe("Danışman Unvanı, Adı, Soyadı."),
        isNameChange: z.boolean().describe("tez isimi değişikliği var mı?"),
        ChangedName: z.string().nullish().describe("yeni tez isimi (değişiklik varsa)."),
        ChangedNameEng: z.string().nullish().describe("yeni inglizce tez isimi (değişiklik varsa)."),
    })
});

const ylSavunmaProje = z.object({
    docType: z.literal("PROJE").describe("Belge bir Proje Savunması ise bunu seç."),
    student: studentSchema,
    isAccept: z.boolean().describe("kabul durumu"),
    data: z.object({
        name: z.string().describe("proje isimi."),
        nameEng: z.string().describe("inglizce proje isimi."),
        isNameChange: z.boolean().describe("proje isimi değişikliği var mı?"),
    })
});

const yuksekLisansSavunmaOutput = z.discriminatedUnion("docType", [
    ylSavunmaTez,
    ylSavunmaProje
]);

const doktoraSavunmaOutput = z.object({
    docType: z.literal("DOKTORA").describe("Doktora savunması olduğunu belirtir"),
    student: studentSchema,
    tez: z.object({
        name: z.string().describe("tez başlığı."),
        nameEng: z.string().describe("inglizce tez başlığı."),
        advisor: z.string().describe("Danışman Unvanı, Adı, Soyadı."),
    }),
    isAccept: z.boolean().describe("kabul durumu"),
});

const konuBildirimiTez = z.object({
    docType: z.literal("TEZ").describe("Belge 'Tez Konusu' içeriyorsa bunu seç."),
    student: extendedStudentSchema,
    data: z.object({
        name: z.string().describe("tez başlığı."),
        nameEng: z.string().describe("inglizce tez başlığı."),
        lang: z.enum(["TÜRKÇE", "İNGİLİZCE"]).describe("tez dili"),
        summery: z.string().describe("tez özeti")
    })
});

const konuBildirimiProje = z.object({
    docType: z.literal("PROJE").describe("Belge 'Proje Konusu' içeriyorsa bunu seç."),
    student: extendedStudentSchema,
    data: z.object({
        name: z.string().describe("proje başlığı."),
        nameEng: z.string().describe("inglizce proje başlığı."),
        lang: z.enum(["TÜRKÇE", "İNGİLİZCE"]).describe("proje dili"),
        summery: z.string().describe("proje özeti")
    })
});

const yuksekLisansKonuBildirimiOutput = z.discriminatedUnion("docType", [
    konuBildirimiTez,
    konuBildirimiProje
]);

export const Categorys = {
    "Yüksek Lisans TEZ/PROJE SAVUNMASI JÜRİ ORTAK RAPORU": {
        output: yuksekLisansSavunmaOutput,
        docx: () => {
        }
    },

    "Doktora TEZ SAVUNMASI JÜRİ ORTAK RAPORU": {
        output: doktoraSavunmaOutput,
        docx: () => {

        }
    },

    "Yüksek Lisans TEZ/PROJE KONUSU BİLDİRİMİ VE KONU DEĞİŞİKLİĞİ FORMU": {
        output: yuksekLisansKonuBildirimiOutput,
        docx: () => {

        }
    },

    "UNKNOWN DOCUMENT TYPE": {
        output: z.object({
            message: z.string().describe("the reason why this document unknown")
        })
    }
};

export {
    yuksekLisansSavunmaOutput,
    doktoraSavunmaOutput,
    yuksekLisansKonuBildirimiOutput
};


export function validateDocument(input: unknown) {
    const validators = [
        yuksekLisansSavunmaOutput,
        doktoraSavunmaOutput,
        yuksekLisansKonuBildirimiOutput,
    ];

    for (const schema of validators) {
        const result = schema.safeParse(input);
        if (result.success) return result.data;
    }

    throw new Error("Invalid document format");
}


export type CategoryName = keyof typeof Categorys;

