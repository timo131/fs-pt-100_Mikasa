import useGlobalReducer from "../../hooks/useGlobalReducer"
import { RecetaCard } from "./RecetaCard"


export const RecetasPendientes = () => {

    const { store, dispatch } = useGlobalReducer()
    const deseado = store.user?.deseado_recetas || {};
    const ids = Object.keys(deseado).filter((id) => deseado[id] > 0);

    return (
        <>
            <h3 className="text-center ivory text-outline">Las que quiero comer</h3>
            {ids.length > 0 && (
                <div className="search-results mt-4">
                    <div className="row g-3 justify-content-center">
                        {ids.map((id) => (
                            <div
                                key={id}
                                className="col-12 col-sm-6 col-md-4 col-lg-3"
                            >
                                <RecetaCard id={id} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}