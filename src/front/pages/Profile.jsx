import { HogarDetails } from '../components/hogardetails';
import { UserDetails } from '../components/userdetails';
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
    const navigate = useNavigate();
    const { dispatch } = useGlobalReducer();
    const handleLogout = () => {
        localStorage.removeItem("token");
        dispatch({ type: "logout" });
        navigate("/");
    }

    return (
        <>
        <div className='row'>
            <div className='col gap-4'>
                <HogarDetails/>
            </div>
            <div className='col gap-4'>
                <UserDetails/>
            </div>
        </div>
        <div className='d-flex justify-content-center align-items-center mb-5'>
            <button onClick={handleLogout} className="user-button-danger w-25">Cerrar sesión</button>
        </div>
        </>
    )
}