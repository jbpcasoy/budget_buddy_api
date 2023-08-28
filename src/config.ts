// config.ts
export default {
  google: {
    clientID: process.env.GOOGLE_ID as string,
    clientSecret: process.env.GOOGLE_SECRET as string,
    callbackURL: "http://localhost:3000/auth/google/callback",
  },
};
