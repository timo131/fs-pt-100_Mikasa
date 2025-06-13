import useGlobalReducer from "../../hooks/useGlobalReducer"
import userServices from "../../services/userServices"


export const RecetasPendientes = () => {

    const { store, dispatch } = useGlobalReducer()

    return (
        <>
            <h3 className="text-center">Recetas Pendientes</h3>
        </>
    )
}