import { isValidObjectId } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'


import { User } from 'models';
import { db } from 'database';
import { IUser } from 'interfaces';

type Data =
    | { message: string }
    | IUser[]



export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getUsers(req, res);
        case 'PUT':
            return updateUser(req, res);
        default:
            return res.status(400).json({ message: 'Bad request' });
    }


    // res.status(200).json({ message: 'Example' })
}


const getUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    await db.connect();
    const users = await User.find().select('-select').lean();
    await db.disconnect();
    return res.status(200).json(users);

}


const updateUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { userId = '', role = '' } = req.body

    if (!isValidObjectId(userId)) return res.status(400).json({ message: 'Not a valid id' });


    const validRoles = ['admin', 'client'];

    if (!validRoles.includes(role)) return res.status(400).json({ message: 'Role not allowed' });


    await db.connect();

    const user = await User.findById(userId);
    if (!user) {
        await db.disconnect();
        return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    await db.disconnect();

    return res.status(200).json({ message: 'User successfully updated' });


}