import jwt from 'jsonwebtoken';
 
 export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // no token unauthorized
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        
        // TOKEN INVALID FORBIDDEN
        if (err) return res.sendStatus(401);
        req.user = user;
        next();
    });

}
