import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const getDataFromToken = (req) => {
    try {
        const token = req.cookies.get('token')?.value || '';

        if (!token) return null;

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'supersecuresecretkey12345');
        return decodedToken.id;
    } catch (error) {
        return null;
    }
}
