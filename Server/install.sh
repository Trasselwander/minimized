#!/usr/bin/sh
path=$(readlink -f mini.service)

systemctl enable ${path}
systemctl start mini.service

echo "Done installing mini.service"