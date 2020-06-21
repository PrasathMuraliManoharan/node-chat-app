import jwt from 'jsonwebtoken';
import UserModel from '../models/user.js';

const SECRET_KEY = 'some-secret-key';

export const encode = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await UserModel.getUserById(userId);
        const payload = {
            userId: user._id,
            userType: user.type
        }
        const authToken = jwt.sign(payload, SECRET_KEY);
        req.authToken = authToken;
        next();

    } catch (error) {
        return res.status(400).json({ success: false, error })
    }
}

export const decode = async (req, res, next) => {
    if (!req.headers['authorization']) {
        return res.status(400).json({ success: false, message: 'No Access token provided' });
    }
    const accessToken = req.headers['authorization'].split(' ')[1];

    try {
        const decoded = jwt.verify(accessToken, SECRET_KEY);
        req.userId = decoded.userId;
        req.userType = decoded.userType;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: error })
    }

}