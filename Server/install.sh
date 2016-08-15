#!/bin/bash          

ln -s mini.service /etc/systemd/system/mini.service #should probably be installed somewhere else in userspace.

systemctl enable mini.service
systemctl start mini.service

echo "Done installing mini.service"