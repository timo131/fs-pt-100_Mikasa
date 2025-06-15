import useGlobalReducer from '../hooks/useGlobalReducer';
import { TareasHogar } from '../components/hogar/TareasHogar';
import { FinanzasHogar } from '../components/hogar/FinanzasHogar';
import { OcioHogar } from '../components/hogar/OcioHogar';
import { ComidaHogar } from '../components/hogar/ComidaHogar';

export const HogarPage = () => {
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
                <div className="row mb-4">
                    <div className="col-12">
                        <h2 className="text-center">{store.hogar.hogar_name}</h2>
                    </div>
                </div>

                <div className="row g-3 mb-3">
                    <div className="col-12 col-lg-6">
                        <div className="border bg-coral rounded p-3">
                            <TareasHogar />
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="border bg-ochre rounded p-3">
                            <FinanzasHogar />
                        </div>
                    </div>
                </div>
                <div className="row g-3">
                    <div className="col-12 col-lg-6">
                        <div className="border bg-aqua rounded p-3">
                            <OcioHogar />
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="border bg-sage rounded p-3">
                            <ComidaHogar />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}