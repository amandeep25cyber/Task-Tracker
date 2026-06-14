import axios from "axios"

const userLogin = async(data)=>{
    
    const apiUrl = import.meta.env.VITE_API_URL;

    const res = await axios.post(
        `${apiUrl}/auth/login`,
        data,
        {
            withCredentials: true
        }
    );

    return res.data;
}

export {
    userLogin,
}