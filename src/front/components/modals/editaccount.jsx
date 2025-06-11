import { useState, useEffect, useRef } from "react";
import userServices from "../../services/userServices";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import "../../styles/User.css";
import { Link, useNavigate } from "react-router-dom";
import placeholder from "../../assets/img/avatar-placeholder.jpg";

const CLOUD_NAME = "daavddex7";
const UPLOAD_PRESET = "avatar_unsigned";

export const EditAccount = ({ show, onClose }) => {
    const navigate = useNavigate()
    const { store, dispatch } = useGlobalReducer();
    const [formData, setFormData] = useState({
        hogar_name: "",
        user_name: "",
        email: "",
        password: "",
        repeat_password: "",
        avatar_url: "",
        otros: []
    });

    const widgetRef = useRef(null);

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        if (window.cloudinary && !widgetRef.current) {
            widgetRef.current = window.cloudinary.createUploadWidget(
                {
                    cloudName: CLOUD_NAME,
                    uploadPreset: UPLOAD_PRESET,
                    sources: ["local", "url", "camera"],
                    multiple: false,
                    cropping: true,
                    croppingAspectRatio: 1,
                    folder: "user_avatars",
                    maxImageFileSize: 10000000,
                    clientAllowedFormats: ["png", "jpg", "jpeg"],
                    showAdvancedOptions: false,
                    styles: {
                        palette: {
                            window: "#FFFFFF",
                            windowBorder: "#90A0B3",
                            tabIcon: "#000000",
                            menuIcons: "#555a5f",
                            textDark: "#000000",
                            textLight: "#FFFFFF",
                            link: "#0433ff",
                            action: "#339933",
                            inactiveTabIcon: "#0E2F5A",
                            error: "#F44235",
                            inProgress: "#0078FF",
                        },
                        fonts: {
                            default: null,
                            "'Fira Sans', sans-serif": {
                                url: "https://fonts.googleapis.com/css?family=Fira+Sans",
                                active: true,
                            },
                        },
                    },
                },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary Widget error:", error);
                        return;
                    }
                    if (result.event === "success") {
                        console.log("Upload Successful:", result.info);
                        setFormData((prev) => ({
                            ...prev,
                            avatar_url: result.info.secure_url,
                        }));
                    }
                }
            );
        }
    }, []);

    const handleChooseAvatar = () => {
        if (widgetRef.current) {
            widgetRef.current.open();
        } else {
            console.error("Widget not ready yet");
        }
    };

    const handleEmailsChange = (newEmailsArray) => {
        setFormData({ ...formData, otros: newEmailsArray });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const data = await userServices.updateuser(formData);
            onClose();
        } catch (err) {
            console.error(err);
            alert("Error creating hogar:\n" + err.message);
        }

    };

    const getTransformedAvatar = (url) => {
        if (!url) return '';
        return url.replace('/upload/', '/upload/c_thumb,g_face,w_100,h_100/');
    };

    const passwordsMatch =
        formData.repeat_password === "" ||
        formData.repeat_password === formData.password;

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
                            <h3 className="modal-title ivory">Editar tu perfil</h3>
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn btn-link p-0 m-0 border-0"
                                aria-label="Close"
                            >
                                <span className="fa-solid fa-xmark coral fs-4"></span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="user-form">
                            <div className="row my-1">
                                <div className="col-4 d-flex align-items-center justify-content-end">
                                    <label htmlFor="user_name" className="ivory fw-bold">Nombre de usuario</label>
                                </div>
                                <div className="col-8">
                                    <input
                                        id="user_name"
                                        name="user_name"
                                        placeholder={store.user.user_name}
                                        value={formData.user_name}
                                        onChange={handleChange}
                                        type="text"
                                        className="my-1"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row my-1">
                                <div className="col-4 d-flex align-items-center justify-content-end">
                                    <label htmlFor="email" className="ivory fw-bold">Correo electrónico</label>
                                </div>
                                <div className="col-8">
                                    <input
                                        id="email"
                                        name="email"
                                        placeholder={store.user.email}
                                        value={formData.email}
                                        onChange={handleChange}
                                        type="email"
                                        className="my-1"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row my-1">
                                <div className="col-4 d-flex align-items-center justify-content-end">
                                    <label htmlFor="password" className="ivory fw-bold">Nueva contraseña</label>
                                </div>
                                <div className="col-8">
                                    <input
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        type="password"
                                        className="my-1"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row my-1">
                                <div className="col-4 d-flex align-items-center justify-content-end">
                                    <label htmlFor="repeat_password" className="ivory fw-bold">Repetir la contraseña</label>
                                </div>
                                <div className="col-8">
                                    <input
                                        id="repeat_password"
                                        name="repeat_password"
                                        value={formData.repeat_password}
                                        onChange={handleChange}
                                        type="password"
                                        className={`form-control my-1 ${formData.repeat_password && !passwordsMatch ? "is-invalid" : ""
                                            }`}
                                        required
                                    />

                                    <div className="invalid-feedback">
                                        Las contraseñas no coinciden.
                                    </div>
                                </div>
                            </div>
                            <div className="row align-items-center my-3">
                                <div className="col-4 d-flex justify-content-end">
                                    <label className="ivory fw-bold">
                                        Imagen de perfil
                                    </label>
                                </div>
                                <div className="col-4 d-flex justify-content-end">
                                    <div>
                                        <img
                                            src={
                                                store.user.avatar_url
                                                    ? getTransformedAvatar(store.user.avatar_url)
                                                    : placeholder
                                            }
                                            alt="Avatar Preview"
                                            style={{
                                                width: "100px",
                                                height: "100px",
                                                borderRadius: "50%",
                                                objectFit: "cover",
                                                border: "1px solid #ccc",
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="col-3 d-flex justify-content-start">
                                    <span className="fa-solid fa-pencil fa-2x user-icon" onClick={handleChooseAvatar}></span>                            </div>

                            </div >
                            <div className="row justify-content-center">
                                <button type="submit" className="user-button col-4">Actualizar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {show && <div className="modal-backdrop fade show"></div>}
        </>
    );
};
