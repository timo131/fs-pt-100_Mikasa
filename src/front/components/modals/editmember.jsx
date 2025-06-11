import { useState, useEffect, useRef } from "react";
import userServices from "../../services/userServices";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import "../../styles/User.css";

export const EditMember = ({ show, memberId, onClose }) => {

    const { store, dispatch } = useGlobalReducer();

    const member = show
    ? store.hogar.user.find(u => u.id === memberId)
    : null;

    if (!show || !member) return null;

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
    if (show && member) {
      setIsAdmin(member.admin);
    }
  }, [show, member]);

  const handleMakeAdmin = async () => {
    await userServices.updateuser(member.id, { admin: true });
    dispatch({ type: "update_member", payload: { ...member, admin: true } });
    onClose();
  };

  const handleRemoveAdmin = async () => {
    await userServices.updateuser(member.id, { admin: false });
    dispatch({ type: "update_member", payload: { ...member, admin: false } });
    onClose();
  };

  const handleKickOut = async () => {
    await userServices.deleteUser(member.id);
    dispatch({ type: "remove_member", payload: member.id });
    onClose();
  };



    return (
        <>
            <div
                className={`modal fade ${show ? "show d-block" : ""}`}
                style={{ display: show ? "block" : "none" }}
            >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div
                        className="modal-content editprofile-container"
                        style={{ border: "2px solid ivory" }}
                    >
                        <div className="modal-header">
                            <h3 className="modal-title ivory">{member.user_name}</h3>
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn btn-link p-0 m-0 border-0"
                                aria-label="Close"
                            >
                                <span className="fa-solid fa-xmark coral fs-4"></span>
                            </button>
                        </div>
                        <div className="text-center my-3">
                            <img
                                src={member.avatar_url}
                                alt={`${member.user_name} avatar`}
                                className="rounded-circle"
                                style={{ width: 100, height: 100, objectFit: "cover" }}
                            />
                        </div>
                        <div className="row justify-content-center g-2">
                            {isAdmin
                                ? (
                                    <div className="col-4">
                                        <button type="button" onClick={handleRemoveAdmin} className="user-button w-100">
                                            ¿Quitar como admin?
                                        </button>
                                    </div>
                                )
                                : (
                                    <div className="col-4">
                                        <button type="button" onClick={handleMakeAdmin} className="user-button w-100">
                                            ¿Convertir en admin?
                                        </button>
                                    </div>
                                )
                            }

                            <div className="col-4">
                                <button type="button" onClick={handleKickOut} className="user-button text-danger w-100">
                                    ¿Quitar del hogar?
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            {show && <div className="modal-backdrop fade show"></div>}
        </>
    );
};
