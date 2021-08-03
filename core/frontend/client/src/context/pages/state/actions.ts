import {action, withoutPayload, withPayload} from "../../../infrastructure/utilities/redux";

export const addPageRequest = action('ADD_PAGE_REQUEST', withoutPayload);

export const addPage = action('ADD_PAGE', withPayload<number[]>());
