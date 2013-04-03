misc
====

Linux open port
iptables -I INPUT -p tcp -m tcp --dport PORTNUMBER -j ACCEPT

Symbolic Link
ln -s {/path/to/file-name} {link-name}

SCP Example
scp your_username@remotehost.edu:foobar.txt /some/local/directory