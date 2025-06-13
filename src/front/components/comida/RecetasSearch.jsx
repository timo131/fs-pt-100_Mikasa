import useGlobalReducer from "../../hooks/useGlobalReducer"

export const RecetasSearch = () => {

    const { store, dispatch } = useGlobalReducer()

    return (
        <>
            <h3 className="text-center">Recetas Search</h3>
        </>
    )
}