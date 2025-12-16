import z from 'zod';
import { UniversitiesInKocaeli } from './shared';
import { Paragraph, TextRun } from 'docx';

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
        university: z.string().describe("Hocanın Üniversitesi")
    })).describe(`${UniversitiesInKocaeli.join("/")} kapsamı dışında bulunan üniversitelerin asil üyeleri.`),
    spareMembers: z.array(z.object({
        fullName: z.string().describe("Hocanın Ünvenı Adı Soyadı  örnek:Prof. Dr. Mehmet SARIBIYIK."),
        university: z.string().describe("Hocanın Üniversitesi")
    })).describe(`${UniversitiesInKocaeli.join("/")} kapsamı dışında bulunan üniversitelerin yedek Üyeleri.`),
    isAccept: z.boolean().describe("ANABILIM DALI BAŞKANI ONAYI")
})

export type IDR08Schema = z.infer<typeof DR08Schema>

export const getDR08DocxOutput = (data: IDR08Schema, index: number) => {
    const { student, documentDetails, fullMembers, spareMembers, isAccept } = data
    let membersText = ""
    fullMembers.forEach((a, index) => {
        if (index !== fullMembers.length - 1)
            membersText += `${a.university}’nden asil üye ${a.fullName},`
        else
            membersText += `${a.university}’nden asil üye ${a.fullName} ve`
    })

    spareMembers.forEach((a, index) => {
        if (index !== fullMembers.length - 1)
            membersText += `${a.university}’nden yedek üye ${a.fullName},`
        else
            membersText += `${a.university}’nden yedek üye ${a.fullName} görevlendirilmesine,`
    })

    return [
        new Paragraph({
            children: [
                new TextRun({
                    text: `${index}) ${student.fullName} Anabilim Dalının ${documentDetails.date} tarihli ve ${documentDetails.number} sayılı yazısı görüşüldü. ${student.no} nolu doktora öğrencisi ${student.fullName}’un, doktora yeterlik sınavı için ${membersText} yolluk ve yevmiyelerini 6245 sayılı Harcırah Kanunu’na ve 2547 sayılı Yükseköğretim Kanunu’nun 39.maddesine istinaden Enstitümüzün \t 38.39.400.09.4.2.00.2.03.03.01.01. \t nolu harcama kaleminden ödenmesine \t ${isAccept} \t İle karar verildi.`,
                    bold: true,
                    size: 24
                }),
            ]
        }),
    ]
}