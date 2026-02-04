#!/bin/bash
chmod -R 755 .
find . -type f -exec chmod 644 {} \;
find . -type f -name "*.sh" -exec chmod 755 {} \;
