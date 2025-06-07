
export const Navbar = () => {

	return (
		<nav className="navbar navbar-expand-md bg-charcoal px-3 fixed-navbar">
			<div className="container-fluid">
				<div className="d-flex w-100 align-items-center justify-content-between">
					<a className="navbar-brand d-flex align-items-center" href="#">
						<img src="src/front/assets/img/mikasa_plumdust_sm.png" className="logo" alt="Mikasa logo" />
					</a>

					<button
						className="navbar-toggler border-0 ivory"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarNavAltMarkup"
						aria-controls="navbarNavAltMarkup"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<span className="fa fa-bars fa-2x ivory"></span>
					</button>


				</div>

				<div className="collapse navbar-collapse flex-column flex-md-row align-items-start align-items-md-center mt-2 mt-md-0" id="navbarNavAltMarkup">

					<div className="d-flex d-md-none w-100 justify-content-center my-2">
						<img
							src="src/front/assets/img/avatar-placeholder.jpg"
							alt="User avatar"
							className="rounded-circle user-avatar"
						/>
					</div>

					<div className="navbar-nav d-flex flex-column flex-grow-1 flex-md-row ms-md-auto px-md-5 gap-3 gap-md-4 w-100 justify-content-center justify-content-md-end">
						<a className="nav-link coral" href="#">Tareas</a>
						<a className="nav-link ochre" href="#">Finanzas</a>
						<a className="nav-link aqua" href="#">Ocio</a>
						<a className="nav-link sage" href="#">Comida</a>
					</div>
					<div className="d-none d-md-flex align-items-center ms-md-3">
						<img
							src="src/front/assets/img/avatar-placeholder.jpg"
							alt="User avatar"
							className="rounded-circle user-avatar"
						/>
					</div>
				</div>
			</div>
		</nav>
	);
};