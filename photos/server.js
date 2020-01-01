// Photo Album Server Setup
// =============================================================================

// Call the packages we need
var express   = require("express");
var request   = require("request");
var rp        = require("request-promise-native");
var cors      = require("cors");
var _chunk    = require("lodash.chunk");
var fs        = require("fs");
var path      = require("path");
var sharp     = require("sharp");
var schedule  = require("node-schedule");

var app       = express();

// Only run server if GALLERY_URL is defined
if(process.env.GALLERY_URL) {

  // Enable HTML template middleware
  app.engine("html", require("ejs").renderFile);

  // Enable static CSS styles
  app.use(express.static("styles"));

  // Set server port
  var port = process.env.PORT || 8888;

  // Get an instance of the express router
  var router = express.Router();

  // Main route
  router.get("/", cors(), function(req, res) {

    // Wait images to be processed
    if(images.length > 0){
      res.render("index.html", {
        loadingCompleted: true,
        photos: images,
        timer: slideshow_timer,
        image_styles: image_styles,
        transition: transition
      });

    } else {
      res.render("index.html", {
        loadingCompleted: false,
        photos: [],
        timer: slideshow_timer,
        image_styles: image_styles,
        transition: transition
      });
    }

  });

  // Get the next image in the array
  router.get("/img/:id", function(req, res) {

    var next = {};
    if (req.params.id < images.length ) {
      // return next image on the list
      next.img = images[req.params.id++];
      next.id = req.params.id++;
    } else {
      // return first image
      next.img = images[0];
      next.id = 0;
    }

    res.send(next);

  });

  // Register routes
  app.use(express.static(__dirname));
  app.use("/", router);

  // Get image variables
  var images = [];
  fetchImages(process.env.GALLERY_URL);

  // Set slideshow time
  var slideshow_timer = 10000; // default value
  if (process.env.GALLERY_SLIDESHOW_DELAY) {
    var slideshow_timer = parseInt(process.env.GALLERY_SLIDESHOW_DELAY);
  }

  // Set photo scaling
  var image_styles = "cover"; // default value
  if (process.env.GALLERY_IMAGE_STYLE) {
    var styles = ["contain", "cover"];
    var container = process.env.GALLERY_IMAGE_STYLE.toLowerCase();
    if (styles.includes(container)) {
      image_styles = container;
    }
  } 

  // Gallery transition effect
  var transition = "fade" ; // default value
  if (process.env.GALLERY_EFFECT) {
    var effects = ["fade", "horizontal", "vertical", "kenburns", "false"];
    var transitionSelected = process.env.GALLERY_EFFECT.toLowerCase();
    if (effects.includes(transitionSelected)) {
      transition = transitionSelected; 
    }
  } 

  // Get gallery update cron timing
  // 0 */12 * * *
  var cronSchedule = "0 */12 * * *"; // default value
  if (process.env.CRON_SCHEDULE) {
    cronSchedule = process.env.CRON_SCHEDULE;
    console.log("🐉 - Scheduler configured for "+cronSchedule);
  }

  // Get resize width
  var maxWidth = 1000; // default value
  if (process.env.RESIZE_WIDTH) {
    maxWidth = parseInt(process.env.RESIZE_WIDTH);
  }

  // Get image compress quality
  var compressQuality = 90; // default value
  if (process.env.COMPRESS_QUALITY) {
    compressQuality = parseInt(process.env.COMPRESS_QUALITY);
  }
  
  // Shuffle album images
  var shuffleGallery = false; // default value
  if (process.env.SHUFFLE_SLIDESHOW) {
    var shuffleGallery = (process.env.SHUFFLE_SLIDESHOW == "true");
  }

  // Server Start
  // =============================================================================
  app.listen(port);
  console.log("✨ - Magic happens on port " + port);

  // Update image scheduler
  var j = schedule.scheduleJob(cronSchedule, function(){
    images = [];
    console.log("🐉 - Refreshing gallery array");
    fetchImages(process.env.GALLERY_URL);
  });


} else {
  app.get('/', (req, res) => res.send('Hello there!!'))
  app.listen(port);
  console.log("GALLERY_URL not set, stopping express server.");
}

// Functions //

