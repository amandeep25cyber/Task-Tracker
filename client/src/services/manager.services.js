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

const updateSingleProject = async (id, data) =>{

    const res = await axios.put(`${API_URL}/manager/project/${id}`,data,{
        withCredentials: true
    })

    return res?.data;
}

const createNewProjectByManager = async (data) =>{

    const res = await axios.post(`${API_URL}/manager/project`,data,{
        withCredentials: true
    })

    return res?.data;
}

const deleteExistedProject = async (id) =>{

    const res = await axios.delete(`${API_URL}/manager/project/${id}`,{
        withCredentials: true
    })

    return res?.data;
}

const getProjectDataById = async(id)=>{

    const res = await axios.get(`${API_URL}/manager/project/${id}`,{
        withCredentials: true
    })

    return res?.data;
}

const updateTaskStatus = async(status,taskId) =>{

    const res = await axios.put(`${API_URL}/manager/task/${taskId}`,{status},{
        withCredentials: true
    })

    return res?.data;
}

export {
    getDashboardStats,
    getActiveProjects,
    getUpcomingDeadlines,
    getManagerProjects,
    getAllUsersOfOrg,
    updateSingleProject,
    createNewProjectByManager,
    deleteExistedProject,
    getProjectDataById,
    updateTaskStatus,
}