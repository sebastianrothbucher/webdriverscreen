# webdriverscreen

Screenshot comparisons using webdriver.io (w/out Selenium)

## Prereq: ImageMagick

on a Mac via ```brew install imagemagick``` or from the [ImageMagick website](https://www.imagemagick.org/script/index.php)

## Prereq: nodeJS

The program runs on node - so, you need [nodeJS](https://nodejs.org/en/)

## Installing

Download this repo, run ```npm install``` and customize the settings. Per se, you have

```
const URL = 'http://127.0.0.1';
const THRESHOLD = 0.001;
```

Then, run via ```npm run crtscreen``` or ```node createscreenshot.js```

## getting the screenshot automatically

Run the program once to get *screen_yyyymmdd_hhmm.png*, save it as *refscreen.png*. 

Every next run of the program produces *screen_yyyymmdd_hhmm.png* and *screen_yyyymmdd_hhmm_diff.png* with differences are marked in red. Also, when 

## without the tool: using devtools and *magick* directly

can take full-page screenshots via ```Meta-Shift-P``` + *Capture full-size screenshot*

can then compare with 

```
magick compare -verbose -metric MAE -fuzz 10% 1.png 2.png diff.png
1.png PNG 2506x6950 2506x6950+0+0 8-bit sRGB 6.98163MiB 0.670u 0:00.680
2.png PNG 2506x6950 2506x6950+0+0 8-bit sRGB 7297990B 0.700u 0:00.730
Image: 1.png
  Channel distortion: MAE
    red: 91.9748 (0.00140345)
    green: 90.2306 (0.00137683)
    blue: 90.9645 (0.00138803)
    alpha: 0 (0)
    all: 68.2925 (0.00104208)
1.png=>diff.png PNG 2506x6950 2506x6950+0+0 8-bit sRGB 2.80451MiB 4.600u 0:04.740
```

Here, approx one in a thousand pixels is substantially different (which is a lot). Also, there's a diff being rendered with differences marked in red.
