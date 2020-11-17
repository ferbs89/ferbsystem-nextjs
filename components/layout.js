import Header from './header';
import Menu from './menu';

export default function Layout({ children }) {
	return (
		<div className="container">
			<Header />
			<Menu />
			{children}
		</div>
	)
}