/**
 * Fetch all images from a custom album url 
 * @param {String} albumURL Album URL from Google Photos, Dropbox or Apple Photos.
 */
function fetchImages(albumURL) {
  console.log("📷 - Fetching images...");

  var hostname = getHostName(albumURL);

  // Google Photos
  if (["photos.app.goo.gl", "goo.gl"].includes(hostname)) {
    console.log("📷 - Starting a google photos slideshow.");

    var photos = [];

    // Parse photos
    const rx = /\["(https:\/\/[^\.]+.googleusercontent\.com\/[^"]+)",([0-9]+),([0-9]+)[,\]]/;
    const extractPhotos = data =>
      data
        .match(new RegExp(rx, "g"))
        .map(m => m.match(rx))
        .map(p => {
          const width = +p[2];
          const height = +p[3];
          const url = `${p[1]}=w${width}-h${height}-no`;
          return `${p[1]}=w1000`; // Change here to increase/decrease image width-size
        });

    request(
      {
        uri: albumURL,
        method: "GET",
        timeout: 10000
      },
      function(error, response, body) {
        if (!error && response.statusCode == 200) {
          // Fetch and remove duplicate images
          photos = extractPhotos(body);
          photos = [...new Set(photos)]; // save only unique values

          console.log("Found " + photos.length + " images.");
          setImagesArray(photos);
        }

        // In case of errors
        else {
          photos.push("views/album_url_error.png");
          setImagesArray(photos);
          console.log("error:", error);
        }
      }
    );
  }

  // Dropbox Photos
  else if (hostname == "dropbox.com") {
    console.log("📷 - Starting a new dropbox photos slideshow.");

    var photos = [];

    const rx = /(https:\/\/)([^\.]+)(.previews.dropboxusercontent.com\/p\/thumb\/)([^\/]+)(\/p.jpeg 1280)/;
    const extractPhotos = data => data.match(new RegExp(rx, "g"));

    request(
      {
        uri: albumURL,
        method: "GET",
        timeout: 10000
      },
      function(error, response, body) {
        if (!error && response.statusCode == 200) {
          body = extractPhotos(body);

          body.forEach(function(entry) {
            entry = entry.slice(0, -5);
            photos.push(entry);
          });

          console.log("Found " + photos.length + " images.");
          setImagesArray(photos);
        }

        // In case of errors
        else {
          photos.push("views/album_url_error.png");
          setImagesArray(photos);
          console.log("error:", error);
        }
      }
    );
  }

  // Apple Photos
  else if (hostname == "icloud.com") {
    console.log("📷 - Starting a new apple photos slideshow.");

    // Get the album id from URL
    var albumId = albumURL.match(new RegExp("([^#/]+$)", "g"))[0];

    // Calculate base URL
    var baseUrl = getBaseUrl(albumId);

    // Download images
    getPhotoMetadata(baseUrl)
      .then(function(metadata) {
        var chunks = _chunk(metadata.photoGuids, 25);

        var processChunks = function(i) {
          if (i < chunks.length) {
            getUrls(baseUrl, chunks[i]).then(function(urls) {
              decorateUrls(metadata, urls);

              setTimeout(function() {
                processChunks(i + 1);
              }, 1000);
            });
          } else {
            var i = 0;
            for (var photoGuid in metadata.photos) {
              var photo = metadata.photos[photoGuid];

              // Download images
              console.log("[file"+i+".jpg] - Downloading");
              downloadFile(photo.url, "file" + i + ".jpg");
              i++;
            }

            images = listImagesInDir(path.dirname(require.main.filename));
          }
        };

        processChunks(0);
      })
      .catch(function(error) {
        images.push("views/album_url_error.png");
        setImagesArray(images);
        console.log("error:", error);
      });
  } 
  else if (albumURL === "USBDRIVE") {
    let usbPhotos = listImagesInDirSync('/usbstorage')
    let currentPhotos = listImagesInDirSync(path.join(path.dirname(require.main.filename), 'views/usbstorage'))
    
    try {
      if (usbPhotos.length > 0) {
        // Only update photos if there are new ones on /usbstorage
        currentPhotos.map(p => fs.unlinkSync(p))
        usbPhotos.map(p => fs.copyFileSync(p, `views/usbstorage/${path.basename(p)}`))
        let newPhotos = listImagesInDirSync('views/usbstorage')
        setImagesArray(newPhotos);
        console.log(`Got ${newPhotos.length} image(s) from /usbstorage.`);
      } else if (currentPhotos.length === 0) {
        images.push("views/album_url_error.png");
        setImagesArray(images);
        console.log("No images found on views/usbstorage folder.");
      }
    } catch (error) {
      images.push("views/album_url_error.png");
      setImagesArray(images);
      console.log("error:", error);
    }
  }
  else {
    images.push("views/album_url_error.png");
    setImagesArray(images);
    console.log("error: Could not parse album.");
  }
}

