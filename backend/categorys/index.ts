import { YL09CategoryKey, YL09Schema, getYL09DocxOutput } from "./YL09";
import { DR16CategoryKey, DR16Schema, getDR16DocxOutput } from "./DR16";
import { DR08CategoryKey, DR08Schema, getDR08DocxOutput } from "./DR08";
import z from "zod";

export const Categorys = {
    [YL09CategoryKey]: {
        output: YL09Schema,
        docx: getYL09DocxOutput
    },
    [DR16CategoryKey]: {
        output: DR16Schema,
        docx: getDR16DocxOutput
    },
    [DR08CategoryKey]: {
        output: DR08Schema,
        docx: getDR08DocxOutput
    },





    "UNKNOWN DOCUMENT TYPE": {
        output: z.object({
            message: z.string().describe("the reason why this document unknown")
        }),
        docx: () => { }
    }
}


export type CategoryName = keyof typeof Categorys;
