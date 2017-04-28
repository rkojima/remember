// Used so that I could always have isAuthenticated and user handy when rendering
function populateVariables(req, others) {
    return Object.assign({
        isAuthenticated: req.isAuthenticated(),
        user: req.user || false,
    }, others);
}

module.exports = {populateVariables};