export const module2LessonsEl: Record<number, { objectives: string[]; keyTerms: { term: string; definition: string }[]; content: string }> = {
  1: {
    objectives: [
      "Να κατανοείτε τη μορφή και τα συστατικά πλαισίου Ethernet",
      "Να αναγνωρίζετε τη δομή διεύθυνσης MAC και τους τύπους",
      "Να συγκρίνετε τομές συγκρούσεων και τομές broadcast",
      "Να εξηγείτε πώς λειτουργεί το Ethernet στο Επίπεδο 2",
    ],
    keyTerms: [
      { term: 'Διεύθυνση MAC', definition: 'Μια διεύθυνση υλικού 48-bit ενσωματωμένη σε κάρτα δικτύου (π.χ., AA:BB:CC:DD:EE:FF)' },
      { term: 'Πλαίσιο Ethernet', definition: 'Το PDU Επιπέδου 2 που περιέχει MAC προορισμού/πηγής, τύπο, δεδομένα και FCS' },
      { term: 'Τομή Συγκρούσεων', definition: 'Ένα τμήμα δικτύου όπου οι συσκευές μπορούν να προκαλέσουν συγκρούσεις μεταξύ τους' },
      { term: 'Τομή Broadcast', definition: 'Ένα τμήμα δικτύου όπου τα πλαίσια broadcast λαμβάνονται από όλες τις συσκευές' },
      { term: 'FCS', definition: 'Frame Check Sequence — ένα πεδίο ουράς που χρησιμοποιείται για ανίχνευση σφαλμάτων (CRC)' },
    ],
    content: `## Θεμελιώδη Στοιχεία Ethernet

Το **Ethernet** (IEEE 802.3) είναι η κυρίαρχη τεχνολογία LAN. Λειτουργεί στο Φυσικό Επίπεδο (Επίπεδο 1) και στο Επίπεδο Σύνδεσης Δεδομένων (Επίπεδο 2) του μοντέλου OSI.

### Μορφή Πλαισίου Ethernet

| Field | Size | Description |
|-------|------|-------------|
| **Preamble** | 7 bytes | Μοτίβο συγχρονισμού (εναλλαγή 1 και 0) |
| **SFD** | 1 byte | Start Frame Delimiter (10101011) |
| **Destination MAC** | 6 bytes | Διεύθυνση MAC δέκτη |
| **Source MAC** | 6 bytes | Διεύθυνση MAC αποστολέα |
| **Type/Length** | 2 bytes | Τύπος πρωτοκόλλου (0x0800 = IPv4) ή μήκος πλαισίου |
| **Data** | 46-1500 bytes | Φορτίο (τα πραγματικά δεδομένα που αποστέλλονται) |
| **FCS** | 4 bytes | Frame Check Sequence για ανίχνευση σφαλμάτων |

**Ελάχιστο μέγεθος πλαισίου:** 64 bytes (συμπεριλαμβανομένων κεφαλίδων)
**Μέγιστο μέγεθος πλαισίου:** 1518 bytes (τυπικό Ethernet)

## Διευθύνσεις MAC

Μια **διεύθυνση MAC** είναι ένα αναγνωριστικό υλικού 48-bit (6-byte) που εκχωρείται σε μια διεπαφή δικτύου.

### Δομή Διεύθυνσης MAC

\`\`\`
AA:BB:CC:DD:EE:FF
│   │   │   │   │   │
│   │   └───┘   └───┘
│   │      │       │
│   │      │       └─ Device ID (αντιστοιχίζεται από τον κατασκευαστή)
│   └──────┘
│       │
│       └─ Device ID (24 bits)
│
└─ OUI (Organizationally Unique Identifier) - 24 bits
   Αντιστοιχίζεται από IEEE σε κατασκευαστές
\`\`\`

### Τύποι Διευθύνσεων MAC

- **Unicast** — Πλαίσιο που αποστέλλεται σε μία συγκεκριμένη συσκευή (bit 0 του πρώτου byte = 0)
- **Broadcast** — Πλαίσιο που αποστέλλεται σε όλες τις συσκευές (FF:FF:FF:FF:FF:FF)
- **Multicast** — Πλαίσιο που αποστέλλεται σε ομάδα συσκευών (bit 1 του πρώτου byte = 1)

## Τομές Συγκρούσεων vs Τομές Broadcast

### Τομή Συγκρούσεων

Μια **τομή συγκρούσεων** είναι ένα τμήμα δικτύου όπου δύο συσκευές που μεταδίδουν ταυτόχρονα μπορούν να προκαλέσουν σύγκρουση.

- **Hub** — Όλες οι θύρες είναι ΜΙΑ τομή συγκρούσεων (κοινόχρηστη)
- **Switch** — Κάθε θύρα είναι η ΔΙΚΗ ΤΗΣ τομή συγκρούσεων (μικρο-τμηματοποίηση)
- **Router** — Κάθε διεπαφή είναι η δική του τομή συγκρούσεων

### Τομή Broadcast

Μια **τομή broadcast** είναι ένα τμήμα δικτύου όπου ένα πλαίσιο broadcast λαμβάνεται από όλες τις συσκευές.

- **Switch** — Όλες οι θύρες στο ίδιο VLAN είναι ΜΙΑ τομή broadcast
- **Router** — Κάθε διεπαφή είναι η ΔΙΚΗ ΤΗΣ τομή broadcast (τα broadcast δεν περνούν από δρομολογητές)

> **Βασική επισήμανση:** Τα switches μειώνουν τις τομές συγκρούσεων. Οι δρομολογητές μειώνουν τις τομές broadcast.

### Παράδειγμα

\`\`\`
[Hub] ─── Όλες οι 4 θύρες = 1 τομή συγκρούσεων, 1 τομή broadcast

[Switch] ─── Κάθε θύρα = ξεχωριστή τομή συγκρούσεων
              Όλες οι θύρες (ίδιο VLAN) = 1 τομή broadcast

[Router] ─── Κάθε διεπαφή = ξεχωριστή τομή συγκρούσεων ΚΑΙ τομή broadcast
\`\`\`

## Πρότυπα Ethernet

| Standard | Speed | Name | Cable | Distance |
|----------|-------|------|-------|----------|
| 802.3 | 10 Mbps | Ethernet | Coax/UTP | 100m |
| 802.3u | 100 Mbps | Fast Ethernet | Cat 5 UTP | 100m |
| 802.3ab | 1 Gbps | Gigabit Ethernet | Cat 5e UTP | 100m |
| 802.3an | 10 Gbps | 10 Gigabit Ethernet | Cat 6a UTP | 100m |
| 802.3ba | 40/100 Gbps | 40/100 Gigabit | Fiber | Ποικίλλει |`,
  },
  2: {
    objectives: [
      "Να περιγράφετε πώς ένα switch μαθαίνει διευθύνσεις MAC",
      "Να εξηγείτε τις διαδικασίες προώθησης, πλημμύρισμα και γήρανσης του switch",
      "Να κατανοείτε τον πίνακα διευθύνσεων MAC",
      "Να διαμορφώνετε και να επαληθεύετε λειτουργίες switch",
    ],
    keyTerms: [
      { term: 'Μάθηση MAC', definition: 'Η διαδικασία καταγραφής από το switch των διευθύνσεων MAC πηγής και των σχετικών θυρών' },
      { term: 'Προώθηση', definition: 'Αποστολή πλαισίου από τη θύρα όπου μαθεύτηκε η MAC προορισμού' },
      { term: 'Πλημμύρισμα', definition: 'Αποστολή πλαισίου σε όλες τις θύρες εκτός της πηγής όταν η MAC προορισμού είναι άγνωστη' },
      { term: 'Γήρανση', definition: 'Η διαδικασία αφαίρεσης εγγραφών διευθύνσεων MAC μετά από χρονικό όριο' },
      { term: 'Πίνακας CAM', definition: 'Content Addressable Memory table — αποθηκεύει τις αντιστοιχίσεις διεύθυνσης MAC σε θύρα' },
    ],
    content: `## Λειτουργίες Switch

Ένα **switch** είναι μια συσκευή Επιπέδου 2 που προωθεί πλαίσια βάσει διευθύνσεων MAC. Σε αντίθεση με τα hub, τα switches παρέχουν αφιερωμένο εύρος ζώνης ανά θύρα και μειώνουν τις συγκρούσεις.

### Πώς ένα Switch Μαθαίνει Διευθύνσεις MAC

Όταν ένα switch λαμβάνει ένα πλαίσιο, ακολουθεί αυτή τη διαδικασία:

1. **Μάθηση:** Καταγράφει τη **διεύθυνση MAC πηγής** και την εισερχόμενη θύρα στον πίνακα διευθύνσεων MAC
2. **Προώθηση/Πλημμύρισμα:** Αναζητά τη **διεύθυνση MAC προορισμού** στον πίνακα
   - Αν βρεθεί → **Προώθηση** του πλαισίου στη συγκεκριμένη θύρα
   - Αν δεν βρεθεί → **Πλημμύρισμα** του πλαισίου σε όλες τις θύρες (εκτός της πηγής)
3. **Φιλτράρισμα:** Αν πηγή και προορισμός είναι στην ίδια θύρα, απορρίπτει το πλαίσιο

### Πίνακας Διευθύνσεων MAC (CAM Table)

\`\`\`
Switch# show mac address-table
          Mac Address Table
-------------------------------------------
Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
1       aabb.cc00.0100    DYNAMIC     Gi0/0
1       aabb.cc00.0200    DYNAMIC     Gi0/1
1       aabb.cc00.0300    DYNAMIC     Gi0/2
\`\`\`

**Τύποι εγγραφών:**
- **DYNAMIC** — Αυτόματη μάθηση (προεπιλεγμένη γήρανση: 300 δευτερόλεπτα)
- **STATIC** — Χειροκίνητη διαμόρφωση από διαχειριστή

### Γήρανση Διευθύνσεων MAC

Οι διευθύνσεις MAC αφαιρούνται από τον πίνακα μετά τη λήξη του **χρονομέτρου γήρανσης** (προεπιλογή: 300 δευτερόλεπτα). Αυτό εξασφαλίζει ότι ο πίνακας παραμένει ενημερωμένος καθώς οι συσκευές μετακινούνται μεταξύ θυρών.

\`\`\`
! Αλλαγή χρόνου γήρανσης
Switch(config)# mac address-table aging-time 600
\`\`\`

## Απόφαση Επεξεργασίας Πλαισίου

Όταν ένα switch λαμβάνει ένα πλαίσιο:

| Condition | Action |
|-----------|--------|
| Γνωστό unicast (MAC προορισμού στον πίνακα) | Προώθηση σε συγκεκριμένη θύρα |
| Άγνωστο unicast (MAC προορισμού εκτός πίνακα) | Πλημμύρισμα σε όλες τις θύρες ίδιου VLAN |
| Broadcast (FF:FF:FF:FF:FF:FF) | Πλημμύρισμα σε όλες τις θύρες ίδιου VLAN |
| Γνωστό multicast | Πλημμύρισμα σε όλες τις θύρες (ή ομάδα multicast) |

## Βασική Διαμόρφωση Switch

\`\`\`
! Ορισμός hostname
Switch(config)# hostname SW1

! Διαμόρφωση ταχύτητας και duplex διεπαφής
SW1(config)# interface GigabitEthernet0/0
SW1(config-if)# speed 1000
SW1(config-if)# duplex full

! Ορισμός περιγραφής διεπαφής
SW1(config-if)# description Connection to PC1

! Ενεργοποίηση/απενεργοποίηση διεπαφής
SW1(config-if)# shutdown
SW1(config-if)# no shutdown
\`\`\`

### Επαλήθευση Λειτουργιών Switch

\`\`\`
! Εμφάνιση πίνακα διευθύνσεων MAC
show mac address-table

! Εμφάνιση κατάστασης διεπαφών
show interfaces status

! Εμφάνιση λεπτομερειών διεπαφής
show interfaces GigabitEthernet0/0

! Εκκαθάριση πίνακα διευθύνσεων MAC
clear mac address-table dynamic
\`\`\`

## Μέθοδοι Προώθησης Switch

| Method | Description | Latency |
|--------|-------------|---------|
| **Store-and-Forward** | Λαμβάνει ολόκληρο το πλαίσιο, ελέγχει CRC, στη συνέχεια προωθεί | Υψηλότερο (πιο αξιόπιστο) |
| **Cut-Through** | Προθεί μετά την ανάγνωση μόνο της MAC προορισμού | Χαμηλότερο (λιγότερο αξιόπιστο) |
| **Fragment-Free** | Λαμβάνει τα πρώτα 64 bytes πριν την προώθηση | Μεσαίο

> Τα σύγχρονα switches χρησιμοποιούν **store-and-forward** από προεπιλογή για αξιοπιστία.`,
  },
  3: {
    objectives: [
      "Να κατανοείτε έννοιες και οφέλη VLAN",
      "Να διαμορφώνετε θύρες πρόσβασης και trunk",
      "Να εξηγείτε την ενθυλάκωση 802.1Q",
      "Να διαμορφώνετε VLAN σε switches Cisco",
    ],
    keyTerms: [
      { term: 'VLAN', definition: 'Εικονικό LAN — μια λογική ομάδοποίηση συσκευών που δημιουργεί ξεχωριστούς τομείς broadcast' },
      { term: 'Θύρα Πρόσβασης', definition: 'Μια θύρα switch που ανήκει σε ένα μοναδικό VLAN και συνδέει τελικές συσκευές' },
      { term: 'Θύρα Trunk', definition: 'Μια θύρα switch που μεταφέρει κίνηση για πολλαπλά VLAN μεταξύ switches' },
      { term: '802.1Q', definition: 'Το πρότυπο IEEE για σήμανση VLAN σε πλαίσια Ethernet' },
      { term: 'Εγγενές VLAN', definition: 'Το VLAN που δεν σημαίνεται σε θύρα trunk (προεπιλογή: VLAN 1)' },
    ],
    content: `## Έννοιες VLAN

Ένα **VLAN (Virtual LAN)** είναι μια λογική ομαδοποίηση συσκευών που δημιουργεί ξεχωριστούς τομείς broadcast, ανεξάρτητα από τη φυσική τοποθεσία.

### Οφέλη VLAN

- **Έλεγχος broadcast** — Τα broadcast παραμένουν εντός του VLAN
- **Ασφάλεια** — Συσκευές σε διαφορετικά VLAN δεν μπορούν να επικοινωνήσουν χωρίς δρομολογητή
- **Ευελιξία** — Οι χρήστες μπορούν να ομαδοποιηθούν λογικά, όχι μόνο φυσικά
- **Απόδοση** — Μειώνει την περιττή κίνηση broadcast
- **Απλοποιημένη διαχείριση** — Αλλαγές μπορούν να γίνουν χωρίς επανακαλωδίωση

### Τύποι VLAN

| Type | ID Range | Description |
|------|----------|-------------|
| **Normal VLANs** | 1-1005 | Τυπικά VLAN (1 είναι προεπιλογή) |
| **Extended VLANs** | 1006-4094 | Υποστηρίζονται σε σύγχρονα switches |
| **Data VLAN** | Ορίζεται από χρήστη | Μεταφέρει κίνηση δεδομένων χρήστη |
| **Management VLAN** | Τυπικά VLAN 1 | Για πρόσβαση διαχείρισης switch |
| **Native VLAN** | Προεπιλογή: VLAN 1 | Μη σημασμένο VLAN σε trunk |

## Θύρες Πρόσβασης vs Θύρες Trunk

### Θύρες Πρόσβασης
- Ανήκει σε **ένα μόνο VLAN**
- Συνδέει τελικές συσκευές (PC, εκτυπωτές, διακομιστές)
- Τα πλαίσια αποστέλλονται **χωρίς σήμανση**

### Θύρες Trunk
- Μεταφέρει κίνηση για **πολλαπλά VLAN**
- Συνδέει switches με switches (ή switches με δρομολογητές)
- Τα πλαίσια **σημαίνονται** με VLAN ID (εκτός εγγενούς VLAN)

### Ενθυλάκωση 802.1Q

Όταν ένα πλαίσιο διασχίζει trunk, εισάγεται μια **ετικέτα 802.1Q 4-byte**:

| Field | Size | Description |
|-------|------|-------------|
| **TPID** | 2 bytes | Tag Protocol ID (0x8100 για 802.1Q) |
| **Priority** | 3 bits | CoS (Class of Service) για QoS |
| **DEI** | 1 bit | Drop Eligible Indicator |
| **VLAN ID** | 12 bits | Αριθμός VLAN (1-4094) |

## Διαμόρφωση VLAN

### Δημιουργία VLAN

\`\`\`
Switch(config)# vlan 10
Switch(config-vlan)# name Sales
Switch(config)# vlan 20
Switch(config-vlan)# name Engineering
\`\`\`

### Αντιστοίχιση Θυρών Πρόσβασης

\`\`\`
Switch(config)# interface GigabitEthernet0/1
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 10
\`\`\`

### Διαμόρφωση Θυρών Trunk

\`\`\`
Switch(config)# interface GigabitEthernet0/24
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk native vlan 99
Switch(config-if)# switchport trunk allowed vlan 10,20,30
\`\`\`

### Επαλήθευση Διαμόρφωσης VLAN

\`\`\`
! Εμφάνιση πληροφοριών VLAN
show vlan brief

! Εμφάνιση κατάστασης trunk
show interfaces trunk

! Εμφάνιση λειτουργίας συγκεκριμένης διεπαφής
show interfaces GigabitEthernet0/1 switchport
\`\`\`

### Δείγμα Εξόδου

\`\`\`
Switch# show vlan brief
VLAN  Name                 Status    Ports
----  --------------------  ------    -----
1     default              active    Gi0/0, Gi0/2, Gi0/3
10    Sales                active    Gi0/1
20    Engineering          active    Gi0/4
\`\`\`

## DTP (Dynamic Trunking Protocol)

Το **DTP** διαπραγματεύεται trunking μεταξύ switches (ιδιόκτητο Cisco):

| Mode | Description |
|------|-------------|
| **dynamic auto** | Θα γίνει trunk αν η άλλη πλευρά είναι trunk ή desirable |
| **dynamic desirable** | Ενεργά προσπαθεί να γίνει trunk |
| **trunk** | Πάντα trunk, στέλνει DTP πλαίσια |
| **access** | Πάντα access, ποτέ trunk |

> **Καλύτερη πρακτική:** Ρυθμίστε ρητά λειτουργίες trunk/access. Απενεργοποιήστε το DTP με \`switchport nonegotiate\`.`,
  },
  4: {
    objectives: [
      "Να κατανοείτε έννοιες και οφέλη EtherChannel",
      "Να διαμορφώνετε EtherChannel με LACP και PAgP",
      "Να εξηγείτε μεθόδους εξισορρόπησης φορτίου",
      "Να επαληθεύετε διαμόρφωση EtherChannel",
    ],
    keyTerms: [
      { term: 'EtherChannel', definition: 'Ομαδοποίηση πολλαπλών φυσικών συνδέσεων σε μία λογική σύνδεση για αυξημένο εύρος ζώνης και πλεονασμό' },
      { term: 'LACP', definition: 'Link Aggregation Control Protocol — πρότυπο IEEE 802.3ad για διαπραγμάτευση EtherChannel' },
      { term: 'PAgP', definition: 'Port Aggregation Protocol — ιδιόκτητο πρωτόκολλο διαπραγμάτευσης EtherChannel της Cisco' },
      { term: 'Εξισορρόπηση Φορτίου', definition: 'Κατανομή κίνησης στις συνδέσεις μέλη EtherChannel βάσει αλγορίθμων hashing' },
    ],
    content: `## Επισκόπηση EtherChannel

Το **EtherChannel** ομαδοποιεί πολλαπλές φυσικές συνδέσεις Ethernet σε μία λογική σύνδεση. Αυτό παρέχει:

- **Αυξημένο εύρος ζώνης** — Συνολικό εύρος ζώνης όλων των συνδέσεων (π.χ., 4x 1Gbps = 4 Gbps)
- **Πλεονασμό** — Αν μια σύνδεση αποτύχει, η κίνηση μεταφέρεται στις υπόλοιπες
- **Εξισορρόπηση φορτίου** — Κατανομή κίνησης στις συνδέσεις μέλη
- **Απλοποιημένο STP** — Το STP βλέπει μία λογική σύνδεση, όχι πολλαπλές φυσικές

### Όρια EtherChannel

- Μέγιστο **8 ενεργές** συνδέσεις ανά EtherChannel (στα περισσότερα switches)
- Μέγιστο **16 συνδέσεις** διαμορφωμένες (8 ενεργές + 8 εφεδρικές)
- Όλες οι συνδέσεις πρέπει να έχουν αντίστοιχες διαμορφώσεις (ταχύτητα, duplex, VLAN, λειτουργία)

## Πρωτόκολλα EtherChannel

### LACP (Link Aggregation Control Protocol)
- **IEEE 802.3ad** πρότυπο (ανοιχτό πρότυπο, πολλών κατασκευαστών)
- Λειτουργίες: **active** (ξεκινά διαπραγμάτευση) ή **passive** (απαντά σε διαπραγμάτευση)
- Τουλάχιστον μία πλευρά πρέπει να είναι **active**

### PAgP (Port Aggregation Protocol)
- **Ιδιόκτητο Cisco**
- Λειτουργίες: **desirable** (ξεκινά) ή **auto** (απαντά)
- Τουλάχιστον μία πλευρά πρέπει να είναι **desirable**

### Static (On)
- Χωρίς πρωτόκολλο διαπραγμάτευσης
- Και οι δύο πλευρές αναγκάζονται σε ομαδοποίηση
- **Δεν συνιστάται** — χωρίς προστασία από εσφαλμένες διαμορφώσεις

## Παραδείγματα Διαμόρφωσης

### Διαμόρφωση LACP

\`\`\`
! Switch 1
Switch1(config)# interface range GigabitEthernet0/1 - 2
Switch1(config-if-range)# channel-group 1 mode active
Switch1(config-if-range)# channel-protocol lacp

! Switch 2
Switch2(config)# interface range GigabitEthernet0/1 - 2
Switch2(config-if-range)# channel-group 1 mode passive
Switch2(config-if-range)# channel-protocol lacp
\`\`\`

### Διαμόρφωση PAgP

\`\`\`
Switch1(config)# interface range GigabitEthernet0/1 - 2
Switch1(config-if-range)# channel-group 1 mode desirable

Switch2(config)# interface range GigabitEthernet0/1 - 2
Switch2(config-if-range)# channel-group 1 mode auto
\`\`\`

## Μέθοδοι Εξισορρόπησης Φορτίου

Η εξισορρόπηση φορτίου EtherChannel χρησιμοποιεί αλγόριθμο hash για καθορισμός της σύνδεσης:

| Method | Hash Based On |
|--------|---------------|
| **src-mac** | Διεύθυνση MAC πηγής |
| **dst-mac** | Διεύθυνση MAC προορισμού |
| **src-dst-mac** | MAC πηγής και προορισμού |
| **src-ip** | Διεύθυνση IP πηγής |
| **dst-ip** | Διεύθυνση IP προορισμού |
| **src-dst-ip** | IP πηγής και προορισμού (προεπιλογή, συνιστάται) |

\`\`\`
! Διαμόρφωση μεθόδου εξισορρόπησης φορτίου
Switch(config)# port-channel load-balance src-dst-ip
\`\`\`

## Επαλήθευση

\`\`\`
! Εμφάνιση σύνοψης EtherChannel
show etherchannel summary

! Εμφάνιση λεπτομερών πληροφοριών port-channel
show etherchannel port-channel

! Εμφάνιση μεθόδου εξισορρόπησης φορτίου
show etherchannel load-balance
\`\`\`

### Δείγμα Εξόδου

\`\`\`
Switch# show etherchannel summary
Flags:  D - down        P - bundled in port-channel
        I - stand-alone s - suspended
        H - Hot-standby (LACP only)
        U - in use      N - not in use

Number of channel-groups in use: 1
Number of aggregators:           1

Group  Port-channel  Protocol    Ports
------+-------------+-----------+-----------------------------------
1      Po1(SU)         LACP      Gi0/1(P)  Gi0/2(P)
\`\`\``,
  },
  5: {
    objectives: [
      "Να κατανοείτε τον σκοπό και τη λειτουργία STP",
      "Να περιγράφετε τη διαδικασία εκλογής root bridge",
      "Να αναγνωρίζετε ρόλους θυρών και καταστάσεις STP",
      "Να διαμορφώνετε βελτιώσεις STP (PortFast, BPDU Guard)",
    ],
    keyTerms: [
      { term: 'STP', definition: 'Spanning Tree Protocol — αποτρέπει βρόχους Επιπέδου 2 μπλοκάροντας πλεονάζουσες διαδρομές' },
      { term: 'Root Bridge', definition: 'Το switch που εκλέγεται ως κεντρικό σημείο αναφοράς στην τοπολογία STP' },
      { term: 'BPDU', definition: 'Bridge Protocol Data Unit — μηνύματα STP που ανταλλάσσονται μεταξύ switches' },
      { term: 'PortFast', definition: 'Μεταβαίνει αμέσως σε κατάσταση προώθησης (μόνο για τελικές συσκευές)' },
      { term: 'BPDU Guard', definition: 'Απενεργοποιεί θύρα αν ληφθούν BPDUs (προστατεύει από μη εξουσιοδοτημένα switches)' },
    ],
    content: `## Γιατί STP;

Το **Spanning Tree Protocol (STP)** αποτρέπει βρόχους Επιπέδου 2 σε δίκτυα με πλεονάζουσες συνδέσεις. Χωρίς STP, τα πλαίσια broadcast θα κυκλοφορούσαν ατέλειωτα, προκαλώντας **καταιγίδα broadcast** που μπορεί να καταστρέψει το δίκτυο.

### Τι Κάνει το STP

1. **Εκλέγει root bridge** — Ένα switch γίνεται το κεντρικό σημείο αναφοράς
2. **Υπολογίζει βέλτιστες διαδρομές** — Καθορίζει τη συντομότερη διαδρομή προς το root bridge
3. **Μπλοκάρει πλεονάζουσες θύρες** - Τοποθετεί ορισμένες θύρες σε κατάσταση μπλοκαρίσματος για αποτροπή βρόχων
4. **Παρέχει αντικατάσταση** - Αν μια ενεργή σύνδεση αποτύχει, μια μπλοκαρισμένη θύρα μπορεί να μεταβεί σε προώθηση

## Εκλογή Root Bridge

Το switch με το **χαμηλότερο Bridge ID** γίνεται root bridge.

**Bridge ID** = Προτεραιότητα (2 bytes) + Διεύθυνση MAC (6 bytes)

- Προεπιλεγμένη προτεραιότητα: **32768**
- Νικά η χαμηλότερη προτεραιότητα· αν ισοβαθμία, νικά η χαμηλότερη MAC

\`\`\`
! Ορισμός switch ως root bridge (χαμηλότερη προτεραιότητα)
Switch(config)# spanning-tree vlan 1 priority 4096

! ή χρήση συντόμευσης
Switch(config)# spanning-tree vlan 1 root primary
\`\`\`

## Ρόλοι Θυρών STP

| Role | Description | State |
|------|-------------|-------|
| **Root Port (RP)** | Καλύτερη διαδρομή προς root bridge (σε μη-root switches) | Forwarding |
| **Designated Port (DP)** | Καλύτερη διαδρομή από κάθε τμήμα προς root | Forwarding |
| **Blocked Port** | Πλεονάζουσα θύρα που μπλοκάρεται για αποτροπή βρόχων | Blocking |
| **Disabled Port** | Διοικητικά απενεργοποιημένη | Disabled |

## Καταστάσεις Θυρών STP

| State | Duration | Description |
|-------|----------|-------------|
| **Blocking** | 20 sec | Λαμβάνει μόνο BPDUs, χωρίς προώθηση δεδομένων |
| **Listening** | 15 sec | Στέλνει/λαμβάνει BPDUs, χωρίς προώθηση δεδομένων |
| **Learning** | 15 sec | Μαθαίνει διευθύνσεις MAC, χωρίς προώθηση δεδομένων |
| **Forwarding** | Ενεργή | Κανονική λειτουργία, προωθεί δεδομένα |
| **Disabled** | - | Διοικητικά απενεργοποιημένη |

**Συνολικός χρόνος σύγκλισης:** ~30-50 δευτερόλεπτα (με προεπιλεγμένους χρονομέτρους)

## Παραλλαγές STP

| Variant | Description | Convergence |
|---------|-------------|-------------|
| **STP (802.1D)** | Αρχικό πρότυπο IEEE | 30-50 sec |
| **RSTP (802.1w)** | Γρήγορο STP, ταχύτερη σύγκλιση | 1-6 sec |
| **PVST+** | Cisco ανά-VLAN STP | 30-50 sec ανά VLAN |
| **Rapid PVST+** | Cisco ανά-VLAN RSTP | 1-6 sec ανά VLAN |
| **MST (802.1s)** | Αντιστοίχιση πολλαπλών VLAN σε λιγότερες εκδοχές STP | Ποικίλλει |

## Βελτιώσεις STP

### PortFast

Μεταβαίνει αμέσως σε κατάσταση **forwarding**, παρακάμπτοντας listening/learning. Χρήση ΜΟΝΟ σε θύρες πρόσβασης συνδεδεμένες σε τελικές συσκευές.

\`\`\`
! Ενεργοποίηση PortFast σε θύρα πρόσβασης
Switch(config)# interface GigabitEthernet0/1
Switch(config-if)# spanning-tree portfast

! Ενεργοποίηση PortFast σε όλες τις θύρες πρόσβασης παγκόσμια
Switch(config)# spanning-tree portfast default
\`\`\`

### BPDU Guard

Απενεργοποιεί (err-disable) θύρα αν λάβει BPDUs. Αποτρέπει μη εξουσιοδοτημένα switches από την επηρεασμό της τοπολογίας STP.

\`\`\`
! Ενεργοποίηση BPDU Guard σε διεπαφή
Switch(config)# interface GigabitEthernet0/1
Switch(config-if)# spanning-tree bpduguard enable

! Ενεργοποίηση BPDU Guard παγκόσμια σε όλες τις θύρες PortFast
Switch(config)# spanning-tree portfast bpduguard default
\`\`\`

## Εντολές Επαλήθευσης

\`\`\`
! Εμφάνιση πληροφοριών STP
show spanning-tree

! Εμφάνιση STP για συγκεκριμένο VLAN
show spanning-tree vlan 1

! Εμφάνιση πληροφοριών root bridge
show spanning-tree root

! Εμφάνιση λεπτομερειών διεπαφής STP
show spanning-tree interface GigabitEthernet0/1
\`\`\``,
  },
  6: {
    objectives: [
      "Να κατανοείτε τα πρότυπα ασύρματης δικτύωσης 802.11",
      "Να συγκρίνετε τις ζώνες συχνοτήτων 2.4 GHz και 5 GHz",
      "Να εξηγείτε έννοιες ασύρματης δικτύωσης (SSID, BSS, CSMA/CA)",
      "Να περιγράφετε πρωτόκολλα ασφάλειας ασύρματης δικτύωσης",
    ],
    keyTerms: [
      { term: '802.11', definition: 'Οικογένεια προτύπων IEEE για ασύρματα LAN (Wi-Fi)' },
      { term: 'SSID', definition: 'Service Set Identifier — το όνομα ενός ασύρματου δικτύου' },
      { term: 'BSS', definition: 'Basic Service Set — ένα σημείο πρόσβασης και οι συσυνδεδεμένοι πελάτες' },
      { term: 'CSMA/CA', definition: 'Carrier Sense Multiple Access with Collision Avoidance — μέθοδος πρόσβασης μέσου Wi-Fi' },
      { term: 'WPA3', definition: 'Wi-Fi Protected Access 3 — τελευταίο πρότυπο ασφάλειας ασύρματης δικτύωσης' },
    ],
    content: `## Πρότυπα Ασύρματης Δικτύωσης 802.11

Το Wi-Fi ορίζεται από την οικογένεια προτύπων **IEEE 802.11**:

| Standard | Frequency | Max Speed | Year | Notes |
|----------|-----------|-----------|------|-------|
| **802.11a** | 5 GHz | 54 Mbps | 1999 | Μικρότερη εμβέλεια, λιγότερες παρεμβολές |
| **802.11b** | 2.4 GHz | 11 Mbps | 1999 | Μεγαλύτερη εμβέλεια, περισσότερες παρεμβολές |
| **802.11g** | 2.4 GHz | 54 Mbps | 2003 | Συμβατό προς τα πίσω με 802.11b |
| **802.11n (Wi-Fi 4)** | 2.4/5 GHz | 600 Mbps | 2009 | Τεχνολογία MIMO |
| **802.11ac (Wi-Fi 5)** | 5 GHz | 6.9 Gbps | 2013 | MU-MIMO, beamforming |
| **802.11ax (Wi-Fi 6)** | 2.4/5/6 GHz | 9.6 Gbps | 2019 | OFDMA, BSS coloring |

## Ζώνες Συχνοτήτων

### Ζώνη 2.4 GHz
- **Κανάλια:** 11 κανάλια (US), 13 κανάλια (EU)
- **Μη επικαλυπτόμενα:** Κανάλια 1, 6, 11
- **Εμβέλεια:** Μεγαλύτερη εμβέλεια, καλύτερη διείσδυση στους τοίχους
- **Παρεμβολές:** Πιο πολυσύχναστο (φούρνοι μικροκυμάτων, Bluetooth, βρεφικές κάμερες)

### Ζώνη 5 GHz
- **Κανάλια:** Περισσότερα διαθέσιμα κανάλια (έως 25 μη επικαλυπτόμενα)
- **Εμβέλεια:** Μικρότερη εμβέλεια, λιγότερη διείσδυση στους τοίχους
- **Παρεμβολές:** Λιγότερο πολυσύχναστο, περισσότερο διαθέσιμο εύρος ζώνης
- **DFS channels:** Μπορεί να μοιράζονται με ραντάρ

## Έννοιες Ασύρματης Δικτύωσης

### SSID (Service Set Identifier)
Το **SSID** είναι το όνομα του ασύρματου δικτύου που βλέπουν και συνδέονται οι πελάτες.

### BSS (Basic Service Set)
Ένα **BSS** αποτελείται από ένα σημείο πρόσβασης (AP) και όλους τους συσυνδεδεμένους πελάτες. Κάθε BSS αναγνωρίζεται από **BSSID** (η διεύθυνση MAC του AP).

### CSMA/CA (Collision Avoidance)

Σε αντίθεση με το CSMA/CD (ανίχνευση συγκρούσεων) του Ethernet, το Wi-Fi χρησιμοποιεί **CSMA/CA** (αποφυγή συγκρούσεων):

1. **Ακρόαση** — Έλεγχος αν το κανάλι είναι ελεύθερο
2. **Αναμονή** — Αν είναι απασχολημένο, αναμονή τυχαίου χρόνου υποχώρησης
3. **Αποστολή** — Μετάδοση όταν είναι ελεύθερο
4. **ACK** — Αναμονή επιβεβαίωσης· επαναμετάδοση αν δεν υπάρχει ACK

> **Σημείωση:** Το Wi-Fi είναι **ημίδυπλο** — μια συσκευή δεν μπορεί να στείλει και να λάβει ταυτόχρονα.

## Ασφάλεια Ασύρματης Δικτύωσης

| Protocol | Encryption | Security Level |
|----------|-----------|----------------|
| **WEP** | RC4 (40/104-bit) | Σπασμένο — μη χρησιμοποιείται |
| **WPA** | TKIP (RC4) | Αδύναμο — ξεπερασμένο |
| **WPA2** | AES-CCMP | Καλό — ευρέως χρησιμοποιούμενο |
| **WPA3** | SAE + AES-GCMP | Βέλτιστο — συνιστάται |

### Μέθοδοι Πιστοποίησης

- **PSK (Pre-Shared Key)** — Κοινόχρηστος κωδικός (σπίτι/SOHO)
- **802.1X/EAP** — Εταιρική πιστοποίηση μέσω διακομιστή RADIUS
- **Open** — Χωρίς πιστοποίηση (δημόσια σημεία πρόσβασης, χρήση με VPN)

### Βελτιώσεις WPA3
- **SAE (Simultaneous Authentication of Equals)** — Αντικαθιστά PSP, ανθεκτικό σε επιθέσεις λεξικού offline
- **Forward secrecy** — Τυχόν παραβίαση κλειδιού δεν εκθέτει προηγούμενη κίνηση
- **Protected Management Frames (PMF)** — Αποτρέπει επιθέσεις αποπιστοποίησης`,
  },
  7: {
    objectives: [
      "Να κατανοείτε πρότυπα PoE και budget ισχύος",
      "Να περιγράφετε απειλές ασφάλειας ασύρματης δικτύωσης και μετριασμούς",
      "Να διαμορφώνετε ασφάλεια ασύρματης δικτύωσης σε WLC",
      "Να εξηγείτε τη διαδικασία πιστοποίησης ασύρματης δικτύωσης",
    ],
    keyTerms: [
      { term: 'PoE', definition: 'Power over Ethernet — παρέχει ηλεκτρική ισχύ μαζί με δεδομένα μέσω καλωδίων Ethernet' },
      { term: 'WLC', definition: 'Wireless LAN Controller — συσκευή κεντρικής διαχείρισης για ελαφρά AP' },
      { term: 'CAPWAP', definition: 'Control and Provisioning of Wireless APs — πρωτόκολλο μεταξύ AP και WLC' },
      { term: 'Rogue AP', definition: 'Μη εξουσιοδοτημένο σημείο πρόσβασης συνδεδεμένο στο δίκτυο' },
    ],
    content: `## Power over Ethernet (PoE)

Το **PoE** παρέχει ηλεκτρική ισχύ σε συσκευές μέσω τυπικών καλωδίων Ethernet, εξαλείφοντας την ανάγκη για ξεχωριστά καλώδια τροφοδοσίας.

### Πρότυπα PoE

| Standard | Power per Port | Year | Notes |
|----------|---------------|------|-------|
| **802.3af (PoE)** | 15.4 W | 2003 | Αρχικό πρότυπο PoE |
| **802.3at (PoE+)** | 30 W | 2009 | Για συσκευές υψηλότερης ισχύος |
| **802.3bt (PoE++)** | 60 W (Type 3) / 100 W (Type 4) | 2018 | Για κάμερες PTZ, οθόνες |

### Ρόλοι Συσκευών PoE

- **PSE (Power Sourcing Equipment)** — Το switch ή injector που παρέχει ισχύ
- **PD (Powered Device)** — Η συσκευή που λαμβάνει ισχύ (AP, τηλέφωνο IP, κάμερα)

### Budget Ισχύος PoE

Τα switches έχουν συνολικό **budget ισχύος** που πρέπει να μοιραστεί σε όλες τις θύρες PoE:

\`\`\`
! Εμφάνιση κατάστασης PoE
show power inline

! Δείγμα εξόδου:
Available:370.0(w)  Used:90.0(w)  Remaining:280.0(w)

Interface    Admin  Oper    Power   Device          Class
Gi0/1        auto   on      15.4    IP Phone        3
Gi0/2        auto   on      30.0    Access Point    4
Gi0/3        auto   off     0.0     n/a             n/a
\`\`\`

## Απειλές Ασφάλειας Ασύρματης Δικτύωσης

### Κοινές Επιθέσεις

1. **Rogue AP** — Μη εξουσιοδοτημένο AP συνδεδεμένο στο δίκτυο
   - Μετριασμός: Σύστημα Πρόληψης Εισβολής Ασύρματης Δικτύωσης (WIPS)

2. **Evil Twin** — Ο επιτιθέμενος δημιουργεί ψεύτικο AP με το ίδιο SSID
   - Μετριασμός: Πιστοποίηση 802.1X, παρακολούθηση WIDS

3. **Deauthentication Attack** — Παραποιημένα πλαίσια deauth αποσυνδέουν πελάτες
   - Μετριασμός: WPA3 (Protected Management Frames)

4. **War Driving** — Σάρωση για ανοιχτά/αδύναμα ασύρματα δίκτυα
   - Μετριασμός: Ισχυρή κρυπτογράφηση, κρυμμένα SSID (περιορισμένη αποτελεσματικότητα)

## Cisco Wireless Architecture

### Αυτόνομα AP
- Αυτόνομα, αυτοπεριεκτικά AP
- Κάθε AP διαμορφώνεται ξεχωριστά
- Κατάλληλα για μικρές εγκαταστάσεις

### Ελαφρά AP με WLC
- Τα AP είναι "λεπτά" — ελέγχονται από WLC
- Κεντρική διαμόρφωση και διαχείριση
- Tunnel CAPWAP μεταξύ AP και WLC
- Κατάλληλα για εταιρικές εγκαταστάσεις

### Cloud-Based
- Τα AP διαχειρίζονται από το cloud (Meraki, κ.λπ.)
- Απλοποιημένη διαχείριση
- Άδειες βασισμένες σε συνδρομή

## Καλύτερες Πρακτικές

- Χρησιμοποιείστε **WPA3** ή **WPA2-Enterprise** (802.1X) για εταιρικά δίκτυα
- Ενεργοποιείστε **Protected Management Frames** (PMF)
- Χρησιμοποιείστε **ανίχνευση rogue AP** μέσω WIDS/WIPS
- Τμηματοποιείστε κίνηση ασύρματης δικτύωσης σε ξεχωριστά VLAN
- Εφαρμόστε **band steering** για μετακίνηση πελατών σε 5 GHz`,
  },
};
