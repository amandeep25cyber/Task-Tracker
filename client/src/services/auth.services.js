import axios from "axios"

const userLogin = async(data)=>{
    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await axios.post(`${apiUrl}/auth/login`,data,{
            withCredentials:true
        })

        console.log(res.data);

        if(res.data.success){
            
        }
    } catch (error) {
        console.log(error)
    }
}

export {
    userLogin,
}