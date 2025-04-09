const express = require("express");
const router = express.Router();
const ShortedURL = require("../models/shortedURL");
const { requiresAuth } = require("express-openid-connect");

const generateRandomString = (length) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// POST: Create a new shortened URL
router.post("/shortenUrl", requiresAuth(), async (req, res) => {
  const { longURL, title } = req.body;
  const shortURL = `${process.env.CLIENT_URL}/url/` + generateRandomString(6);
  const createdDate = new Date();

  const newUrl = new ShortedURL({
    longURL,
    shortURL,
    title,
    createdDate,
    createdBy: req.oidc.user.sub,
  });

  try {
    const savedUrl = await newUrl.save();
    res.status(201).json(savedUrl);
  } catch (err) {
    res.status(400).send(err);
  }
});

// GET: Retrieve all shortened URLs
router.get("/getUrls", requiresAuth(),  async (req, res) => {
  try {
    const urls = await ShortedURL.find({ createdBy: req.oidc.user.sub });
    res.json(urls);
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET: Redirect to the long URL
router.get("/url/:shortId", async (req, res) => {
  const shortURL = `${process.env.CLIENT_URL}/url/${req.params.shortId}`;
  try {
    const urlEntry = await ShortedURL.findOne({ shortURL });
    if (urlEntry) {
      res.send(urlEntry.longURL);
    } else {
      res.status(404).send("URL not found");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// DELETE: Delete a shortened URL
router.delete("/deleteUrl/:id", async (req, res) => {
  try {
    const deletedUrl = await ShortedURL.findByIdAndDelete(req.params.id);
    if (deletedUrl) {
      res.status(200).json(deletedUrl);
    } else {
      res.status(404).send("URL not found");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// PUT: Update the title of a shortened URL
router.put("/updateUrl/:id", async (req, res) => {
  const { title } = req.body;
  try {
    const updatedUrl = await ShortedURL.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true }
    );
    if (updatedUrl) {
      res.status(200).json(updatedUrl);
    } else {
      res.status(404).send("URL not found");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;