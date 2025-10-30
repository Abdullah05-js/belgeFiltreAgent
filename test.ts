import { googleAI } from '@genkit-ai/google-genai';
import { genkit } from 'genkit';
import mammoth from 'mammoth';
import { z } from "genkit"
import { systemPrompt } from './prompts';

export const TezJuriOneriSchema = z.object({
    title: z.string().min(1),
    content: z.string().min(1)
});

export type TezJuriOneriInput = z.infer<typeof TezJuriOneriSchema>;


const docxTemplats = {

    "TEZ_JURI_ONERI": (data: TezJuriOneriInput) => {
        console.log(data.title);
    }

}


const ai = genkit({
    plugins: [googleAI({
        apiKey: process.env.GEMINI_API_KEY
    })],
    model: googleAI.model("gemini-2.5-flash", {
        temperature: 0,
    })
})


interface Iinput {
    fileURL: string
}

const FilterDocumentFlow = ai.defineFlow({
    name: "FilterDocumentFlow",
    inputSchema: z.object({
        fileURL: z.string().describe("the link of the file from object storage database"),
    }),
}, async ({ fileURL }: Iinput) => {
    try {

        const file = await fetch(fileURL)
        console.log("fetched the ", file.url, "\n");

        const arrayBuffer = await file.arrayBuffer()

        const result = await mammoth.extractRawText({
            buffer: Buffer.from(arrayBuffer)
        })

        console.log(result.value, "\n-----------------------------------------------------------\n");

        const JuryMemberSchema = z.object({
            unvan: z.string().describe("Akademik unvan (Prof. Dr., Doç. Dr., Dr. Öğr. Üyesi vb.)"),
            adiSoyadi: z.string().describe("Jüri üyesinin adı ve soyadı"),
            anabilimDali: z.string().describe("Anabilim dalı"),
            eposta: z.string().email().describe("E-posta adresi")
        });

        const TargetSchema = z.object({
            ogrenciBilgileri: z.object({
                adi: z.string().describe("Öğrencinin adı"),
                soyadi: z.string().describe("Öğrencinin soyadı"),
                no: z.string().describe("Öğrenci numarası"),
                anabilimDali: z.string().describe("Öğrencinin anabilim dalı")
            }).describe("Öğrenci bilgileri bölümü"),

            kurumIciUyeler: z.array(JuryMemberSchema)
                .describe("Kurum içi üyeler - önerilen tez jürileri"),

            kurumDisiUyeler: z.array(JuryMemberSchema)
                .describe("Kurum dışı üyeler - önerilen tez jürileri")
        });

        const response = await ai.generate({
            system: systemPrompt,
            output: { schema: TargetSchema },
            prompt: result.value
        })


        console.log(response.output);

    } catch (error) {
        console.error((error as Error).message);
    }
});


FilterDocumentFlow({
    fileURL: "https://04be21e3f71094a3ae97abb5cd8fb86c.r2.cloudflarestorage.com/stream/122.docx?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=90b1f6abc39ed672454fa1e0e6d470e4%2F20251030%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20251030T183758Z&X-Amz-Expires=3600&X-Amz-Signature=5add39752429fafc4e6d3c2812b8c604fe6d8e4820835868a4481f1abbdaebec&X-Amz-SignedHeaders=host"
})