import { FilterDocumentFlow } from "./flow/FilterDocumentFlow";
import type { BaseInput, BaseResponse } from "./types/types";
declare var self: Worker;


self.onmessage = async (event: MessageEvent<BaseInput>) => {
    try {

        const resosne = await FilterDocumentFlow({
            fileURL: event.data.fileURL
        })

        console.log("response: ", resosne);

        postMessage({
            data: resosne,
            message: "",
            success: true,
        } as BaseResponse)

    } catch (error) {
        postMessage(error as BaseResponse)
    }
};


