// import { googleAI } from '@genkit-ai/google-genai';
// import { genkit } from 'genkit';
// import mammoth from 'mammoth';
// import { z } from "genkit"
// import JSZip from "jszip";
// import { DOMParser } from "@xmldom/xmldom";

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

const documentURLs = ["https://cdn.thodex.live/235103012_Ali_Enes_Temizkan.docx", "https://cdn.thodex.live/20240703_3811c_yl---9-tez-savunmasi-juri-ortak-raporu_235116001_Saip%20Onurhan%20KADIO%C4%9ELU%20(1).docx", "https://cdn.thodex.live/20240930_165e5_tyl---11-proje-konusu-bildirim-formu-117.docx", "https://cdn.thodex.live/20240703_3811c_yl---9-tez-savunmasi-juri-ortak-raporu_235116001_Saip%20Onurhan%20KADIO%C4%9ELU.docx"]
for (const documenturl of documentURLs) {

    const worker = new Worker("./worker.ts")
    worker.postMessage({
        fileURL: documenturl
    })

    worker.onmessage = (event) => {
        console.log("-------------------------------------------------\n");
        console.log(event.data);
        console.log("-------------------------------------------------\n");
    }
}


