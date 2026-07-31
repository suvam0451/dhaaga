import { useLocation, Link } from 'react-router-dom';

export function Header() {
	const { pathname } = useLocation();

	return (
		<header>
			<nav>
				<Link to="/" className={pathname === '/' ? 'active' : ''}>
					Home
				</Link>
				<Link to="/404" className={pathname === '/404' ? 'active' : ''}>
					404
				</Link>
			</nav>
		</header>
	);
}
