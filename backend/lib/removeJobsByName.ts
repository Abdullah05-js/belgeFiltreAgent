import type { JobState, JobType, Queue } from "bullmq";
import type { IJob } from "../config/bullmq/QueueBullMQ";

export default async function removeJobsByName(queue: Queue<IJob, any, string, IJob, any, string>, jobName: string) {

    const states: JobType[] = ['wait', 'delayed', 'paused', 'completed', 'failed'];
    const jobs = await queue.getJobs(states);

    const jobsToRemove = jobs.filter(job => job.name === jobName);

    for (const job of jobsToRemove) {
        await job.remove();
    }
}