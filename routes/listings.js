router.post('/:id/favorite', isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const listingId = req.params.id;
        
        if (req.body.action === 'like') {
            user.favorites.push(listingId);
        } else {
            user.favorites.pull(listingId);
        }
        
        await user.save();
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}); 