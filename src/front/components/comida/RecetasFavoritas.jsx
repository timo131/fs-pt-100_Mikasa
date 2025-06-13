import useGlobalReducer from "../../hooks/useGlobalReducer"
import userServices from "../../services/userServices"


export const RecetasFavoritas = () => {

    const { store, dispatch } = useGlobalReducer()

    return (
        <>
            <h3 className="text-center">Recetas Favoritas</h3>
        </>
    )
}