import type { Job } from "bullmq";
import type { IJob } from "./QueueBullMQ";
import { FilterDocumentFlow } from "../../flow/FilterDocumentFlow";
import type { BaseResponse } from "../../types/types";
import { repo } from "../bullmq/QueueBullMQ"
import { Categorys } from "../../categorys";
import generateDocx from "../../lib/generateDocx";
import { Packer } from "docx";
import { fastify } from "../../server.ts";


export default async function workertest(job: Job<IJob>) {
    try {

        console.log("working on ", job.name, job.data.fileURL);

        const { category, data } = await FilterDocumentFlow({
            fileURL: job.data.fileURL
        })

        const parsedData = Categorys[category].output.safeParse(data)

        if (!parsedData.success) throw {
            data: "",
            success: false,
            message: parsedData.error.message
        } as BaseResponse;
        console.log("-----\n am out boys", job.name);
        await repo.editDocumentSuccess(job.name, {
            categoryName: category,
            data: parsedData.data,
        })
        console.log("----\n last time ma here ");
        const jobRecord = await repo.getByID(job.name)

        if (jobRecord.success.length + jobRecord.error.length == jobRecord.totalCount) {
            const successRecords = jobRecord.success.sort((a, b) => a.categoryName.localeCompare(b.categoryName)).map((doc, index) => {
                return Categorys[doc.categoryName].docx(doc.data, index + 1)
            })
            await repo.editDocumentStatus(jobRecord._id.toString(), "completed")

            if (successRecords.length > 0) {
                const doc = generateDocx(successRecords)
                const buffer = (await Packer.toBuffer(doc)).buffer
                const key = `output/${Bun.randomUUIDv7()}.docx`
                await fastify.R2.write(key, buffer)
                await repo.editDocuementOutput(jobRecord._id.toString(), key)
            }
        }

        // const docxData = Categorys[category].docx(data, 1)!

        // const doc = generateDocx(docxData)

        // Packer.toBuffer(doc).then((buffer) => {
        //     Bun.write("AI_RESULT.docx", buffer);
        // });

    } catch (error) {
        console.log((error as BaseResponse).message);
        throw error as BaseResponse
    }
}

