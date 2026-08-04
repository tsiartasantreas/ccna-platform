export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface ModuleQuiz {
  moduleNumber: number;
  moduleName: string;
  questions: QuizQuestion[];
}

export const moduleQuizzes: Record<number, ModuleQuiz> = {
  1: {
    moduleNumber: 1,
    moduleName: 'Network Fundamentals',
    questions: [
      { id: 'm1q1', question: 'Which OSI layer is responsible for routing packets between networks?', options: ['Layer 1 - Physical', 'Layer 2 - Data Link', 'Layer 3 - Network', 'Layer 4 - Transport'], correct: 2, explanation: 'Layer 3 (Network layer) handles logical addressing and routing. Routers operate at this layer.' },
      { id: 'm1q2', question: 'What is the default subnet mask for a Class C IP address?', options: ['255.0.0.0', '255.255.0.0', '255.255.255.0', '255.255.255.255'], correct: 2, explanation: 'Class C addresses use /24 (255.255.255.0) as their default subnet mask.' },
      { id: 'm1q3', question: 'Which protocol uses port 443?', options: ['HTTP', 'HTTPS', 'FTP', 'SSH'], correct: 1, explanation: 'HTTPS (HTTP Secure) uses port 443 for encrypted web traffic.' },
      { id: 'm1q4', question: 'How many bits are in an IPv4 address?', options: ['32 bits', '64 bits', '128 bits', '256 bits'], correct: 0, explanation: 'IPv4 addresses are 32 bits long, written as four octets.' },
      { id: 'm1q5', question: 'What does ARP stand for?', options: ['Address Resolution Protocol', 'Automatic Routing Protocol', 'Advanced Resource Protocol', 'Address Routing Process'], correct: 0, explanation: 'ARP maps IP addresses to MAC addresses on a local network segment.' },
      { id: 'm1q6', question: 'Which TCP flag initiates a connection?', options: ['ACK', 'FIN', 'SYN', 'RST'], correct: 2, explanation: 'The SYN flag is used in the first step of the TCP three-way handshake.' },
      { id: 'm1q7', question: 'What is the private IP range for Class A?', options: ['10.0.0.0 - 10.255.255.255', '172.16.0.0 - 172.31.255.255', '192.168.0.0 - 192.168.255.255', '169.254.0.0 - 169.254.255.255'], correct: 0, explanation: 'The Class A private range is 10.0.0.0/8.' },
      { id: 'm1q8', question: 'Which command shows the IP configuration on a Cisco router?', options: ['show interfaces', 'show ip route', 'show running-config', 'show ip interface brief'], correct: 3, explanation: '"show ip interface brief" displays a summary of all interfaces with their IP addresses.' },
      { id: 'm1q9', question: 'What is the purpose of DNS?', options: ['Assign IP addresses automatically', 'Resolve domain names to IP addresses', 'Encrypt network traffic', 'Route packets between networks'], correct: 1, explanation: 'DNS translates domain names into IP addresses.' },
      { id: 'm1q10', question: 'How many usable hosts are in a /26 subnet?', options: ['30', '62', '126', '254'], correct: 1, explanation: 'A /26 subnet has 64 total addresses minus 2 for network and broadcast = 62 usable hosts.' },
      { id: 'm1q11', question: 'What is the loopback address in IPv4?', options: ['0.0.0.0', '127.0.0.1', '255.255.255.255', '192.168.0.1'], correct: 1, explanation: '127.0.0.1 is the IPv4 loopback address used to test the local TCP/IP stack.' },
      { id: 'm1q12', question: 'Which protocol is connectionless?', options: ['TCP', 'UDP', 'Both', 'Neither'], correct: 1, explanation: 'UDP is connectionless — it sends data without establishing a connection first.' },
    ],
  },
  2: {
    moduleNumber: 2,
    moduleName: 'Network Access',
    questions: [
      { id: 'm2q1', question: 'What does a switch use to forward frames?', options: ['IP address', 'MAC address', 'Port number', 'Hostname'], correct: 1, explanation: 'Switches operate at Layer 2 and use MAC addresses to make forwarding decisions.' },
      { id: 'm2q2', question: 'What is a VLAN?', options: ['A physical network device', 'A virtual broadcast domain', 'A type of cable', 'A routing protocol'], correct: 1, explanation: 'A VLAN is a virtual LAN that creates separate broadcast domains.' },
      { id: 'm2q3', question: 'Which protocol prevents Layer 2 loops?', options: ['OSPF', 'STP', 'ARP', 'DHCP'], correct: 1, explanation: 'Spanning Tree Protocol (STP) prevents loops by blocking redundant paths.' },
      { id: 'm2q4', question: 'What is the maximum cable run for Cat 5e UTP?', options: ['50 meters', '100 meters', '200 meters', '500 meters'], correct: 1, explanation: 'The maximum cable run for UTP Ethernet is 100 meters.' },
      { id: 'm2q5', question: 'What does 802.1Q do?', options: ['Provides wireless connectivity', 'Tags frames with VLAN ID', 'Routes packets', 'Assigns IP addresses'], correct: 1, explanation: '802.1Q inserts a 4-byte tag into Ethernet frames to identify the VLAN.' },
      { id: 'm2q6', question: 'What is the native VLAN by default?', options: ['VLAN 0', 'VLAN 1', 'VLAN 10', 'VLAN 100'], correct: 1, explanation: 'The default native VLAN is VLAN 1. Frames on the native VLAN are not tagged.' },
      { id: 'm2q7', question: 'Which PoE standard provides up to 30W per port?', options: ['802.3af', '802.3at', '802.3bt', '802.3ab'], correct: 1, explanation: '802.3at (PoE+) provides up to 30W per port.' },
      { id: 'm2q8', question: 'What does PortFast do?', options: ['Blocks the port', 'Immediately forwards on the port', 'Shuts down the port', 'Enables trunking'], correct: 1, explanation: 'PortFast immediately transitions a port to forwarding, bypassing STP listening/learning states.' },
      { id: 'm2q9', question: 'Which wireless standard operates only on 5 GHz?', options: ['802.11b', '802.11g', '802.11a', '802.11n'], correct: 2, explanation: '802.11a operates only on the 5 GHz frequency band.' },
      { id: 'm2q10', question: 'What is EtherChannel?', options: ['A wireless protocol', 'Bundling multiple links into one logical link', 'A type of firewall', 'A routing algorithm'], correct: 1, explanation: 'EtherChannel bundles multiple physical Ethernet links into one logical link for increased bandwidth.' },
      { id: 'm2q11', question: 'What security protocol is recommended for wireless?', options: ['WEP', 'WPA', 'WPA2', 'WPA3'], correct: 3, explanation: 'WPA3 is the latest and most secure wireless security protocol.' },
      { id: 'm2q12', question: 'What is BPDU Guard used for?', options: ['Preventing routing loops', 'Disabling ports that receive BPDUs', 'Encrypting traffic', 'Assigning VLANs'], correct: 1, explanation: 'BPDU Guard err-disables a port if it receives BPDUs, protecting against rogue switches.' },
    ],
  },
  3: {
    moduleNumber: 3,
    moduleName: 'IP Connectivity',
    questions: [
      { id: 'm3q1', question: 'What is the default Administrative Distance of OSPF?', options: ['90', '110', '120', '170'], correct: 1, explanation: 'OSPF has a default AD of 110.' },
      { id: 'm3q2', question: 'What does a static route with an AD of 250 represent?', options: ['Primary route', 'Default route', 'Floating static route', 'Connected route'], correct: 2, explanation: 'A floating static route has a higher AD than the primary routing protocol, serving as a backup.' },
      { id: 'm3q3', question: 'Which command configures a default route?', options: ['ip route 0.0.0.0 0.0.0.0 next-hop', 'ip default-route next-hop', 'default-route next-hop', 'route default next-hop'], correct: 0, explanation: 'The command "ip route 0.0.0.0 0.0.0.0 next-hop" configures a default static route.' },
      { id: 'm3q4', question: 'What is Router-on-a-Stick?', options: ['A wireless protocol', 'Inter-VLAN routing using subinterfaces', 'A type of switch', 'A routing protocol'], correct: 1, explanation: 'Router-on-a-Stick uses subinterfaces on a single router interface to route between VLANs.' },
      { id: 'm3q5', question: 'What does OSPF use to elect a DR?', options: ['Highest IP address', 'Highest router ID', 'Lowest IP address', 'Lowest router ID'], correct: 1, explanation: 'OSPF elects the DR based on the highest router ID (or highest priority).' },
      { id: 'm3q6', question: 'What is the OSPF hello timer default on multi-access networks?', options: ['10 seconds', '30 seconds', '40 seconds', '120 seconds'], correct: 0, explanation: 'The default OSPF hello timer is 10 seconds on multi-access networks (40 seconds on NBMA).' },
      { id: 'm3q7', question: 'What does HSRP provide?', options: ['Load balancing', 'First hop redundancy', 'Wireless connectivity', 'Encryption'], correct: 1, explanation: 'HSRP provides first hop redundancy by creating a virtual gateway with automatic failover.' },
      { id: 'm3q8', question: 'Which command shows the OSPF neighbor table?', options: ['show ip ospf', 'show ip ospf neighbor', 'show ip route ospf', 'show ospf database'], correct: 1, explanation: '"show ip ospf neighbor" displays the OSPF neighbor table.' },
      { id: 'm3q9', question: 'What is the longest prefix match rule?', options: ['Route with lowest AD wins', 'Route with most specific match wins', 'Route with lowest metric wins', 'Route with highest priority wins'], correct: 1, explanation: 'The longest prefix match rule selects the route with the most specific (longest) subnet mask.' },
      { id: 'm3q10', question: 'What is an ABR in OSPF?', options: ['Autonomous System Border Router', 'Area Border Router', 'Active Backup Router', 'Address Broadcast Router'], correct: 1, explanation: 'An Area Border Router (ABR) connects multiple OSPF areas.' },
      { id: 'm3q11', question: 'What is the OSPF dead timer default?', options: ['10 seconds', '30 seconds', '40 seconds', '120 seconds'], correct: 2, explanation: 'The default OSPF dead timer is 40 seconds (4x the hello timer).' },
      { id: 'm3q12', question: 'Which command enables OSPF process 1?', options: ['ospf 1', 'router ospf 1', 'enable ospf 1', 'ip ospf 1'], correct: 1, explanation: '"router ospf 1" enables OSPF process ID 1.' },
    ],
  },
  4: {
    moduleNumber: 4,
    moduleName: 'IP Services',
    questions: [
      { id: 'm4q1', question: 'What are the four DHCP messages in order?', options: ['Discover, Offer, Request, Acknowledge', 'Request, Offer, Discover, Acknowledge', 'Offer, Discover, Acknowledge, Request', 'Discover, Request, Offer, Acknowledge'], correct: 0, explanation: 'The DHCP DORA process: Discover → Offer → Request → Acknowledge.' },
      { id: 'm4q2', question: 'What does PAT stand for?', options: ['Port Address Translation', 'Private Address Translation', 'Protocol Address Translation', 'Public Address Translation'], correct: 0, explanation: 'PAT (Port Address Translation) maps multiple private IPs to one public IP using port numbers.' },
      { id: 'm4q3', question: 'What is the syslog severity level for Emergency?', options: ['0', '1', '7', '6'], correct: 0, explanation: 'Emergency (emerg) is severity level 0 — the most severe.' },
      { id: 'm4q4', question: 'Which SNMP version provides encryption?', options: ['SNMPv1', 'SNMPv2c', 'SNMPv3', 'All versions'], correct: 2, explanation: 'SNMPv3 provides authentication and encryption (authPriv mode).' },
      { id: 'm4q5', question: 'What command configures a DHCP relay agent?', options: ['ip dhcp relay', 'ip helper-address', 'dhcp forward', 'ip dhcp forwarder'], correct: 1, explanation: '"ip helper-address" on an interface configures DHCP relay.' },
      { id: 'm4q6', question: 'What is the difference between SSH and Telnet?', options: ['SSH is faster', 'SSH encrypts traffic', 'Telnet uses different ports', 'No difference'], correct: 1, explanation: 'SSH encrypts all traffic; Telnet sends data in clear text.' },
      { id: 'm4q7', question: 'What does NTP synchronize?', options: ['IP addresses', 'Clocks/time', 'Routing tables', 'VLAN databases'], correct: 1, explanation: 'NTP (Network Time Protocol) synchronizes clocks across network devices.' },
      { id: 'm4q8', question: 'What is the default NAT inside global address?', options: ['There is no default', '10.0.0.1', '192.168.1.1', 'The public IP assigned by ISP'], correct: 3, explanation: 'The inside global address is the public IP assigned by your ISP, used for NAT translation.' },
      { id: 'm4q9', question: 'Which command enables SSH on a Cisco router?', options: ['ssh enable', 'crypto key generate rsa', 'ip ssh enable', 'ssh server enable'], correct: 1, explanation: '"crypto key generate rsa" generates the RSA keys needed for SSH.' },
      { id: 'm4q10', question: 'What QoS marking is used at Layer 3?', options: ['CoS', 'DSCP', '802.1p', 'MPLS'], correct: 1, explanation: 'DSCP (Differentiated Services Code Point) is used at Layer 3 for QoS marking.' },
    ],
  },
  5: {
    moduleNumber: 5,
    moduleName: 'Security Fundamentals',
    questions: [
      { id: 'm5q1', question: 'What does an ACL use to match packets?', options: ['MAC addresses only', 'Access control entries (ACEs)', 'VLAN tags', 'Port numbers only'], correct: 1, explanation: 'ACLs use ACEs (Access Control Entries) to match and filter traffic.' },
      { id: 'm5q2', question: 'What is the implicit rule at the end of every ACL?', options: ['Permit all', 'Deny all', 'Log all', 'Forward all'], correct: 1, explanation: 'Every ACL has an implicit "deny all" at the end.' },
      { id: 'm5q3', question: 'Which ACL type filters based on source IP?', options: ['Extended ACL', 'Standard ACL', 'Named ACL', 'Reflexive ACL'], correct: 1, explanation: 'Standard ACLs (1-99) filter based on source IP address only.' },
      { id: 'm5q4', question: 'What does port security violation mode "shutdown" do?', options: ['Drops violating frames', 'Drops and logs violating frames', 'Shuts down the port', 'Allows all traffic'], correct: 2, explanation: 'Shutdown mode err-disables the port when a violation occurs.' },
      { id: 'm5q5', question: 'What does AAA stand for?', options: ['Authentication, Authorization, Accounting', 'Access, Authentication, Authorization', 'Authentication, Access, Accounting', 'Authorization, Access, Authentication'], correct: 0, explanation: 'AAA stands for Authentication, Authorization, and Accounting.' },
      { id: 'm5q6', question: 'What protocol does 802.1X use for authentication?', options: ['SSH', 'HTTPS', 'RADIUS', 'SNMP'], correct: 2, explanation: '802.1X uses a RADIUS server for authentication.' },
      { id: 'm5q7', question: 'What is DHCP snooping?', options: ['Monitoring DHCP traffic', 'Blocking unauthorized DHCP servers', 'Encrypting DHCP', 'Speeding up DHCP'], correct: 1, explanation: 'DHCP snooping blocks unauthorized DHCP servers by trusting only specific ports.' },
      { id: 'm5q8', question: 'Which VPN type connects two sites permanently?', options: ['Remote access VPN', 'Site-to-site VPN', 'SSL VPN', 'Client VPN'], correct: 1, explanation: 'Site-to-site VPNs create permanent tunnels between two locations.' },
      { id: 'm5q9', question: 'What does IPSec ESP provide?', options: ['Authentication only', 'Encryption only', 'Authentication and encryption', 'Neither'], correct: 2, explanation: 'ESP (Encapsulating Security Payload) provides both authentication and encryption.' },
      { id: 'm5q10', question: 'What is a wildcard mask of 0.0.0.255 equivalent to?', options: ['/8', '/16', '/24', '/32'], correct: 2, explanation: 'Wildcard mask 0.0.0.255 matches the last 8 bits, equivalent to /24 subnet mask.' },
    ],
  },
  6: {
    moduleNumber: 6,
    moduleName: 'Automation & Programmability',
    questions: [
      { id: 'm6q1', question: 'What does SDN separate?', options: ['Hardware and software', 'Control plane and data plane', 'LAN and WAN', 'IPv4 and IPv6'], correct: 1, explanation: 'SDN separates the control plane (decision-making) from the data plane (forwarding).' },
      { id: 'm6q2', question: 'Which HTTP method creates a resource?', options: ['GET', 'POST', 'PUT', 'DELETE'], correct: 1, explanation: 'POST creates a new resource. GET reads, PUT updates, DELETE removes.' },
      { id: 'm6q3', question: 'What format do REST APIs commonly use?', options: ['XML only', 'JSON only', 'Both JSON and XML', 'HTML'], correct: 2, explanation: 'REST APIs commonly support both JSON and XML data formats.' },
      { id: 'm6q4', question: 'What is Ansible?', options: ['A programming language', 'An agentless configuration management tool', 'A routing protocol', 'A firewall'], correct: 1, explanation: 'Ansible is an agentless automation tool that uses SSH to configure devices.' },
      { id: 'm6q5', question: 'What does NETCONF use for data modeling?', options: ['JSON', 'XML', 'YANG', 'HTML'], correct: 2, explanation: 'NETCONF uses YANG as its data modeling language.' },
      { id: 'm6q6', question: 'What HTTP status code means "Not Found"?', options: ['200', '400', '401', '404'], correct: 3, explanation: '404 means the requested resource was not found.' },
      { id: 'm6q7', question: 'What is Cisco DNA Center?', options: ['A firewall', 'An intent-based networking platform', 'A routing protocol', 'A cable type'], correct: 1, explanation: 'Cisco DNA Center is an intent-based networking platform for network management.' },
      { id: 'm6q8', question: 'What does RESTCONF use for communication?', options: ['SSH', 'Telnet', 'HTTP/HTTPS', 'SNMP'], correct: 2, explanation: 'RESTCONF uses HTTP/HTTPS methods for configuration and monitoring.' },
      { id: 'm6q9', question: 'Which tool is agent-based for configuration management?', options: ['Ansible', 'Puppet', 'Both', 'Neither'], correct: 1, explanation: 'Puppet is agent-based (requires agent on managed devices). Ansible is agentless.' },
      { id: 'm6q10', question: 'What is the YANG data model used for?', options: ['Routing', 'Data modeling for network configuration', 'Wireless security', 'Cable management'], correct: 1, explanation: 'YANG is a data modeling language used to define configuration and state data for network devices.' },
    ],
  },
};

export function getQuizByModule(moduleNumber: number): ModuleQuiz | undefined {
  return moduleQuizzes[moduleNumber];
}
