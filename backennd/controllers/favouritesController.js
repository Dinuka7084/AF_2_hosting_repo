const User = require('../models/User');


//get favourite
exports.getFav = async (req, res) => {
    try{
    const user = await User.findById(req.user.id);
    res.status(200).json({ favourites: user.favourites });
    } catch (error){
        res.status(500).json({ error: error.message })
    }
}

//add fav
exports.postFav = async (req, res) => {
    try {
    const { countryCode } = req.body;
    const user = await User.findById(req.user.id);

    if(!user.favourites.includes(countryCode)){
        user.favourites.push(countryCode);
        await user.save();
    }

    res.status(200).json({ message: 'Added to favourites', favourites: user.favourites });
    } catch (error) {
        res.status(500).json({ error: error.message })
    } 
}

// Remove a favourite
exports.removeFav = async (req, res) => {
    try {
      const { countryCode } = req.params; // Changed from body to params
      const user = await User.findById(req.user.id);
  
      user.favourites = user.favourites.filter(code => code !== countryCode);
      await user.save();
  
      res.status(200).json({ message: 'Removed from favourites', favourites: user.favourites });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  


// Check if a country is in favourites
exports.isFav = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const isFav = user.favourites.includes(req.params.countryCode);
    res.json({ isFav });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
