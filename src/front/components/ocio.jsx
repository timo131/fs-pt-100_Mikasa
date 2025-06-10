import "../styles/Ocio.css";

export const Ocio = () => {
    return (
        <div className="container-ocio">
            <nav class="navbar bg-body-tertiary">
                <div class="container-fluid">
                    <a class="navbar-brand">Busqueda</a>
                    <form class="d-flex" role="search">
                        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                        <button class="btn btn-outline-success" type="submit">Search</button>
                    </form>
                </div>
            </nav>
            <h1 className="text-center my-5">Ocio</h1>
            <p className="text-center">Aquí puedes gestionar tus actividades de ocio.</p>
            
        </div>
    )
}