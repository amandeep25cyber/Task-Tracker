import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getDashboardStats = async() =>{

    const response = await axios.get(`${API_URL}/manager/dashboard-stats`,{
        withCredentials: true
    })

    return response?.data;
}

const getActiveProjects = async() =>{
    
    const res = await axios.get(`${API_URL}/manager/active-projects`,{
        withCredentials: true
    })

    return res?.data;
}

export {
    getDashboardStats,
    getActiveProjects,
}