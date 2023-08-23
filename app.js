const express = require('express')
const session = require('express-session')
const passport = require('passport')
const googleStrategy = require('passport-google-oauth20').Strategy

const app = express();

//configura nuestra sesion de auntenticacion   
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}))

// inicializar nuestro passport
app.use(passport.initialize())
app.use(passport.session())

//configurar la estrategia para autenticar con google
passport.use(new googleStrategy({
    clientID: '1044214521674-oide74qucjdh6is1l2g7rqi87u43pd5j.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:3000/auth/google/callback',
},(accessToken, refreshToken, profile, done)=>{
    // guardar toda la información del usuario
    return done(null, profile) 
}))

passport.serializeUser((user, done)=> {
    done(null, user)
})

passport.deserializeUser((user, done)=> {
    done(null, user)
})

// rutas
app.get('/', (req, res) => {
    res.send('Bienvenidos a mi pagina. Inicia sesion con Google: <a href="/auth/google">Inicio Sesion</a>')
})

app.get('/auth/google', passport.authenticate('google', {scope: ['profile','email']}))

app.get('/auth/google/callback',
    passport.authenticate('google', {failureRedirect: '/'}),
    (req, res) =>{
        console.log('mandame al nuevo perfil')
        res.redirect('/profile')
    }
)

app.get('/profile', (req, res)=>{
    res.send(`Bienvenido ${req.user.displayName}!!`)
})

app.listen(3000, ()=>{
    console.log(`Servidor ejecutado en http://localhost:3000`);
})
