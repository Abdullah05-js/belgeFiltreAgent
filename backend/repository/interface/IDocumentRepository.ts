import type { IDocumentRecord, SuccessDocument } from "../../models/Documents";
import type { JobStatus } from "../../route/schema/documentSchema";

export interface IDocumentRepository {
  create(totalCount: number, name: string): Promise<IDocumentRecord>;
  getPagination(page: number, limit: number, order: boolean): Promise<IDocumentRecord[]>
  getByID(id: string): Promise<IDocumentRecord>
  editDocumentErr(id: string, url: string): Promise<IDocumentRecord>
  editDocumentSuccess(id: string, doc: SuccessDocument): Promise<IDocumentRecord>
  editDocuementOutput(id: string, key: string): Promise<IDocumentRecord>
  deleteDocumentByID(id: string): Promise<void>
  getJobs(): Promise<IDocumentRecord[]>
  editDocumentStatus(id: string, status: JobStatus): Promise<IDocumentRecord>
}
