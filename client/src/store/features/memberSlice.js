import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    dashboardStats:null
}

const memberSlice = createSlice({
    name:"member",
    initialState,
    reducers:{
        storeDashboardStats:(state,action)=>{
            state.dashboardStats = action.payload;
        }
    }
})

export const { storeDashboardStats } = memberSlice.actions;
export default memberSlice.reducer;