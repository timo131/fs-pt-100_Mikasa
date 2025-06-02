import { useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer"
import userServices from "../services/userServices"


export const Private = () => {

    const { store, dispatch } = useGlobalReducer()

    const handleLogout = () => {
        dispatch({ type: 'logout' })
    }

    return (
        <>
            <h2>This is private</h2>
            <h3>only for: {store.user?.email}</h3>

            <button onClick={handleLogout}>logout</button>
        </>
    )
}