module.exports = (req, res, next) => {
    return res.status(404).render('errors/404');
};