import axios from "axios"

const apiUrl = import.meta.env.VITE_API_URL;

const getUsers = async()=>{

    const res = await axios.get(`${apiUrl}/organisation/users`,{
        withCredentials:true
    });

    return res?.data;
}

const getTeamPerformance = async()=>{
    const res = await axios.get(`${apiUrl}/organisation/dashboard/team-performance`,{
        withCredentials:true
    })

    return res?.data;
}

const getdashboardStats = async()=>{
    const res = await axios.get(`${apiUrl}/organisation/dashboard/stats`,{
        withCredentials:true
    })

    return res?.data;
}

const getProjectsStats = async()=>{
    const res = await axios.get(`${apiUrl}/organisation/projects/stats`,{
        withCredentials:true
    })

    return res?.data;
}

const createUser = async(data)=>{
    const res = await axios.post(`${apiUrl}/organisation/user`,data,{
        withCredentials:true
    })

    return res?.data;
}

const getProjects = async() =>{
    const res = await axios.get(`${apiUrl}/organisation/projects`,{
        withCredentials:true
    })

    return res?.data;
}

export {
    getUsers,
    getTeamPerformance,
    getdashboardStats,
    getProjectsStats,
    createUser,
    getProjects,
}