import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    organisation : null,
    users : null,
}

const orgSlice = createSlice({
    name:"organisation",
    initialState,
    reducers:{
        storeOrganisation:(state,action)=>{
            state.organisation = action.payload;
        },
        deleteOrganisation:(state,action)=>{
            state.organisation = null;
        },
        storeUsers:(state,action)=>{
            state.organisation = action.payload;
        }
    }
})

export const { storeOrganisation, deleteOrganisation, storeUsers } = orgSlice.actions;
export default orgSlice.reducer;