import axios from "axios"
import { loginSuccess, logout } from "../store/features/authSlice";

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

const getCurrentUser = async(dispatch)=>{
    try {
        const apiUrl = import.meta.env.VITE_API_URL;

        const res = await axios.get(`${apiUrl}/auth/me`,{
            withCredentials:true
        })

        dispatch(loginSuccess(res.data.data));

    } catch (error) {
        dispatch(logout());
    }
}

const userRegister = async(data)=>{
    const apiUrl = import.meta.env.VITE_API_URL;

    const res = await axios.post(
        `${apiUrl}/auth/register`,
        data,
        {
            withCredentials: true
        }
    );

    return res.data;
}

export {
    userLogin,
    getCurrentUser,
    userRegister,
}