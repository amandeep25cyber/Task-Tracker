import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getDashboardStats = async() =>{

    const response = await axios.get(`${API_URL}/manager/dashboard-stats`,{
        withCredentials: true
    })

    return response?.data;
}

export {
    getDashboardStats,
}