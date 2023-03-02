import Link from 'next/link'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

export default function Nav() {
	const router = useRouter()

	function logoutHandler(e) {
		e.preventDefault()

		Cookies.remove('token')
		router.replace('/auth/login')
	}

	return (
		<>
			<Link href='/posts'>Posts</Link>
			&nbsp; | &nbsp;
			<Link href='/posts/create'>Create Post</Link>
			&nbsp; | &nbsp;
			<a href='#' onClick={logoutHandler.bind(this)}>
				Logout
			</a>
		</>
	)
}
