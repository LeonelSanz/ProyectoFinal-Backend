export default {
    app:{
        ADMIN_USER : process.env.SUPERADMIN_EMAIL,
        ADMIN_PWD : process.env.SUPERADMIN_PASSWORD,
        PERSISTENCE: process.env.PERSISTENCE
    },
    mongo:{
        URL:process.env.MONGO_URL
    },
    jwt:{
        COOKIE:process.env.JWT_COOKIE,
        SECRET:process.env.JWT_SECRET
    },
    mailer:{
        GMAIL_USER: process.env.GMAIL_USER,
        GMAIL_PWD: process.env.GMAIL_PWD
    }
}