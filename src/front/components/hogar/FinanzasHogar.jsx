import useGlobalReducer from "../../hooks/useGlobalReducer"
import userServices from "../../services/userServices"


export const FinanzasHogar = () => {

    const { store, dispatch } = useGlobalReducer()

    return (
        <>
            <h3 className="text-center ivory text-outline">Finanzas</h3>
        </>
    )
}