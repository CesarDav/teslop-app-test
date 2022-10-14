import jwt from 'jsonwebtoken';


export const signToken = (_id: string, email: string) => {
    if (!process.env.JWS_SCRET_SEED) {
        throw new Error("No JWT seed- Check - Review Environment Variables");
    }

    return jwt.sign(
        { _id, email },
        process.env.JWS_SCRET_SEED,
        { expiresIn: '30d' }
    )

}



export const isValidToken = (token: string): Promise<string> => {
    if (!process.env.JWS_SCRET_SEED) {
        throw new Error("No JWT seed- Check - Review Environment Variables");
    }
    if (token.length <= 10) {
        return Promise.reject('JWT is not valid')
    }
    return new Promise((resolve, reject) => {
        try {
            jwt.verify(token, process.env.JWS_SCRET_SEED || '', (err, payload) => {
                if (err) return reject('JWT is not valid');

                const { _id } = payload as { _id: string };
                resolve(_id)
            });
        } catch (error) {
            reject('JWT is not valid');

        }
    })
}