/**
 * Callback function to set image array.
 * Depending on the parameters, can also suffle image array. 
 * @param {Array} value Images array.
 */
function setImagesArray(value) {
  // callback function
  if(shuffleGallery) {
    console.log("🔀 - Shuffling images ON 🔀")
    images = shuffle(value);
  } else {
    console.log("🔀 - Shuffling images OFF 🔀")
    images = value;
  }
}

/**
 * From a given URL, gets the hostname
 * @param {String} url Website url.
 */
function getHostName(url) {
  var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
  if (
    match != null &&
    match.length > 2 &&
    typeof match[2] === "string" &&
    match[2].length > 0
  ) {
    return match[2];
  } else {
    return null;
  }
}

/**
 * Parse the base url for apple photos
 * @param {String} token Token is the album id.
 */
function getBaseUrl(token) {
  var BASE_62_CHAR_SET =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  var base62ToInt = function(e) {
    var t = 0;
    for (var n = 0; n < e.length; n++)
      t = t * 62 + BASE_62_CHAR_SET.indexOf(e[n]);
    return t;
  };

  var e = token,
    t = e[0],
    n = t === "A" ? base62ToInt(e[1]) : base62ToInt(e.substring(1, 3)),
    r = e,
    i = e.indexOf(";"),
    s = null;

  if (i >= 0) {
    s = e.slice(i + 1);
    r = r.replace(";" + s, "");
  }

  var serverPartition = n;

  var baseUrl = "https://p";

  baseUrl += serverPartition < 10 ? "0" + serverPartition : serverPartition;
  baseUrl += "-sharedstreams.icloud.com";
  baseUrl += "/";
  baseUrl += token;
  baseUrl += "/sharedstreams/";

  return baseUrl;
}

/**
 * Fetches the metadata for aple photos
 * @param {String} baseUrl Apple photos album url.
 */
function getPhotoMetadata(baseUrl) {
  var url = baseUrl + "webstream";

  var headers = {
    Origin: "https://www.icloud.com",
    "Accept-Language": "en-US,en;q=0.8",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
    "Content-Type": "text/plain",
    Accept: "*/*",
    Referer: "https://www.icloud.com/sharedalbum/",
    Connection: "keep-alive"
  };

  var dataString = '{"streamCtag":null}';

  var options = {
    url: url,
    method: "POST",
    headers: headers,
    body: dataString
  };

  return rp(options).then(function(body) {
    var data = JSON.parse(body);

    var photos = {};

    var photoGuids = [];

    data.photos.forEach(function(photo) {
      photos[photo.photoGuid] = photo;
      photoGuids.push(photo.photoGuid);
    });

    return {
      photos: photos,
      photoGuids: photoGuids
    };
  });
}

/**
 * Geg ULR for images
 * @param {String} baseUrl Directory to check for images as string.
 * @param {String} photoGuids
 */
function getUrls(baseUrl, photoGuids) {
  var url = baseUrl + "webasseturls";

  var headers = {
    Origin: "https://www.icloud.com",
    "Accept-Language": "en-US,en;q=0.8",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
    "Content-Type": "text/plain",
    Accept: "*/*",
    Referer: "https://www.icloud.com/sharedalbum/",
    Connection: "keep-alive"
  };

  var dataString = JSON.stringify({
    photoGuids: photoGuids
  });

  var options = {
    url: url,
    method: "POST",
    headers: headers,
    body: dataString
  };

  // console.log('Retrieving URLs for ' + photoGuids[0] + ' - ' + photoGuids[photoGuids.length - 1] + '...');

  return rp(options).then(function(body) {
    var data = JSON.parse(body);

    var items = {};

    for (var itemId in data.items) {
      var item = data.items[itemId];

      items[itemId] = "https://" + item.url_location + item.url_path;
    }

    return items;
  });
}

