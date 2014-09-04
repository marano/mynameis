#!/usr/bin/env bash
# 
# Adapted from https://gist.github.com/rafaelrinaldi/3850548

for f in psd/*.psd;
do
  base=${f%\.*};
  convert $f -background transparent -flatten $base.png
  mv psd/*.png png
done
