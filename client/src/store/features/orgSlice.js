import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    organisation = null,
}

const orgSlice = createSlice({
    name:"organisation",
    initialState,
    reducers:{
        storeOrganisation:(state,action)=>{
            state.organisation = action.payload;
        }
    }
})