import passportJwt from 'passport-jwt';
import passport from 'passport';
import Account from '../models/Account';
import dotenv from 'dotenv';

dotenv.config();

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET!,
};

passport.use(
    new JwtStrategy(options, async (payload, done) => {
        try {
            const account = await Account.findByPk(payload.id);
            if (account) {
                return done(null, account);
            }
            return done(null, false);
        } catch (error) {
            return done(error, false);
        }
    })
);
