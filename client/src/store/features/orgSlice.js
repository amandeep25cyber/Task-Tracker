import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    organisation:null,
    users:[],
    dashboardStats:null,
    teamPerformance:[],
    projectsStats:null
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
            state.dashboardStats = action.payload;
        },
        deleteDashboardStats:(state,action)=>{
            state.dashboardStats = null;
        },
        setTeamPerformance:(state,action)=>{
            state.teamPerformance = action.payload;
        },
        deleteTeamPerformance:(state,action)=>{
            state.teamPerformance = [];
        },
        storeProjectsStats:(state,action)=>{
            state.projectsStats = action.payload;
        }

    }
})

export const { storeOrganisation, deleteOrganisation, storeUsers, storeDashboardStats, deleteDashboardStats, setTeamPerformance,deleteTeamPerformance,storeProjectsStats } = orgSlice.actions;
export default orgSlice.reducer;