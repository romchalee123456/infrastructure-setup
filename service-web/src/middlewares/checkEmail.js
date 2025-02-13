
const checkEmail =  (req, res, next) => {
    const { email } = req.body;
    User.findByEmail(email, (_, data) => {
        if (data) {
            res.status(400).send({
                status: 'error',
                message: `email  '${email}' มีในระบบอยู่แล้ว`
            });
            return;
        }
        next();
    });
}

module.exports = checkEmail;