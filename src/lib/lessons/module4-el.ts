export const module4LessonsEl: Record<number, { objectives: string[]; keyTerms: { term: string; definition: string }[]; content: string }> = {
  1: {
    objectives: [
      "Να εξηγείτε τον σκοπό DHCP και πώς απλοποιεί τη διαχείριση διευθύνσεων IP",
      "Να περιγράφετε τη διαδικασία DORA (Discover, Offer, Request, Acknowledge)",
      "Να διαμορφώνετε δρομολογητή Cisco ως διακομιστή DHCP",
      "Να εξηγείτε λειτουργία relay agent DHCP και να διαμορφώνετε ip helper-address",
    ],
    keyTerms: [
      { term: "DHCP", definition: "Dynamic Host Configuration Protocol — πρωτόκολλο που αυτόματα αντιστοιχίζει διευθύνσεις IP και παραμέτρους δικτύου" },
      { term: "DORA", definition: "Η τετράβημη διαδικασία DHCP: Discover, Offer, Request, Acknowledge" },
      { term: "DHCP Relay Agent", definition: "Λειτουργία δρομολογητή (ip helper-address) που προωθεί broadcast DHCP σε διακομιστή σε διαφορετικό υποδίκτυο" },
    ],
    content: `## Τι Είναι DHCP;

Το **DHCP** αυτόματα παρέχει ρυθμίσεις IP σε hosts. Λειτουργεί σε **UDP θύρες 67 (διακομιστής)** και **68 (πελάτης)**.

## Η Διαδικασία DORA

### Βήμα 1 — Discover
Ο πελάτης στέλνει **broadcast** για εύρεση διακομιστών DHCP.

### Βήμα 2 — Offer
Ο διακομιστής απαντά με προτεινόμενη IP.

### Βήμα 3 — Request
Ο πελάτης αποδέχεται μία προσφορά.

### Βήμα 4 — Acknowledge
Ο διακομιστής επιβεβαιώνει τη μίσθωση.

| Step | Message | Purpose |
|------|---------|---------|
| 1 | Discover | Εύρεση διακομιστών DHCP |
| 2 | Offer | Πρόταση ρυθμίσεων IP |
| 3 | Request | Αποδοχή προσφοράς |
| 4 | Acknowledge | Επιβεβαίωση μίσθωσης |

## Ανανέωση Μίσθωσης

Στο **50%** χρόνου μίσθωσης (T1), ο πελάτης στέλνει unicast Request. Στο **87.5%** (T2), στέλνει broadcast.

## Διαμόρφωση Διακομιστή DHCP σε Cisco Router

\`\`\`
R1(config)# ip dhcp excluded-address 192.168.1.1 192.168.1.10

R1(config)# ip dhcp pool LAN_POOL
R1(dhcp-config)# network 192.168.1.0 255.255.255.0
R1(dhcp-config)# default-router 192.168.1.1
R1(dhcp-config)# dns-server 8.8.8.8 8.8.4.4
R1(dhcp-config)# lease 7
\`\`\`

## DHCP Relay Agent

Τα DHCP Discover είναι **broadcast**. Οι δρομολογητές δεν προωθούν broadcast:

\`\`\`
R1(config)# interface GigabitEthernet0/1
R1(config-if)# ip helper-address 10.0.0.5
\`\`\`

## Επαλήθευση και Αντιμετώπιση Προβλημάτων

\`\`\`
R1# show ip dhcp binding
R1# show ip dhcp pool
PC> ipconfig /all
PC> ipconfig /renew
\`\`\``,
  },

  2: {
    objectives: [
      "Να εξηγείτε τον σκοπό NAT και πώς συντηρεί δημόσιες διευθύνσεις IPv4",
      "Να διακρίνετε μεταξύ inside local, inside global, outside local και outside global",
      "Να διαμορφώνετε static NAT, dynamic NAT και PAT σε δρομολογητή Cisco",
    ],
    keyTerms: [
      { term: "NAT", definition: "Network Address Translation — μετατροπή ιδιωτικών διευθύνσεων IP σε δημόσιες και αντίστροφα" },
      { term: "PAT", definition: "Port Address Translation (NAT overload) — μετατροπή πολλαπλών ιδιωτικών IP σε μία δημόσια με διαφορετικούς αριθμούς θυρών" },
      { term: "Inside Local", definition: "Ιδιωτική IP host στο εσωτερικό δίκτυο (πριν μετάφραση)" },
      { term: "Inside Global", definition: "Δημόσια IP που αντιπροσωπεύει εσωτερικό host (μετά μετάφραση)" },
      { term: "Static NAT", definition: "Μόνιμη αντιστοίχιση 1:1 μεταξύ ιδιωτικής και δημόσιας διεύθυνσης" },
    ],
    content: `## Τι Είναι NAT;

Το **NAT** τροποποιεί πληροφορίες διεύθυνσης IP σε κεφαλίδες πακέτων. Αναπτύχθηκε κυρίως για εξοικονόμηση διευθύνσεων IPv4.

## Τέσσερις Τύποι Διευθύνσεων NAT

| Term | Description | Example |
|------|-------------|---------|
| **Inside Local** | Ιδιωτική IP εσωτερικού host | 192.168.1.10 |
| **Inside Global** | Δημόσια IP εσωτερικού host | 203.0.113.5 |
| **Outside Local** | IP εξωτερικού host όπως φαίνεται εσωτερικά | 8.8.8.8 |
| **Outside Global** | Πραγματική δημόσια IP εξωτερικού host | 8.8.8.8 |

## Τύποι NAT

### Static NAT

\`\`\`
R1(config)# ip nat inside source static 192.168.1.10 203.0.113.5
\`\`\`

### PAT (NAT Overload)

\`\`\`
R1(config)# access-list 1 permit 192.168.1.0 0.0.0.255
R1(config)# ip nat inside source list 1 interface GigabitEthernet0/1 overload
\`\`\`

## Επαλήθευση NAT

\`\`\`
R1# show ip nat translations
R1# show ip nat statistics
\`\`\``,
  },

  3: {
    objectives: [
      "Να εξηγείτε τον σκοπό NTP και πώς συγχρονίζει χρόνο",
      "Να περιγράφετε τα επίπεδα stratum NTP",
      "Να εξηγείτε τον σκοπό και την αρχιτεκτονική Syslog",
      "Να περιγράφετε τα οκτώ επίπεδα σοβαρότητας Syslog",
    ],
    keyTerms: [
      { term: "NTP", definition: "Network Time Protocol — συγχρονισμός ρολογιών συσκευών δικτύου, UDP port 123" },
      { term: "Stratum", definition: "Σύστημα κατάταξης (1-15) που περιγράφει την απόσταση από αξιόπιστη πηγή χρόνου" },
      { term: "Syslog", definition: "Τυποποιημένο πρωτόκολλο καταγραφής μηνυμάτων συστήματος, UDP port 514" },
    ],
    content: `## NTP (Network Time Protocol)

### Γιατί Σημασία Έχει ο Συγχρονισμός Χρόνου

- **Συσχέτιση αρχείων καταγραφής** — Απαραίτητη για εντοπισμό προβλημάτων
- **Ασφάλεια** — Πιστοποιητικά, Kerberos εξαρτώνται από ακριβή ρολόι
- **Forensics** — Ακριβή timestamps για έρευνα

### Επίπεδα Stratum

| Stratum | Description |
|---------|-------------|
| 0 | Ατομικά ρολόια, GPS |
| 1 | Άμεσα συνδεδεμένο σε stratum 0 |
| 2-15 | Αντίστοιχα επίπεδα |
| 16 | Μη συγχρονισμένο |

### Διαμόρφωση NTP

\`\`\`
R1(config)# ntp server 203.0.113.10
R1(config)# ntp source Loopback0
R1(config)# ntp authenticate
R1(config)# ntp authentication-key 1 md5 MyNtpPassword
\`\`\`

---

## Syslog

### Επίπεδα Σοβαρότητας Syslog

| Level | Severity | Keyword | Description |
|-------|----------|---------|-------------|
| 0 | Emergency | emerg | Μη λειτουργικό σύστημα |
| 1 | Alert | alert | Άμεση ενέργεια |
| 2 | Critical | crit | Κρίσιμες συνθήκες |
| 3 | Error | err | Συνθήκες σφάλματος |
| 4 | Warning | warning | Συνθήκες προειδοποίησης |
| 5 | Notification | notice | Κανονικές αλλά σημαντικές |
| 6 | Informational | info | Πληροφοριακά |
| 7 | Debug | debug | Επίπεδο εντοπισμού σφαλμάτων |

### Διαμόρφωση Syslog

\`\`\`
R1(config)# logging host 10.0.0.100
R1(config)# logging trap informational
R1(config)# logging source-interface Loopback0
R1(config)# logging buffered 16000 informational
\`\`\``,
  },

  4: {
    objectives: [
      "Να εξηγείτε τον σκοπό SNMP και τον ρόλο του στη διαχείριση δικτύου",
      "Να διακρίνετε μεταξύ SNMPv1, SNMPv2c και SNMPv3",
      "Να περιγράφετε QoS και γιατί χρειάζεται",
      "Να εξηγείτε DSCP και CoS",
    ],
    keyTerms: [
      { term: "SNMP", definition: "Simple Network Management Protocol — παρακολούθηση και διαχείριση συσκευών, UDP 161/162" },
      { term: "QoS", definition: "Quality of Service — τεχνικές διαχείρισης κίνησης δικτύου με προτεραιοποίηση" },
      { term: "DSCP", definition: "Differentiated Services Code Point — 6-bit πεδίο στην κεφαλίδα IP για ταξινόμηση πακέτων" },
    ],
    content: `## SNMP

### Αρχιτεκτονική SNMP

| Component | Role |
|-----------|------|
| **SNMP Manager (NMS)** | Σταθμός διαχείρισης |
| **SNMP Agent** | Λογισμικό στη συσκευή |
| **MIB** | Βάση δεδομένων διαχειριζόμενων αντικειμένων |

### Εκδοχές SNMP

| Feature | SNMPv1 | SNMPv2c | SNMPv3 |
|---------|--------|---------|--------|
| Πιστοποίηση | Community string | Community string | Username/password |
| Κρυπτογράφηση | Καμία | Καμία | Ναι (AES) |
| Συνιστάται | Όχι | Όχι | **Ναι** |

\`\`\`
! SNMPv3
R1(config)# snmp-server group MY_GROUP v3 auth read MY_VIEW
R1(config)# snmp-server user MyUser MY_GROUP v3 auth sha MyPassword123 priv aes 128 MyPrivPassword456
\`\`\`

---

## QoS (Quality of Service)

### Γιατί QoS;

Χωρίς QoS, όλα τα πακέτα αντιμετωπίζονται ίσα. Αυτό προκαλεί προβλήματα σε κορεσμό:
- **Φωνή** γίνεται ασαφής
- **Βίντεο** παγώνει

### Τέσσερις Πυλώνες QoS

| Pillar | Description |
|--------|-------------|
| **Classification** | Αναγνώριση κίνησης |
| **Marking** | Σήμανση πακέτων |
| **Queuing** | Τοποθέτηση σε ουρές |
| **Congestion Management** | Απόφαση μετάδοσης |

### Συνηθισμένες Τιμές DSCP

| DSCP Value | Traffic |
|------------|---------|
| 0 (BE) | Προεπιλεγμένη κίνηση |
| 46 (EF) | Φωνή (υψηλότερη προτεραιότητα) |`,
  },

  5: {
    objectives: [
      "Να εξηγείτε τους κινδύνους ασφάλειας Telnet και γιατί SSH προτιμάται",
      "Να περιγράφετε τη διαδικασία σύνδεσης SSH",
      "Να δημιουργείτε RSA keys και να διαμορφώνετε SSH",
      "Να διαμορφώνετε AAA πιστοποίηση για πρόσβαση SSH",
    ],
    keyTerms: [
      { term: "SSH", definition: "Secure Shell — κρυπτογραφημένο πρωτόκολλο απομακρυσμένης πρόσβασης, TCP port 22" },
      { term: "Telnet", definition: "Παλαιότερο πρωτόκολλο απομακρυσμένης πρόσβασης, TCP port 23, μη ασφαλές" },
      { term: "AAA", definition: "Authentication, Authorization, and Accounting — πλαίσιο ασφάλειας ελέγχου πρόσβασης" },
    ],
    content: `## Telnet vs SSH

| Feature | Telnet | SSH |
|---------|--------|-----|
| Port | TCP 23 | TCP 22 |
| Κρυπτογράφηση | Καμία | Πλήρης |
| Ασφάλεια | **Μη ασφαλές** | **Ασφαλές** |

## Διαμόρφωση SSH

\`\`\`
R1(config)# hostname CCNA-R1
CCNA-R1(config)# ip domain-name example.com
CCNA-R1(config)# crypto key generate rsa general-keys modulus 2048
CCNA-R1(config)# username admin privilege 15 secret MySecurePassword
CCNA-R1(config)# line vty 0 4
CCNA-R1(config-line)# transport input ssh
CCNA-R1(config-line)# login local
CCNA-R1(config-line)# exec-timeout 10 0
CCNA-R1(config)# ip ssh version 2
CCNA-R1(config)# ip ssh authentication-retries 3
CCNA-R1(config)# ip ssh time-out 60
\`\`\`

## AAA Authentication

\`\`\`
CCNA-R1(config)# aaa new-model
CCNA-R1(config)# aaa authentication login SSH_AUTH local
CCNA-R1(config)# line vty 0 4
CCNA-R1(config-line)# transport input ssh
CCNA-R1(config-line)# login authentication SSH_AUTH
\`\`\`

## Σύνδεση SSH

\`\`\`
ssh admin@192.168.1.1
\`\`\`

## Επαλήθευση

\`\`\`
CCNA-R1# show ip ssh
CCNA-R1# show ssh
\`\`\`

**Βασικά σημεία:**
- **Ποτέ Telnet** σε παραγωγή
- RSA keys **τουλάχιστον 2048-bit**
- Χρήση **access-class** σε VTY lines`,
  },
};
