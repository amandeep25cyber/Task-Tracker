import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getDashboardStats = async()=>{
    const res = await axios.get(`${API_URL}/member/dashboard-stats`,{
        withCredentials:true
    })

    return res?.data;
}

const getTodaysTasks = async()=>{
    const res = await axios.get(`${API_URL}/member/todays-tasks`,{
        withCredentials:true
    })

    return res?.data;
}

export {
    getDashboardStats,
    getTodaysTasks,
}