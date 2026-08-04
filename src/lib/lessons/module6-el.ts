export const module6LessonsEl: Record<number, { objectives: string[]; keyTerms: { term: string; definition: string }[]; content: string }> = {
  1: {
    objectives: [
      "Να διακρίνετε μεταξύ επιπέδου ελέγχου και επιπέδου δεδομένων",
      "Να εξηγείτε τον ρόλο ενός SDN controller",
      "Να περιγράφετε τρεις αρχιτεκτονικές SDN",
      "Να αναγνωρίζετε οφέλη SDN",
      "Να κατανοείτε southbound και northbound APIs",
    ],
    keyTerms: [
      { term: "Control Plane", definition: "Τμήμα δικτύου υπεύθυνο για αποφάσεις δρομολόγησης" },
      { term: "Data Plane", definition: "Τμήμα δικτύου υπεύθυνο για προώθηση πακέτων" },
      { term: "SDN Controller", definition: "Κεντρική εφαρμογή λογισμικού που διαχειρίζεται SDN δίκτυο" },
      { term: "Southbound API", definition: "API επικοινωνίας controller με συσκευές (OpenFlow, NETCONF)" },
      { term: "Northbound API", definition: "API επικοινωνίας controller με εφαρμογές (REST APIs)" },
    ],
    content: `## Κατανόηση SDN

## Παραδοσιακό Μοντέλο Δικτύωσης

- **Control Plane**: Εκτελεί πρωτόκολλα δρομολόγησης, κατασκευάζει πίνακα δρομολόγησης
- **Data Plane**: Λαμβάνει πακέτα, αναζητά προορισμό, προωθεί

### Προβλήματα Παραδοσιακού Μοντέλου

| Challenge | Description |
|-----------|-------------|
| Διαμόρφωση ανά συσκευή | Κάθε συσκευή ξεχωριστά |
| Ασυνέπεια | Ανθρώπινο σφάλμα |
| Αργή παροχή | Χειροκίνητη αλλαγή πολλών συσκευών |

## SDN Architecture

\`\`\`
+---------------------------+
|    Application Plane      |  ← Εφαρμογές Δικτύου
+---------------------------+
|   Northbound APIs (REST)  |
+---------------------------+
|    Control Plane           |  ← SDN Controller
+---------------------------+
|   Southbound APIs          |  ← OpenFlow, NETCONF
+---------------------------+
|    Infrastructure Plane    |  ← Switches, Routers
+---------------------------+
\`\`\`

## Λειτουργίες SDN Controller

1. **Ανακάλυψη τοπολογίας**
2. **Υπολογισμός διαδρομής**
3. **Προγραμματισμός ροής**
4. **Επιβολή πολιτικής**
5. **Παρακολούθηση και αναλύσεις**

## Οφέλη SDN

1. Κεντρική διαχείριση
2. Αυτοματοποίηση
3. Προγραμματισιμότητα
4. Ταχύτερη παροχή
5. Βελτιωμένη ορατότητα`,
  },

  2: {
    objectives: [
      "Να εξηγείτε REST APIs",
      "Να περιγράφετε HTTP methods (GET, POST, PUT, DELETE)",
      "Να ερμηνεύετε HTTP status codes",
      "Να διακρίνετε JSON και XML",
    ],
    keyTerms: [
      { term: "REST API", definition: "Αρχιτεκτονικό στυλ για δίκτυα εφαρμογών με HTTP methods" },
      { term: "HTTP Methods", definition: "GET (ανάκτηση), POST (δημιουργία), UPDATE (ενημέρωση), DELETE (διαγραφή)" },
      { term: "JSON", definition: "Ελαφριά μορφή ανταλλαγής δεδομένων με key-value pairs" },
      { term: "CRUD", definition: "Create, Read, Update, Delete" },
      { term: "Status Code", definition: "Τριψήφιος αριθμός απόκρισης HTTP" },
    ],
    content: `## REST APIs

### HTTP Methods

| CRUD | HTTP Method | Idempotent? |
|------|-------------|-------------|
| Create | POST | Όχι |
| Read | GET | Ναι |
| Update | PUT / PATCH | Ναι |
| Delete | DELETE | Ναι |

### Status Codes

| Code | Meaning |
|------|---------|
| **200** | OK |
| **201** | Created |
| **400** | Bad Request |
| **401** | Unauthorized |
| **404** | Not Found |
| **500** | Internal Server Error |

### JSON

\`\`\`json
{
  "interface": {
    "name": "GigabitEthernet0/1",
    "ip_address": "192.168.1.1",
    "status": "up"
  }
}
\`\`\`

### XML

\`\`\`xml
<interface>
  <name>GigabitEthernet0/1</name>
  <ip_address>192.168.1.1</ip_address>
  <status>up</status>
</interface>
\`\`\`

### JSON vs XML

| Feature | JSON | XML |
|---------|------|-----|
| Ανάγνωση | Εύκολη | Πιο αναλυτική |
| Μέγεθος | Μικρότερο | Μεγαλύτερο |
| Χρήση | REST APIs, RESTCONF | NETCONF, SOAP |

### Παράδειγμα Python

\`\`\`python
import requests

response = requests.get(
    "https://192.168.1.1/restconf/data/ietf-interfaces:interfaces",
    headers={"Accept": "application/yang-data+json"},
    auth=("admin", "cisco123"),
    verify=False
)
print(response.json())
\`\`\``,
  },

  3: {
    objectives: [
      "Να εξηγείτε εργαλεία διαχείρισης διαμόρφωσης",
      "Να διακρίνετε agentless και agent-based",
      "Να περιγράφετε Ansible, Puppet, Chef",
    ],
    keyTerms: [
      { term: "Configuration Management", definition: "Αυτοματοποίηση διατήρησης συσκευών σε επιθυμητή κατάσταση" },
      { term: "Agentless", definition: "Χωρίς εγκατεστημένο agent (Ansible)" },
      { term: "Agent-Based", definition: "Με εγκατεστημένο agent (Puppet, Chef)" },
      { term: "Playbook", definition: "Αρχείο διαμόρφωσης Ansible σε YAML" },
      { term: "Idempotency", definition: "Ιδιότητα όπου πολλαπλή εκτέλεση δίνει ίδιο αποτέλεσμα" },
    ],
    content: `## Διαχείριση Διαμόρφωσης

## Ansible vs Puppet vs Chef

| Feature | Ansible | Puppet | Chef |
|---------|---------|--------|------|
| Αρχιτεκτονική | Agentless | Agent-based | Agent-based |
| Γλώσσα | YAML | Puppet DSL | Ruby DSL |
| Προσέγγιση | Εντολική | Δηλωτική | Εντολική |
| Μάθηση | Εύκολη | Μέτρια | Δύσκολη |

## Ansible

### Workflow

\`\`\`
1. Ορισμός Inventory (λίστα συσκευών)
       ↓
2. Γράψιμο Playbook (YAML με εργασίες)
       ↓
3. Εκτέλεση Playbook
       ↓
4. Ansible συνδέεται μέσω SSH
       ↓
5. Εκτελεί modules σε συσκευές
\`\`\`

### Παράδειγμα Playbook

\`\`\`yaml
- name: Configure VLANs on Cisco Switches
  hosts: switches
  gather_facts: no
  connection: network_cli

  tasks:
    - name: Create VLAN 100
      cisco.ios.ios_vlans:
        config:
          - vlan_id: 100
            name: Engineering
            state: active
        state: merged
\`\`\`

### Εκτέλεση

\`\`\`bash
ansible-playbook -i inventory.ini configure_vlans.yml
ansible-playbook -i inventory.ini configure_vlans.yml --check
\`\`\`

## Καλύτερη Επιλογή για Δίκτυα

**Ansible** — agentless, YAML, εύκολη μάθηση, εξαιρετική υποστήριξη δικτυωτικών συσκευών.`,
  },

  4: {
    objectives: [
      "Να εξηγείτε intent-based networking και Cisco DNA Center",
      "Να περιγράφετε NETCONF και YANG",
      "Να διακρίνετε NETCONF και RESTCONF",
    ],
    keyTerms: [
      { term: "Intent-Based Networking", definition: "Προσέγγιση όπου ο διαχειριστής ορίζει επιθυμητό αποτέλεσμα" },
      { term: "NETCONF", definition: "IETF πρότυπο διαμόρφωσης δικτύου με XML (RFC 6241)" },
      { term: "RESTCONF", definition: "RESTful διεπαφή σε YANG μοντέλα (RFC 8040)" },
      { term: "YANG", definition: "Γλώσσα μοντελοποίησης δεδομένων δικτύου (RFC 7950)" },
      { term: "Cisco DNA Center", definition: "Πλατφόρμα IBN της Cisco για εταιρικά δίκτυα" },
    ],
    content: `## Intent-Based Networking

### IBN Lifecycle

\`\`\`
TRANSLATE → ACT → VERIFY → OBSERVE
    ^                         |
    |_________________________|
          Feedback Loop
\`\`\`

1. **Translate**: Ορισμός επιθυμητού αποτελέσματος
2. **Act**: Αυτόματη διαμόρφωση
3. **Verify**: Συνεχής επαλήθευση
4. **Observe**: Τηλεμετρία και αναλύσεις

## Cisco DNA Center

| Capability | Description |
|-----------|-------------|
| **Automation** | Zero-touch provisioning |
| **Assurance** | Proactive monitoring |
| **Analytics** | Τηλεμετρία δικτύου |
| **Security** | SD-Access |
| **Programmability** | REST APIs |

## NETCONF

### Operations

| Operation | Description |
|-----------|-------------|
| **get** | Ανάκτηση δεδομένων κατάστασης |
| **get-config** | Ανάκτηση διαμόρφωσης |
| **edit-config** | Τροποποίηση διαμόρφωσης |
| **copy-config** | Αντιγραφή datastore |

### Datastores

| Datastore | Description |
|-----------|-------------|
| **running** | Τρέχουσα ενεργή διαμόρφωση |
| **candidate** | Περιοχή αλλαγών |
| **startup** | Διαμόρφωση εκκίνησης |

### Ενεργοποίηση NETCONF

\`\`\`
Router(config)# netconf-yang
Router# show netconf-yang sessions
\`\`\`

## RESTCONF

### RESTCONF vs NETCONF

| Feature | NETCONF | RESTCONF |
|---------|---------|----------|
| Μεταφορά | SSH (port 830) | HTTP/HTTPS |
| Μορφή | XML | XML ή JSON |
| Στυλ | RPC-based | RESTful |

### Ενεργοποίηση RESTCONF

\`\`\`
Router(config)# restconf
Router(config)# ip http server
Router(config)# ip http secure-server
\`\`\`

## YANG

### Τύποι Μοντέλων

| Type | Description |
|------|-------------|
| **Configuration data** | Παράμετροι που αλλάζουν |
| **State data** | Μόνο ανάγνωση |
| **RPCs** | Λειτουργίες |
| **Notifications** | Γεγονότα |

### Κοινά YANG Μοντέλα

| Model | Description |
|-------|-------------|
| **ietf-interfaces** | Διαμόρφωση διεπαφών |
| **ietf-ip** | Διαμόρφωση IP |
| **Cisco-IOS-XE-native** | Cisco IOS-XE |

## Βασικά Σημεία

- **IBN**: Ορίζετε *τι* θέλετε, όχι *πώς*
- **DNA Center**: Πλατφόρμα IBN με αυτοματοποίηση και εγγύηση
- **NETCONF**: XML over SSH για σύνθετες διαμορφώσεις
- **RESTCONF**: RESTful HTTP για απλές λειτουργίες CRUD
- **YANG**: Γλώσσα μοντελοποίησης δεδομένων`,
  },
};
