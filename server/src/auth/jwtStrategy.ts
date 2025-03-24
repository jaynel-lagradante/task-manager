import passportJwt, { StrategyOptionsWithRequest } from 'passport-jwt';
import passport from 'passport';
import Account from '../models/Account';
import dotenv from 'dotenv';

dotenv.config();

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const options: StrategyOptionsWithRequest = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET!,
    passReqToCallback: true,
};

passport.use(
    new JwtStrategy(options, async (req, payload, done) => {
        try {
            const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
            const account = await Account.findOne({
                where: { active_token: token },
            });
            if (account) {
                return done(null, account);
            }
            return done(null, false, { message: 'Invalid or inactive token' });
        } catch (error) {
            return done(error, false);
        }
    })
);
