import { Categorys, type CategoryName } from "../categorys";
import type { BaseResponse } from "../types/types";
import { generateObject } from 'ai';
import z from 'zod';
import { PDFDocument } from 'pdf-lib'
import { createHuggingFace } from "@ai-sdk/huggingface";
import { createMistral } from "@ai-sdk/mistral";

// const model = google('gemini-2.5-flash')
const temperature = 0
const openai = createMistral({
    apiKey: "yMdLb3wAD2fu959Ik4CHY2s92uKbxicg"
})
const model = openai("mistral-large-latest")

interface IInput {
    fileURL: string;
}



export const FilterDocumentFlow = async (input: IInput): Promise<{
    category: CategoryName,
    data: any
}> => {
    try {

        const file = await fetch(input.fileURL);
        let arrayBuffer: ArrayBuffer | null = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer)
        const newPdfDoc = await PDFDocument.create();
        const [firstPage] = await newPdfDoc.copyPages(pdf, [0]); // 0 is the first page
        newPdfDoc.addPage(firstPage);
        const pdfBytes = await newPdfDoc.save();

        console.log("the file size: ", arrayBuffer.byteLength / 1024 / 1024); // MB

        const categoryList = Object.keys(Categorys) as CategoryName[]

        const result = await generateObject({
            model,
            temperature,
            system: "You are an academic document classifier. Select the correct report category from the given list.",
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'file',
                            data: new URL(input.fileURL),
                            mediaType: 'application/pdf',
                        },
                    ],
                },
            ],
            schema: z.object({
                category: z.enum(categoryList as [CategoryName, ...CategoryName[]]).describe("category of document"),
            }),
            output: "object"
        });

        if (!result?.object?.category) {
            throw new Error("undefined category")
        }
        console.log("------\n out from", 1);

        const categoryKey = result.object.category as CategoryName;
        const selectedCategory = Categorys[categoryKey];

        const response = await generateObject({
            model,
            temperature,
            system: "extract the data according to the schema",
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'file',
                            data: new URL(input.fileURL),
                            mediaType: 'application/pdf',
                        },
                    ],
                },
            ],
            schema: selectedCategory.output,
            output: "object"
        });
        console.log("------\n out from", 2);

        if (!response.object) {
            throw new Error("Failed to parse document data");
        }

        return {
            category: categoryKey,
            data: response.object
        };

    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Validation Error:", error.message);


            throw {
                data: "",
                success: false,
                message: error.message
            } as BaseResponse;
        }

        throw {
            data: "",
            success: false,
            message: (error as Error).message
        } as BaseResponse;
    }
};


