# Welcome to Attack-Defense CTF!

tl;dr:

ssh team005@10.80.5.2
password: at2fS26Sov3yZtgXZQvFiJtGQIQolAh8
flag submission token: cc7f5de9678975e2

---

## Detailed instructions:

1. Connect to the VPN:
  - Install wireguard: `sudo apt-get update && sudo apt-get install -y wireguard`
  - Choose any of the `team005_X.conf` files. Each team member must use their own config!
  - Connect to the VPN: `sudo wg-quick up ./team005_X.conf`

2. [Cloud-Hosted] Connect to the vulnbox:
  - ssh to the vulnbox: `ssh team005@10.80.5.2`
  - password: `at2fS26Sov3yZtgXZQvFiJtGQIQolAh8`


3. Inspect the services and find vulnerabilities
  - Fix vunlerablities in your services without breaking their functionality and logic
  - Create scripts to automate exploitation of vulnerabilities in your opponents' services
4. Interact with the jury system and other teams:
  - Get attack data:
    ```
    curl http://10.10.10.10/api/client/attack_data
    ```
  - Submit flags using `cc7f5de9678975e2` as your token:
    ```
    curl -X PUT --data '["DGTMA80AXCBCYPKILB527YTH970ICOI="]' -H "X-Team-Token: cc7f5de9678975e2" http://10.10.10.10/flags
    ```

### Game configuration:
- Round time: 60 seconds
- Flag lifetime: 10 rounds
- Public scoreboard is available at https://live.mephictf.ru
- Flag submission protocol is `ructf_http`
- Network opens at 2025-04-26 11:00:00 using Europe/Moscow timezone

### VPN network structure:
- Jury system (ForcAD): `10.10.10.10`
- Vulnboxes: `10.80.[0-12].2`

Good luck, have fun!