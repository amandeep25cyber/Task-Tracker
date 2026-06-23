import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    organisation:null,
    users:null,
    dashboardStats:null,
    teamPerformance:[]
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
            state.users = action.payload;
        },
        storeDashboardStats:(state,action)=>{
            state.action = action.payload;
        },
        deleteDashboardStats:(state,action)=>{
            state.action = null;
        },
        setTeamPerformance:(state,action)=>{
            state.action = action.payload;
        },
        deleteTeamPerformance:(state,action)=>{
            state.action = [];
        }

    }
})

export const { storeOrganisation, deleteOrganisation, storeUsers } = orgSlice.actions;
export default orgSlice.reducer;