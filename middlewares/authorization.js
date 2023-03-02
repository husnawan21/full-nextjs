import jwt from 'jsonwebtoken'

export default function authorization(req, res) {
	return new Promise((resolve, reject) => {
		const { authorization } = req.headers
		if (!authorization) return res.status(401).end() // 401 = unauthorized

		// split auth pada header yang dikirim: type = bearer, token = tokenxxx
		const authSplit = authorization.split(' ')
		// const [authType, authToken] = [authSplit[0], authSplit[1]];
		const [authType, authToken] = authSplit

		// cek auth type
		if (authType !== 'Bearer') return res.status(401).end()

		// cek jwt: string token, key
		return jwt.verify(
			authToken,
			process.env.JWT_SECRET,
			function (err, decoded) {
				if (err) return res.status(401).end()

				return resolve(decoded)
			}
		)
	})
}
