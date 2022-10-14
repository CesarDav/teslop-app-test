import bcrypt from 'bcryptjs';

import { db } from "database"
import { IUser } from 'interfaces';
import { User } from "models";



export const getUsersByRole = async (role: string): Promise<IUser[] | null> => {

    await db.connect();
    const users = await User.find({ role });
    await db.disconnect();

    if (!users) return null;

    return JSON.parse(JSON.stringify(users));


}


export const checkUserEmaiPassword = async (email: string, password: string) => {

    await db.connect();
    const user = await User.findOne({ email });
    await db.disconnect();

    if (!user) return null;

    if (!bcrypt.compareSync(password, user.password!)) return null

    const { name, role, _id } = user;

    return {
        _id,
        email: email.toLocaleLowerCase(),
        role,
        name,
    }
}


// Esta funcion crea o verfica el usuariio de oAuth

export const oAuthToDbUser = async (oAuthEmail: string, oAuthName: string) => {
    await db.connect();
    const user = await User.findOne({ email: oAuthEmail });

    if (user) {
        await db.disconnect();
        const { _id, name, email, role } = user;
        return { _id, name, email, role };
    }

    const newuser = new User({ email: oAuthEmail, name: oAuthName, password: '@', role: 'client' });

    await newuser.save();
    await db.disconnect();

    const { _id, name, email, role } = newuser;

    return { _id, name, email, role };
}