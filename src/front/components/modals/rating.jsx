import React from "react";

export const Rating = ({ id, onRate, show, onClose }) => {
  if (!show) return null;
  return (
    <>
    <div
      className="modal-backdrop fade show"
      style={{ zIndex: 1040 }}
    ></div>
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      onClick={onClose}
    >
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content bg-ivory border-charcoal">
          <div className="modal-header border-0">
            <h3 className="charcoal w-100 text-center fw-bold" id={`ratingModalLabel-${id}`}>
              ¿Qué te parece?
            </h3>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body text-center">
            {[-2, -1, 0, 1, 2].map((value) => (
              <span
                key={value}
                className="emoji-rating"
                onClick={() => onRate(Number(value))}
                data-bs-dismiss="modal"
                role="button"
                tabIndex="0"
              >
                {{
                  [-2]: "😵",
                  [-1]: "😒",
                  [0]: "😐",
                  [1]: "😊",
                  [2]: "🤩",
                }[value]}
              </span>
            ))}

          </div>
        </div>
      </div>
    </div>
    </>
  );
};
