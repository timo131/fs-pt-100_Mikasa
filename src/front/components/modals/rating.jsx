import React from "react";

export const Rating = ({ id, onRate }) => {
  return (
    <div
      className="modal fade"
      id={`ratingModal-${id}`}
      tabIndex="-1"
      aria-labelledby={`ratingModalLabel-${id}`}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={`ratingModalLabel-${id}`}>
              ¿Qué te parece esta receta?
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body text-center">
            {[-2, -1, 0, 1, 2].map((value) => (
              <button
                key={value}
                type="button"
                className="btn btn-outline-dark m-1"
                onClick={() => onRate(Number(value))}
                data-bs-dismiss="modal"
              >
                {{
                  [-2]: "¡Asco!",
                  [-1]: "No me apetece",
                  [0]: "Ni fu ni fa",
                  [1]: "Me mola",
                  [2]: "Me apetece mogollón",
                }[value]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