/**
 * Get best image from meta
 * @param {Array} metadata Directory to check for images as string.
 * @param {Array} urls
 */
function decorateUrls(metadata, urls) {
  for (var photoId in metadata.photos) {
    var photo = metadata.photos[photoId];

    var biggestFileSize = 0;
    var bestDerivative = null;

    for (var derivativeId in photo.derivatives) {
      var derivative = photo.derivatives[derivativeId];

      if (parseInt(derivative.fileSize, 10) > biggestFileSize) {
        biggestFileSize = parseInt(derivative.fileSize, 10);
        bestDerivative = derivative;
      }
    }

    if (bestDerivative) {
      if (typeof urls[bestDerivative.checksum] == "undefined") {
        continue;
      }

      var url = urls[bestDerivative.checksum];
      metadata.photos[photoId].url = url;
      metadata.photos[photoId].bestDerivative = bestDerivative;
    }
  }
}

/**
 * Download file to directory
 * @param {String} url File URL.
 * @param {String} dest Full path of destination folder to save file.
 * @param {String} cb Callback function. 
 */
function downloadFile(url, dest, cb) {
  const file = fs.createWriteStream(dest);
  const sendReq = request.get(url);

  // verify response code
  sendReq.on("response", response => {
    if (response.statusCode !== 200) {
      console.log("Response status was " + response.statusCode);
    }

    sendReq.pipe(file);
  });

  // close() is async, call cb after close completes
  file.on("finish", () => file.close(resizeFile(dest, maxWidth)));

  // check for request errors
  sendReq.on("error", err => {
    fs.unlink(dest);
    console.log(err.message);
  });

  file.on("error", err => {
    // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    console.log(err.message);
  });
}

/**
 * Resize image with specific width
 * @param {String} imageFile Full path of image file.
 * @param {Integer} maxWidth Max image width in pixels, default to 1000 px.
 */
function resizeFile(imageFile, maxWidth = 1000) {
  console.log("["+imageFile+"] - Analyzing");

  try {
    if (fs.existsSync(imageFile)) {

      // Resize image
      console.log("["+imageFile+"] - Resizing to "+ maxWidth + "px and compressing it to "+ compressQuality +"%.");
      sharp(imageFile)
        .resize(maxWidth,maxWidth, { fit: 'inside', withoutEnlargement: true })
        .jpeg({
          quality: compressQuality,
          chromaSubsampling: '4:4:4'
        })
        .toBuffer((err, buffer) => {
          if (err) {
            console.log(imageFile + " - " + err);
          }
          fs.writeFile(imageFile, buffer, (e) => {
            if(e){
              console.log("Error saving image to file: "+e);
            }
          });
        });
    }
  } catch (err) {
    console.error(err);
  }
}

/**
 * List images in directory 
 * @param {String} directory Directory to check for images as string.
 */
function listImagesInDir(directory) {
  var images = [];

  fs.readdir(directory, function(err, items) {
    extensions = ["jpg", "jpeg", "gif", "png", "bmp"];
    // Get image files
    for (var i = 0; i < items.length; i++) {
      if (extensions.includes(items[i].split(".").pop())) {
        images.push(items[i]);
      }
    }
  });

  return images;
}

/**
 * List images synchronously in directory
 * @param {String} directory Directory to check for images as string.
 */
function listImagesInDirSync (directory) {
  if (!fs.existsSync(directory)) return [];
  let newDirents = fs.readdirSync(directory, { withFileTypes: true });
  let files = newDirents
    .filter(d => !d.isDirectory() && d.isFile())                                      // remove directories
    .map(d => d.name)                                                                 // file name
    .filter(f => !(/(^|\/)\.[^\/\.]/g).test(f))                                       // remove files starting with . (macOS .DS_STORE for example)
    .filter(f => [".jpg", ".jpeg", ".gif", ".png", ".bmp"].includes(path.extname(f))) // remove files that are not an image
    .map(f => `${directory}/${f}`);                                                   // rebuild file path

  return files;
}

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
  }
  return a;
}