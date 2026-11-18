
import { useNavigate } from "react-router-dom";
import "./styles/PageHeader.css";

const PageHeader = ({ breadcrumbs = [] }) => {
    const navigate = useNavigate();

    const irAInicio = () => {
        navigate("/vista-principal");
    };

    const volver = () => {
        if (window.history.state?.idx > 0) {
            navigate(-1);
        } else {
            navigate("/vista-principal");
        }
    };

    return (
        <div className="page-header">
            <div className="ph-top">
                <div className="ph-navigation">
                    <button
                        type="button"
                        className="ph-back"
                        onClick={volver}
                        title="Regresar"
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                        <span>Volver</span>
                    </button>

                    <span className="ph-separator">|</span>

                    <button
                        type="button"
                        className="ph-home"
                        onClick={irAInicio}
                        title="Ir al inicio"
                    >
                        <i className="fa-solid fa-house"></i>
                        <span>Inicio</span>
                    </button>
                </div>

                <div className="ph-breadcrumbs">
                    {breadcrumbs.map((item, index) => {
                        const esUltimo = index === breadcrumbs.length - 1;

                        return (
                            <div className="ph-breadcrumb-item" key={index}>
                                {index > 0 && (
                                    <i className="fa-solid fa-chevron-right ph-chevron"></i>
                                )}

                                {item.path && !esUltimo ? (
                                    <button
                                        type="button"
                                        className="ph-breadcrumb-link"
                                        onClick={() => navigate(item.path)}
                                    >
                                        {item.label}
                                    </button>
                                ) : (
                                    <span className={esUltimo ? "ph-current" : ""}>
                                        {item.label}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PageHeader;



