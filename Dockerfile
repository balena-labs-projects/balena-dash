FROM richbayliss/balena-wpe-base:latest

COPY public_html /var/lib/public_html

ENV WPE_URL="file:///var/lib/public_html/index.html"