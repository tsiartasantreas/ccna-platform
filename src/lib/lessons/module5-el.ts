export const module5LessonsEl: Record<number, { objectives: string[]; keyTerms: { term: string; definition: string }[]; content: string }> = {
  1: {
    objectives: [
      "Να αναγνωρίζετε κοινές απειλές ασφάλειας δικτύου",
      "Να διακρίνετε μεταξύ ενεργών και παθητικών επιθέσεων",
      "Να περιγράφετε τεχνικές αναγνώρισης",
      "Να αναγνωρίζετε τακτικές κοινωνικής μηχανικής",
      "Να κατανοείτε στρατηγικές άμυνας σε βάθος",
    ],
    keyTerms: [
      { term: "DoS (Denial of Service)", definition: "Επίθεση που υπερφορτώνει σύστημα με κίνηση" },
      { term: "MITM (Man-in-the-Middle)", definition: "Επίθεση όπου ο επιτιθέμενος υποκλέπτει επικοινωνία" },
      { term: "Spoofing", definition: "Παραποίηση δεδομένων δικτύου" },
      { term: "Reconnaissance", definition: "Προκαταρκτική φάση συλλογής πληροφοριών" },
    ],
    content: `## Επισκόπηση Απειλών Ασφάλειας

## Τύποι Επιθέσεων Δικτύου

| Attack Type | Description | Example |
|-------------|-------------|---------|
| **Ενεργή** | Τροποποίηση δεδομένων ή διακοπή λειτουργίας | DoS, MITM |
| **Παθητική** | Παρακολούθηση χωρίς τροποποίηση | Packet sniffing |

## Επιθέσεις DoS

- **SYN Flood**: Εξάντληση πίνακα συνδέσεων
- **UDP Flood**: Μαζική αποστολή πακέτων UDP
- **Ping of Death**: Παραμορφωμένα πακέτα ping

## Αναγνώριση (Reconnaissance)

- **Packet sniffing**: Χρήση Wireshark
- **Ping sweeps**: Σάρωση ζωντανών hosts
- **Port scanning**: Εντοπισμός ανοιχτών θυρών

## Spoofing

- **IP Spoofing**: Παραποίηση πηγαίας IP
- **MAC Spoofing**: Αλλαγή MAC
- **ARP Spoofing**: Παραποίηση ARP μηνυμάτων

## Κοινωνική Μηχανική

- **Phishing**: Ψεύτικα email
- **Vishing**: Τηλεφωνική απάτη
- **Tailgating**: Φυσική παρακολούθηση

## Άμυνας σε Βάθος

1. **Φυσική ασφάλεια** — κλειδωμένοι θάλαμοι
2. **Ασφάλεια δικτύου** — firewall, ACLs, VLANs
3. **Ασφάλεια host** — λογισμικό προστασίας
4. **Ασφάλεια εφαρμογών** — έλεγχος εισόδου
5. **Εκπαίδευση χρηστών** — ενημέρωση ασφάλειας`,
  },

  2: {
    objectives: [
      "Να διαμορφώνετε τυπικές και εκτεταμένες ACL",
      "Να δημιουργείτε named ACLs",
      "Να υπολογίζετε wildcard masks",
      "Να εξηγείτε implicit deny και σειρά επεξεργασίας ACL",
    ],
    keyTerms: [
      { term: "ACL", definition: "Access Control List — κανόνες που επιτρέπουν ή απαγορεύουν κίνηση" },
      { term: "Wildcard Mask", definition: "32-bit τιμή αντίστροφη μάσκας υποδικτύου" },
      { term: "Implicit Deny", definition: "Αόρατη εγγραφή στο τέλος κάθε ACL που απορρίπτει όλα" },
      { term: "Standard ACL", definition: "Φιλτράρισμα μόνο βάσει IP πηγής (1-99)" },
      { term: "Extended ACL", definition: "Φιλτράρισμα βάσει IP, πρωτοκόλλου, θυρών (100-199)" },
    ],
    content: `## Access Control Lists (ACLs)

Τα **ACLs** είναι ταξινομημένες λίστες εντολών **permit** ή **deny**.

## Πώς Λειτουργούν ACLs

1. Αν ταίριασμα με ACE → άμεση ενέργεια
2. Επεξεργασία σταματά στο πρώτο ταίριασμα
3. Αν κανένα ταίριασμα → **implicit deny**

## Τύποι ACL

| ACL Type | Number Range | Filters On |
|----------|-------------|------------|
| Standard Numbered | 1-99 | IP πηγής |
| Extended Numbered | 100-199 | IP, πρωτόκολλο, θύρες |
| Standard Named | name | IP πηγής |
| Extended Named | name | IP, πρωτόκολλο, θύρες |

## Standard ACL

\`\`\`
Router(config)# access-list 10 permit 192.168.1.0 0.0.0.255
Router(config)# access-list 10 permit host 10.0.0.5
Router(config)# access-list 10 deny any
Router(config)# interface GigabitEthernet0/1
Router(config-if)# ip access-group 10 out
\`\`\`

## Extended ACL

\`\`\`
Router(config)# access-list 100 deny tcp 192.168.1.0 0.0.0.255 10.0.0.0 0.255.255.255 eq 80
Router(config)# access-list 100 permit ip any any
Router(config)# interface GigabitEthernet0/0
Router(config-if)# ip access-group 100 in
\`\`\`

## Wildcard Masks

| Subnet Mask | Wildcard Mask |
|-------------|---------------|
| 255.255.255.0 (/24) | 0.0.0.255 |
| 255.255.255.252 (/30) | 0.0.0.3 |

## Named ACLs

\`\`\`
Router(config)# ip access-list extended RESTRICT_WEB
Router(config-ext-nacl)# deny tcp 192.168.1.0 0.0.0.255 any eq 80
Router(config-ext-nacl)# permit ip any any
Router(config)# interface GigabitEthernet0/0
Router(config-if)# ip access-group RESTRICT_WEB in
\`\`\`

## Επαλήθευση

\`\`\`
Router# show access-lists
Router# show ip interface GigabitEthernet0/0
\`\`\`

## Καλύτερες Πρακτικές

1. Extended ACLs κοντά στην **πηγή**, standard ACLs κοντά στον **προορισμό**
2. Πάντα λογαριασμός implicit deny
3. Τεκμηρίωση με remark`,
  },

  3: {
    objectives: [
      "Να διαμορφώνετε port security σε switch Cisco",
      "Να εξηγείτε τρεις λειτουργίες παραβίασης",
      "Να διαμορφώνετε sticky MAC",
      "Να κατανοείτε DHCP snooping",
    ],
    keyTerms: [
      { term: "Port Security", definition: "Λειτουργία ασφάλειας Επιπέδου 2 που περιορίζει ποιες MAC επιτρέπονται ανά θύρα" },
      { term: "Sticky MAC", definition: "Αυτόματη μάθηση και μόνιμη αποθήκευση MAC" },
      { term: "DHCP Snooping", definition: "Λειτουργία ασφάλειας που φιλτράρει μη αξιόπιστα μηνύματα DHCP" },
    ],
    content: `## Port Security

### Ενεργοποίηση

\`\`\`
Switch(config)# interface FastEthernet0/1
Switch(config-if)# switchport mode access
Switch(config-if)# switchport port-security
Switch(config-if)# switchport port-security maximum 2
\`\`\`

### Sticky MAC

\`\`\`
Switch(config-if)# switchport port-security mac-address sticky
\`\`\`

### Λειτουργίες Παραβίασης

| Mode | Action |
|------|--------|
| **protect** | Απόρριψη πακέτων άγνωστων MAC |
| **restrict** | Απόρριψη + syslog/SNMP |
| **shutdown** | Απενεργοποίηση θύρας (προεπιλογή) |

### Επαλήθευση

\`\`\`
Switch# show port-security
Switch# show port-security interface FastEthernet0/1
\`\`\`

---

## DHCP Snooping

### Διαμόρφωση

\`\`\`
Switch(config)# ip dhcp snooping
Switch(config)# ip dhcp snooping vlan 10,20,30
Switch(config)# interface GigabitEthernet0/1
Switch(config-if)# ip dhcp snooping trust
Switch(config)# interface FastEthernet0/1
Switch(config-if)# ip dhcp snooping limit rate 15
\`\`\`

### Επαλήθευση

\`\`\`
Switch# show ip dhcp snooping
Switch# show ip dhcp snooping binding
\`\`\``,
  },

  4: {
    objectives: [
      "Να εξηγείτε τα τρία στοιχεία AAA",
      "Να διαμορφώνετε τοπικό AAA",
      "Να περιγράφετε RADIUS και TACACS+",
      "Να διαμορφώνετε 802.1X",
    ],
    keyTerms: [
      { term: "AAA", definition: "Authentication, Authorization, and Accounting" },
      { term: "RADIUS", definition: "Ανοιχτό πρότυπο AAA, UDP 1812/1813" },
      { term: "TACACS+", definition: "Ιδιόκτητο Cisco AAA, TCP 49" },
      { term: "802.1X", definition: "Πρότυπο ελέγχου πρόσβασης βάσει θύρας" },
    ],
    content: `## AAA

### Authentication — "Ποιος είσαι;"
### Authorization — "Τι σου επιτρέπεται;"
### Accounting — "Τι έκανες;"

## RADIUS vs TACACS+

| Feature | RADIUS | TACACS+ |
|---------|--------|---------|
| Πρότυπο | Ανοιχτό | Cisco ιδιόκτητο |
| Μεταφορά | UDP | TCP |
| Κρυπτογράφηση | Κωδικός μόνο | Ολόκληρο πακέτο |
| Καλύτερο για | 802.1X, VPN | Διαχείριση συσκευών |

## Διαμόρφωση AAA

\`\`\`
Router(config)# aaa new-model
Router(config)# username admin privilege 15 secret Str0ngP@ss!
Router(config)# aaa authentication login default local
Router(config)# aaa authorization exec default local
\`\`\`

## 802.1X

### Ρόλοι

1. **Supplicant**: Η συσκευή-πελάτης
2. **Authenticator**: Το switch
3. **Authentication Server**: Ο διακομιστής RADIUS

### Διαμόρφωση

\`\`\`
Switch(config)# aaa new-model
Switch(config)# aaa authentication dot1x default group radius
Switch(config)# dot1x system-auth-control
Switch(config)# interface FastEthernet0/1
Switch(config-if)# switchport mode access
Switch(config-if)# authentication port-control auto
Switch(config-if)# dot1x pae authenticator
\`\`\``,
  },

  5: {
    objectives: [
      "Να διακρίνετε μεταξύ site-to-site και remote access VPN",
      "Να εξηγείτε IPSec και GRE",
      "Να διαμορφώνετε zone-based firewall",
    ],
    keyTerms: [
      { term: "VPN", definition: "Δημιουργία κρυπτογραφημένου tunnel μέσω δημόσιου δικτύου" },
      { term: "IPSec", definition: "Πλαίσιο πρωτοκόλλων κρυπτογράφησης και πιστοποίησης IP" },
      { term: "GRE", definition: "Generic Routing Encapsulation — tunneling πρωτόκολλο" },
      { term: "Zone-Based Firewall", definition: "Λειτουργία ασφάλειας Cisco IOS με ζώνες" },
    ],
    content: `## VPN

### Site-to-Site VPN
- Μόνιμο tunnel μεταξύ δρομολογητών
- Όλη η κίνηση μεταξύ sites περνά μέσω tunnel

### Remote Access VPN
- Μεμονωμένοι χρήστες συνδέονται με VPN client
- SSL/TLS ή IPSec

## IPSec

### Υπηρεσίες Ασφάλειας

1. **Εμπιστευτικότητα (Κρυπτογράφηση)**: AES
2. **Πιστοποίηση**: PSK ή πιστοποιητικά
3. **Ακεραιότητα**: SHA-256

### Διαμόρφωση Site-to-Site IPSec VPN

\`\`\`
! Βήμα 1: Κίνηση
Router(config)# ip access-list extended VPN_TRAFFIC
Router(config-ext-nacl)# permit ip 192.168.1.0 0.0.0.255 192.168.2.0 0.0.0.255

! Βήμα 2: IKE Phase 1
Router(config)# crypto isakmp policy 10
Router(config-isakmp)# encryption aes 256
Router(config-isakmp)# hash sha256
Router(config-isakmp)# authentication pre-share
Router(config-isakmp)# group 14

! Βήμα 3: Pre-shared key
Router(config)# crypto isakmp key Pr3\$haredK3y address 203.0.113.2

! Βήμα 4: IPSec Transform Set
Router(config)# crypto ipsec transform-set MY_TRANSFORM esp-aes 256 esp-sha256-hmac
Router(cfg-crypto-trans)# mode tunnel

! Βήμα 5: Crypto map
Router(config)# crypto map MY_VPN 10 ipsec-isakmp
Router(config-crypto-map)# set peer 203.0.113.2
Router(config-crypto-map)# set transform-set MY_TRANSFORM
Router(config-crypto-map)# match address VPN_TRAFFIC

! Βήμα 6: Εφαρμογή
Router(config)# interface GigabitEthernet0/0
Router(config-if)# crypto map MY_VPN
\`\`\`

## Zone-Based Firewall

\`\`\`
Router(config)# zone security INSIDE
Router(config)# zone security OUTSIDE

Router(config)# interface GigabitEthernet0/0
Router(config-if)# zone-member security INSIDE

Router(config)# interface GigabitEthernet0/1
Router(config-if)# zone-member security OUTSIDE

Router(config)# class-map type inspect match-any INSIDE_TO_OUTSIDE
Router(config-cmap)# match protocol tcp
Router(config-cmap)# match protocol udp

Router(config)# policy-map type inspect INSIDE_TO_OUTSIDE_POLICY
Router(config-pmap)# class type inspect INSIDE_TO_OUTSIDE
Router(config-pmap-c)# inspect

Router(config)# zone-pair security INSIDE_TO_OUTSIDE source INSIDE destination OUTSIDE
Router(config-sec-zone-pair)# service-policy type inspect INSIDE_TO_OUTSIDE_POLICY
\`\`\`

### Ενέργειες ZBF

| Action | Description |
|--------|-------------|
| **Inspect** | Stateful firewall — επιτρέπει επιστροφή κίνησης |
| **Drop** | Σιωπηλή απόρριψη |
| **Pass** | Επιτρέπει χωρίς state tracking |`,
  },
};
