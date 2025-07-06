import axios from "axios";


const axiosInstance = axios.create({
    baseURL: `https://pro-fast-server-nu.vercel.app`
})

const useAxios = () => {
    return axiosInstance
};

export default useAxios;