import type { Job } from "bullmq";
import type { IJob } from "./QueueBullMQ";
import { FilterDocumentFlow } from "../../flow/FilterDocumentFlow";
import type { BaseResponse } from "../../types/types";
import { Categorys, type CategoryName } from "../../categorys";
import { Packer } from "docx";
import generateDocx from "../../lib/generateDocx";



export default async function (job: Job<IJob>) {
    try {

        console.log("working on ", job.name, job.data.fileURL);

        const { category, data } = await FilterDocumentFlow({
            fileURL: job.data.fileURL
        })

        const docxData = Categorys[category].docx(data, 1)!

        const doc = generateDocx(docxData)

        Packer.toBuffer(doc).then((buffer) => {
            Bun.write("AI_RESULT.docx", buffer);
        });

    } catch (error) {

        console.log((error as BaseResponse).message);
        throw error as BaseResponse
    }
}

