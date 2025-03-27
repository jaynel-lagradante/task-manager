import { Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import passport from 'passport';
import Account from '../models/Account';
import dotenv from 'dotenv';
import { MESSAGE_INVALID_OR_INACTIVE_TOKEN } from '../config/messages';

dotenv.config();

const cookieExtractor = (req: any) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['authToken'];
    }
    return token;
};

const jwtOptions: StrategyOptionsWithRequest = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET!,
    passReqToCallback: true,
};

passport.use(
    new Strategy(jwtOptions, async (req, payload, done) => {
        try {
            const tokenFromCookie = cookieExtractor(req);
            if (!tokenFromCookie) {
                return done(null, false, { message: MESSAGE_INVALID_OR_INACTIVE_TOKEN });
            }

            const account = await Account.findOne({
                where: { active_token: tokenFromCookie, id: payload.id },
            });

            if (account) {
                return done(null, account);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    })
);
