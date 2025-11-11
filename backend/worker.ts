import { FilterDocumentFlow } from "./flow/FilterDocumentFlow";
import type { BaseInput, BaseResponse } from "./types/types";
declare var self: Worker;





self.onmessage = async (event: MessageEvent<BaseInput>) => {
    try {

        const resosne = await FilterDocumentFlow({
            fileURL: event.data.fileURL
        })

        postMessage({
            data: resosne,
            error: null,
            success: true,
        } as BaseResponse)

    } catch (error) {
        postMessage(error as BaseResponse)
    }
};


