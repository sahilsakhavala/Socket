import { db } from "../config/db.js";
import { verifyToken } from "../helper/verifyToken.js";

const User = db.users
const UserSession = db.userSessions

const userAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            status: 'fail',
            message: 'Unauthorized!'
        });
    }
    const token = authHeader.split(' ')[1];
    try {
        const verifyResponse = verifyToken(token);
        if (!verifyResponse.success) {
            return res.status(401).json({
                status: 'fail',
                message: 'Token verification failed'
            })
        }
        const id = verifyResponse.user.id
        const checkUser = await User.findOne({ where: { id } })
        if (!checkUser) {
            return res.status(401).json({
                status: 'fail',
                message: 'Unauthorized User!'
            })
        }
        const userSession = await UserSession.findOne({ where: { user_id: id } })
        if (!userSession) {
            return res.status(401).json({
                status: 'fail',
                message: 'Unauthorized!'
            })
        }
        req.user = { id: id };
        next();
    } catch (error) {
        console.log('error', error)
        return res.status(401).json({
            status: 'fail',
            message: 'Unauthorized!'
        });
    }
}

const socketAuth = async (socket, next) => {
    const authHeader = socket.handshake.headers.authorization;
    if (!authHeader) {
        return next(new Error('Unauthorized'));
    }
    const token = authHeader.split(' ')[1];
    try {
        const verifyResponse = verifyToken(token);
        if (!verifyResponse.success) {
            return next(new Error('Token verification failed'));
        }
        const userSession = await UserSession.findOne({ where: { token: token } })
        if (!userSession) {
            return next(new Error('Unauthorized!'));
        }
        socket.user = { id: userSession.user_id };
        next();
    } catch (error) {
        console.log('error', error)
        return next(new Error('Unauthorized!'));
    }
}

export default userAuth;

export {
    socketAuth
}