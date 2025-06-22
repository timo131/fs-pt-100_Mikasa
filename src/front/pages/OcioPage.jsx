import { OcioSearch } from "../components/ocio/OcioSearch";
import { OcioFavoritas } from "../components/ocio/OcioFavoritas";
import { OcioPendientes } from "../components/ocio/OcioPendientes";

export const OcioPage = () => {
  return (
    <div className="container my-4">
      <div className="row g-3 mb-3">
        <div className="col-12">
          <div className="border-charcoal bg-aqua rounded p-3 comida-container">
            <OcioSearch />
          </div>
        </div>
        <div className="col-12">
          <div className="border-charcoal bg-aqua rounded p-3 comida-container">
            <OcioPendientes />
          </div>
        </div>
      </div>
      <div className="row g-3">
        <div className="col-12">
          <div className="border-charcoal bg-aqua rounded p-3 comida-container">
            <OcioFavoritas />
          </div>
        </div>
      </div>
    </div>
  );
};
