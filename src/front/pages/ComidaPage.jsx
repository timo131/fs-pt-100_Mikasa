import useGlobalReducer from '../hooks/useGlobalReducer';
import { RecetasFavoritas } from '../components/comida/RecetasFavoritas';
import { RecetasPendientes } from '../components/comida/RecetasPendientes';
import { RecetasSearch } from '../components/comida/RecetasSearch';

export const ComidaPage = () => {
    const { store, dispatch } = useGlobalReducer();

    if (!store.hogar) {
        return (
            <div className="container my-5 text-center">
                <p>Loading your hogar…</p>
            </div>
        );
    }

    return (
        <>
            <div className="container my-4">

                <div className="row g-3 mb-3">
                    <div className="col-12">
                        <div className="border-charcoal bg-sage rounded p-3 comida-container">
                            <RecetasSearch />
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="border-charcoal bg-sage rounded p-3 comida-container">
                            <RecetasPendientes />
                        </div>
                    </div>
                </div>
                <div className="row g-3">
                    <div className="col-12">
                        <div className="border-charcoal bg-sage rounded p-3 comida-container">
                            <RecetasFavoritas />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}