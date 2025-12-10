import type { Job } from "bullmq";
import type { IJob } from "./QueueBullMQ";

export default async function (job: Job<IJob>) {
    try {

        console.log("working on ", job.name, job.data.fileURL);

        await new Promise(resolve => {
            setTimeout(() => {
                resolve("3 saniye bitti");
            }, 3000);
        });


    } catch (error) {
        throw error as Error
    }
}

