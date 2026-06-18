import axios from "axios"

const getUsers = async()=>{

    const apiUrl = import.meta.env.VITE_API_URL;

    const res = await axios.get(`${apiUrl}/organisation/users`,{
        withCredentials:true
    });

    return res?.data;
}

export {
    getUsers,
}