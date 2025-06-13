import useGlobalReducer from "../../hooks/useGlobalReducer"
import userServices from "../../services/userServices"


export const RecetaCard = () => {

    const { store, dispatch } = useGlobalReducer()

    return (
        <>
            <h3 className="text-center">Receta Card</h3>
        </>
    )
}