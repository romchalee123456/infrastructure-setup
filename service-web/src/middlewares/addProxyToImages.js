const proxyImage = (url) => url ? `http://localhost:5000/proxy?url=${encodeURIComponent(url)}` : null;

const addProxyToImages = (req, res, next) => {
    if (res.locals.data) {
        if (Array.isArray(res.locals.data)) {
            res.locals.data = res.locals.data.map(item => ({
                ...item,
                cover_image: proxyImage(item.cover_image),  
                profile_picture: proxyImage(item.profile_picture)
            }));
        } else if (typeof res.locals.data === "object") {
            res.locals.data = {
                ...res.locals.data,
                cover_image: proxyImage(res.locals.data.cover_image),  
                profile_picture: proxyImage(res.locals.data.profile_picture)
            };
        }
    }
    next();
};

module.exports = addProxyToImages;

