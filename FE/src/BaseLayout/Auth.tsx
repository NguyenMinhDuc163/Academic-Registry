import { useSelector } from "react-redux"
import { RootState } from "../app/store"
import { Navigate, Outlet } from "react-router-dom"

const Auth = ()=>{
    const isLogin = useSelector((state:RootState)=>state.user.user)


    return <>
    {isLogin? <Outlet/>:<Navigate to='/home' replace={true}/>}
    </>

}

export default Auth