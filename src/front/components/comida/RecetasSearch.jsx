import useGlobalReducer from "../../hooks/useGlobalReducer"
import userServices from "../../services/userServices"


export const RecetasSearch = () => {

    const { store, dispatch } = useGlobalReducer()

    return (
        <>
            <h3 className="text-center">Recetas Search</h3>
        </>
    )
}