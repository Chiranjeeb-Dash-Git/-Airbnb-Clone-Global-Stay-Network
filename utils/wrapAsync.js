module.exports = (fn) => {
    return function(req, res, next) {
        // Ensure fn is a function and has a catch method
        if (typeof fn !== 'function') {
            return next(new Error('Expected a function'));
        }
        
        // Wrap the async function and handle errors
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};