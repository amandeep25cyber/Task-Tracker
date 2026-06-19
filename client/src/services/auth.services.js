import axios from "axios"
import { loginSuccess, logout } from "../store/features/authSlice";
import { deleteOrganisation, storeOrganisation } from "../store/features/orgSlice";

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

        dispatch(loginSuccess(res.data.data?.user));
        dispatch(storeOrganisation(res.data.data?.organisation));

    } catch (error) {
        dispatch(logout());
        dispatch(deleteOrganisation());
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

const userLogout = async()=>{

    const apiUrl = import.meta.env.VITE_API_URL;
    const res = await axios.get(`${apiUrl}/auth/logout`,{
        withCredentials:true
    })

    return res;
}

export {
    userLogin,
    getCurrentUser,
    userRegister,
    userLogout,
}