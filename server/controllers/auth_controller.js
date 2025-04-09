// Get profile info
const getProfile = async (req, res) => {
    try {
        const profileData = await req.oidc.user
        res.json(profileData);
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile", error });
    }
};

// Check session
const getAuth = async (req, res) => {
    try {
        const isAuthenticated = req.oidc.isAuthenticated();
        res.json({ isAuthenticated });
    } catch (error) {
        res.status(500).json({ message: "Error checking session", error });
    }
}

module.exports = {
    getProfile,
    getAuth,
}