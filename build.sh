#!/bin/sh

mogrify -resize 1024x600\> -path ./photos -format jpg ./photos/*.jpg
./node_modules/.bin/imagemin ./photos/* ./photos/
echo "var images = [" > scripts/images.js
FILES=./photos/*.*
for f in $FILES
do
  echo "'$f',"  >> scripts/images.js
done
echo "];" >> scripts/images.js