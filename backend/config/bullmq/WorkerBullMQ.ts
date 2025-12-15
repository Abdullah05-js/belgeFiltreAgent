import type { Job } from "bullmq";
import type { IJob } from "./QueueBullMQ";
import { FilterDocumentFlow } from "../../flow/FilterDocumentFlow";
import type { BaseResponse } from "../../types/types";
import { Categorys } from "../../flow/category";

export default async function (job: Job<IJob>) {
    try {

        console.log("working on ", job.name, job.data.fileURL);

        const { category, data } = await FilterDocumentFlow({
            fileURL: job.data.fileURL
        })

        switch (category) {
            case "UNKNOWN DOCUMENT TYPE":
                const parsed = Categorys[category].output.parse(data)

                //update the db using job._id

                break;

            default:
                break;
        }


    } catch (error) {
        console.log((error as BaseResponse).message);
        throw error as BaseResponse
    }
}

