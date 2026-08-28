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

const getUpcomingDeadlines = async() =>{
    
    const res = await axios.get(`${API_URL}/manager/upcoming-deadlines`,{
        withCredentials: true
    })

    return res?.data;
}

const getManagerProjects = async()=>{

    const res = await axios.get(`${API_URL}/manager/projects`,{
        withCredentials:true
    })

    return res?.data;
}

const getAllUsersOfOrg = async()=>{

    const res = await axios.get(`${API_URL}/manager/users`,{
        withCredentials:true
    })

    return res?.data;
}

export {
    getDashboardStats,
    getActiveProjects,
    getUpcomingDeadlines,
    getManagerProjects,
    getAllUsersOfOrg,
}