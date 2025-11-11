import { googleAI } from "@genkit-ai/google-genai";
import { genkit, z } from "genkit";
import JSZip from "jszip";
import mammoth from "mammoth";
import { DOMParser } from "@xmldom/xmldom";
import { Categorys, type CategoryKey } from "./category";
import type { BaseResponse } from "../types/types";



const ai = genkit({
    plugins: [googleAI({
        apiKey: process.env.GEMINI_API_KEY
    })],
    model: googleAI.model("gemini-2.5-flash", {
        temperature: 0,
    }),
})


interface IInput {
    fileURL: string;
}


export const FilterDocumentFlow = ai.defineFlow({
    name: "FilterDocumentFlow",
    inputSchema: z.object({
        fileURL: z.string().describe("Object storage'dan dosya bağlantısı"),
    }),
}, async (input: IInput) => {
    try {

        const file = await fetch(input.fileURL);
        const arrayBuffer = await file.arrayBuffer();
        const zip = await JSZip.loadAsync(Buffer.from(arrayBuffer));
        const headerFiles = Object.keys(zip.files).filter(f => f.match(/word\/header\d*\.xml$/));
        const result = await mammoth.convertToHtml({ buffer: Buffer.from(arrayBuffer) });

        let formatedHeader = "";

        if (headerFiles.length > 0) {
            headerFiles.sort();
            const firstHeaderFile = headerFiles[0]!;
            const xmlText = await zip.file(firstHeaderFile)!.async("text");
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "text/xml");
            const text = xmlDoc.documentElement.textContent;
            formatedHeader = text.replace("(", " (").replace(")", ") ").replace(")", ")\n").replace(/:\s*/g, ": ").replace(/([0-9])([A-ZÇĞİÖŞÜ])/g, "$1\n$2")
        }

        console.log("Extracted Text Length:", formatedHeader);

        const categoryList = Object.keys(Categorys) as CategoryKey[]

        const resp = await ai.generate({
            system: "You are an academic document classifier. Select the correct report category from the given list.",
            prompt: formatedHeader,
            output: {
                schema: z.object({
                    category: z.enum(categoryList as [CategoryKey, ...CategoryKey[]]).describe("category of document"),
                }),
            },
        });


        if (!resp.output?.category) {
            throw new Error("undefined category")
        }

        const selectedCategory = (Categorys[resp.output.category]).output;

        const response = await ai.generate({
            prompt: `
         Document header:
        ${formatedHeader}

         Document body:
        ${result.value}
         `,
            output: { schema: selectedCategory },
        });

    

        return response.output

    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Validation Error:", error.errors);
        } else {
            console.error("Flow Error:", (error as Error).message);
        }
        throw {
            data: "",
            success: false,
            error: error
        } as BaseResponse;
    }
});


