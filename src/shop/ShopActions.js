import * as types from "../types";

export const buyItem = (item) => ({
    type: types.BUY_ITEM,
    payload: { itemId: item.id, price: item.price }
});
