import type { CategoryName } from "../../flow/category";
import type { IDocuments } from "../../models/Documents";

export interface IDocumentRepository {
  findAll(limit: number): Promise<IDocuments[]>;
  create(docType: string,
    categoryName: CategoryName,
    data: IDocuments): Promise<IDocuments>;
  getPagination(page: number, limit: number, order: boolean): Promise<IDocuments[]>
}
