import axios from "axios"
import { BASE_API_URL } from "@/global"

const apiClient = axios.create({
    baseURL: BASE_API_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
})

// Interceptor untuk menambahkan token
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Interceptor untuk handling error
apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Handle unauthorized
            window.location.href = "/login"
        }
        return Promise.reject(error)
    }
)

export default apiClient