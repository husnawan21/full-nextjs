import { useState } from 'react'
import { authPage } from '@/middlewares/authorizationPage'
import { useRouter } from 'next/router'
import Nav from '@/components/Nav'
import Head from 'next/head'

export async function getServerSideProps(ctx) {
	const { token } = await authPage(ctx)

	const { id } = ctx.query

	const postReq = await fetch('http://localhost:3000/api/posts/detail/' + id, {
		headers: {
			Authorization: 'Bearer ' + token,
		},
	})

	const res = await postReq.json()

	return {
		props: {
			token,
			post: res.data,
		},
	}
}

export default function PostEdit(props) {
	const { post } = props
	const [fields, setFields] = useState({
		title: post.title,
		content: post.content,
	})

	const [status, setStatus] = useState('normal')

	const router = useRouter()

	async function updateHandler(e) {
		e.preventDefault()
		setStatus('loading')

		const { token } = props

		const update = await fetch('/api/posts/update/' + post.id, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + token,
			},
			body: JSON.stringify(fields),
		})

		if (!update.ok) return setStatus('error')

		const res = await update.json()

		setStatus('success')

		router.push('/posts')
	}

	function fieldHandler(e) {
		const name = e.target.getAttribute('name')

		setFields({
			...fields,
			[name]: e.target.value,
		})
	}
	return (
		<>
			<Head>
				<title>Next Full | Edit Post</title>
				<meta name='description' content='Generated by create next app' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<h1>Edit Post</h1>
			<br />
			<Nav />
			<br />
			<br />
			<p>&gt; Post ID: {post.id}</p>
			<br />
			<form action='' onSubmit={updateHandler.bind(this)}>
				<input
					onChange={fieldHandler.bind(this)}
					type='text'
					placeholder='Title'
					name='title'
					defaultValue={post.title}
				/>
				<br />
				<textarea
					onChange={fieldHandler.bind(this)}
					name='content'
					id=''
					cols='20'
					rows='10'
					placeholder='Content'
					defaultValue={post.content}
				></textarea>
				<br />
				<button type='submit'>Save Changes</button>
			</form>
			<div>Status: {status}</div>
		</>
	)
}
