export const module4Lessons: Record<number, { objectives: string[]; keyTerms: { term: string; definition: string }[]; content: string }> = {
  1: {
    objectives: [
      "Explain the purpose of DHCP and how it simplifies IP address management",
      "Describe the four-step DORA process (Discover, Offer, Request, Acknowledge)",
      "Configure a Cisco router as a DHCP server",
      "Explain the function of a DHCP relay agent and configure ip helper-address",
      "Troubleshoot common DHCP issues using show and debug commands",
    ],
    keyTerms: [
      { term: "DHCP", definition: "Dynamic Host Configuration Protocol — an application layer protocol that automatically assigns IP addresses and other network configuration parameters to devices on a network" },
      { term: "DORA Process", definition: "The four-step process DHCP uses to lease an IP address: Discover, Offer, Request, Acknowledge" },
      { term: "DHCP Relay Agent", definition: "A router feature (ip helper-address) that forwards DHCP broadcast messages to a DHCP server on a different subnet" },
      { term: "DHCP Pool", definition: "A configured range of IP addresses on a DHCP server that can be assigned to clients" },
      { term: "Lease Time", definition: "The duration for which a DHCP client is allowed to use an assigned IP address before it must renew" },
    ],
    content: `
![Diagram](/images/diagrams/dhcp-dora.svg)

## What Is DHCP?

**Dynamic Host Configuration Protocol (DHCP)** is an application layer protocol that automatically provides IP configuration to hosts on a network. Without DHCP, every device would need to be manually configured with an IP address, subnet mask, default gateway, and DNS server — a tedious and error-prone process in any network of meaningful size.

DHCP operates on **UDP ports 67 (server)** and **68 (client)**. It is defined in RFC 2131 and is one of the most commonly used protocols in modern networks.

## The DORA Process

When a client needs an IP address, it goes through a four-step process known as **DORA**:

### Step 1 — Discover
The client broadcasts a **DHCP Discover** message (destination 255.255.255.255) to find available DHCP servers. Because the client does not yet have an IP address, the source is 0.0.0.0. This is a Layer 2 and Layer 3 broadcast.

### Step 2 — Offer
Any DHCP server that receives the Discover message responds with a **DHCP Offer**. This message contains a proposed IP address, subnet mask, default gateway, DNS server, and lease time. The offer is sent as a unicast or broadcast depending on the implementation.

### Step 3 — Request
The client selects one offer (if multiple servers responded) and sends a **DHCP Request** message. This is still a broadcast so that all DHCP servers know which offer was accepted. The servers whose offers were not chosen will withdraw their offers.

### Step 4 — Acknowledge
The selected server sends a **DHCP Acknowledge (ACK)** message, confirming the lease. The client can now use the assigned IP configuration. If the server cannot fulfill the request, it sends a **DHCP NAK (Negative Acknowledge)**.

| Step | Message | Source | Destination | Purpose |
|------|---------|--------|-------------|---------|
| 1 | Discover | 0.0.0.0 | 255.255.255.255 | Find DHCP servers |
| 2 | Offer | Server IP | 255.255.255.255 or client MAC | Propose IP configuration |
| 3 | Request | 0.0.0.0 | 255.255.255.255 | Accept an offer |
| 4 | Acknowledge | Server IP | Client | Confirm the lease |

## Lease Renewal

Before a lease expires, the client attempts to renew it. At **50% of the lease time** (T1 timer), the client sends a unicast Request directly to the DHCP server. If no response, at **87.5% of the lease time** (T2 timer), it broadcasts a Request. If the lease expires without renewal, the client must start the DORA process over.

## Configuring a DHCP Server on a Cisco Router

A Cisco router can act as a DHCP server. Here is a typical configuration:

\`\`\`
! Exclude addresses that should not be assigned (e.g., gateway, servers)
R1(config)# ip dhcp excluded-address 192.168.1.1 192.168.1.10

! Create a DHCP pool
R1(config)# ip dhcp pool LAN_POOL
R1(dhcp-config)# network 192.168.1.0 255.255.255.0
R1(dhcp-config)# default-router 192.168.1.1
R1(dhcp-config)# dns-server 8.8.8.8 8.8.4.4
R1(dhcp-config)# lease 7
R1(dhcp-config)# exit
\`\`\`

Key commands explained:
- **ip dhcp excluded-address** — reserves addresses that will NOT be handed out to clients (routers, servers, printers)
- **network** — defines the subnet range for the pool
- **default-router** — sets the default gateway for clients
- **dns-server** — specifies DNS server(s) for clients
- **lease** — sets lease duration in days (default is 1 day)

## DHCP Relay Agent (ip helper-address)

DHCP Discover messages are **broadcasts**. Routers do not forward broadcasts by default, which means a DHCP server on one subnet cannot serve clients on another subnet. The **DHCP relay agent** solves this problem.

When you configure **ip helper-address** on a router interface, the router intercepts DHCP broadcasts and forwards them as **unicast** packets to the specified DHCP server. The router modifies the **giaddr (gateway IP address)** field in the DHCP packet so the server knows which subnet the request came from and can assign an appropriate address.

\`\`\`
R1(config)# interface GigabitEthernet0/1
R1(config-if)# ip helper-address 10.0.0.5
\`\`\`

The ip helper-address command also forwards several other UDP broadcasts by default, including TFTP (port 69), DNS (port 53), TACACS (port 49), and others. You can disable unnecessary forwarding with:

\`\`\`
R1(config)# no ip forward-protocol udp tftp
\`\`\`

## Verifying and Troubleshooting DHCP

Use the following commands to verify DHCP operation:

\`\`\`
! On the DHCP server
R1# show ip dhcp binding
R1# show ip dhcp pool
R1# show ip dhcp conflict
R1# show ip dhcp server statistics

! On the DHCP client
PC> ipconfig /all
PC> ipconfig /release
PC> ipconfig /renew

! Debug on the server
R1# debug ip dhcp server events
R1# debug ip dhcp server packets
\`\`\`

Common troubleshooting steps:
1. Verify the DHCP pool is configured correctly with the right network and default-router
2. Check that excluded addresses are properly defined
3. If clients are on a different subnet, confirm ip helper-address is configured on the correct interface
4. Verify the interface connected to clients is up/up and has an IP address in the correct subnet
5. Use \`show ip dhcp binding\` to see which addresses have been leased
`,
  },

  2: {
    objectives: [
      "Explain the purpose of NAT and how it conserves public IPv4 addresses",
      "Differentiate between inside local, inside global, outside local, and outside global addresses",
      "Configure static NAT, dynamic NAT, and PAT (NAT overload) on a Cisco router",
      "Verify NAT operation using show commands",
      "Troubleshoot common NAT issues",
    ],
    keyTerms: [
      { term: "NAT", definition: "Network Address Translation — a process that translates private (inside) IP addresses to public (outside) IP addresses and vice versa" },
      { term: "PAT", definition: "Port Address Translation (also called NAT overload) — translates multiple private IP addresses to a single public IP address using different port numbers" },
      { term: "Inside Local", definition: "The private IP address assigned to a host on the inside network (before NAT translation)" },
      { term: "Inside Global", definition: "The public IP address that represents an inside host to the outside network (after NAT translation)" },
      { term: "Static NAT", definition: "A one-to-one permanent mapping between a private inside address and a public outside address" },
    ],
    content: `
![Diagram](/images/diagrams/nat-translation.svg)

## What Is NAT?

**Network Address Translation (NAT)** is a process that modifies the IP address information in packet headers as they pass through a router. NAT was developed primarily to solve the IPv4 address exhaustion problem by allowing networks to use **private IP addresses** internally while sharing a smaller number of **public IP addresses** for Internet access.

NAT operates at the **border** between an inside network and an outside network (typically the Internet). The router performing NAT is called the **NAT device**.

## NAT Terminology: The Four Address Types

Understanding NAT requires knowing four address types:

| Term | Description | Example |
|------|-------------|---------|
| **Inside Local** | The private IP of a host on the internal network (before translation) | 192.168.1.10 |
| **Inside Global** | The public IP that represents the inside host to the outside world (after translation) | 203.0.113.5 |
| **Outside Local** | The IP address of an outside host as it appears to the inside network | 8.8.8.8 |
| **Outside Global** | The actual public IP of the outside host | 8.8.8.8 |

In most common scenarios, Outside Local and Outside Global are the same address. They differ only when NAT is applied to traffic going to the outside.

## Types of NAT

### Static NAT

**Static NAT** creates a **permanent one-to-one mapping** between an inside local address and an inside global address. Every time the internal host sends traffic, it is always translated to the same public IP. This is commonly used for servers that need to be reachable from the Internet (e.g., web servers, mail servers).

\`\`\`
! Step 1: Define the inside and outside interfaces
R1(config)# interface GigabitEthernet0/0
R1(config-if)# ip nat inside
R1(config-if)# exit

R1(config)# interface GigabitEthernet0/1
R1(config-if)# ip nat outside
R1(config-if)# exit

! Step 2: Create the static mapping
R1(config)# ip nat inside source static 192.168.1.10 203.0.113.5
\`\`\`

This maps 192.168.1.10 (inside local) to 203.0.113.5 (inside global) permanently.

### Dynamic NAT

**Dynamic NAT** maps inside local addresses to a **pool of inside global addresses** on a first-come, first-served basis. When an inside host initiates traffic, it is assigned the next available public address from the pool. When the session ends, the public address is returned to the pool.

**Limitation:** If all addresses in the pool are in use, new connections will fail until an address becomes available.

\`\`\`
! Define inside/outside interfaces (same as static NAT)
R1(config)# interface GigabitEthernet0/0
R1(config-if)# ip nat inside
R1(config-if)# exit

R1(config)# interface GigabitEthernet0/1
R1(config-if)# ip nat outside
R1(config-if)# exit

! Create an access list to identify inside traffic
R1(config)# access-list 1 permit 192.168.1.0 0.0.0.255

! Define the NAT pool
R1(config)# ip nat pool MY_POOL 203.0.113.1 203.0.113.10 netmask 255.255.255.0

! Bind the ACL to the pool
R1(config)# ip nat inside source list 1 pool MY_POOL
\`\`\`

### PAT (NAT Overload)

**Port Address Translation (PAT)**, also called **NAT overload**, is by far the most common type of NAT used in home and small business networks. PAT allows **many inside hosts to share a single public IP address** by differentiating sessions using **port numbers**.

PAT can translate tens of thousands of simultaneous connections using one public IP. The router keeps track of each session using a unique source port number.

\`\`\`
! Define inside/outside interfaces
R1(config)# interface GigabitEthernet0/0
R1(config-if)# ip nat inside
R1(config-if)# exit

R1(config)# interface GigabitEthernet0/1
R1(config-if)# ip nat outside
R1(config-if)# exit

! Identify inside traffic
R1(config)# access-list 1 permit 192.168.1.0 0.0.0.255

! Configure PAT using the outside interface's IP address
R1(config)# ip nat inside source list 1 interface GigabitEthernet0/1 overload
\`\`\`

Alternatively, PAT can use a pool of addresses with the **overload** keyword:

\`\`\`
R1(config)# ip nat pool MY_POOL 203.0.113.1 203.0.113.1 netmask 255.255.255.0
R1(config)# ip nat inside source list 1 pool MY_POOL overload
\`\`\`

## NAT Verification Commands

\`\`\`
! See active NAT translations
R1# show ip nat translations

! See NAT statistics
R1# show ip nat statistics

! Clear all NAT translations (useful for troubleshooting)
R1# clear ip nat translation *

! Debug NAT operations
R1# debug ip nat
\`\`\`

Sample output of \`show ip nat translations\`:

| Pro | Inside global | Inside local | Outside local | Outside global |
|-----|---------------|--------------|---------------|----------------|
| tcp | 203.0.113.5:1025 | 192.168.1.10:1025 | 8.8.8.8:80 | 8.8.8.8:80 |
| udp | 203.0.113.5:1026 | 192.168.1.11:1026 | 8.8.4.4:53 | 8.8.4.4:53 |

## Troubleshooting NAT

Common issues and checks:
1. Verify **ip nat inside** and **ip nat outside** are on the correct interfaces
2. Ensure the ACL correctly matches the inside traffic
3. Confirm the NAT pool has available addresses
4. Check that routing is correct — the router must know how to reach both inside and outside networks
5. Use \`show ip nat translations\` to verify translations are being created
6. Remember that NAT does NOT translate the packet payload — only the IP header

## NAT and Overlapping Networks

If two networks use the same private address space and need to communicate, NAT can be used to translate one side to avoid overlap. This scenario uses **outside local** and **outside global** addresses that differ.
`,
  },

  3: {
    objectives: [
      "Explain the purpose of NTP and how it synchronizes time across network devices",
      "Describe NTP stratum levels and how NTP clients select a server",
      "Configure NTP client and server on Cisco devices",
      "Explain the purpose and architecture of Syslog",
      "Describe the eight Syslog severity levels (0-7) and configure Syslog on a Cisco router",
    ],
    keyTerms: [
      { term: "NTP", definition: "Network Time Protocol — a protocol used to synchronize the clocks of network devices to a common time source, operating on UDP port 123" },
      { term: "Stratum", definition: "A ranking system (1-15) used by NTP to describe the distance (hop count) from an authoritative time source; stratum 1 is the most accurate" },
      { term: "Syslog", definition: "A standardized protocol for logging and collecting system messages from network devices, using UDP port 514" },
      { term: "Syslog Severity", definition: "A ranking from 0 (most severe, Emergency) to 7 (least severe, Debug) that categorizes the urgency of a system log message" },
      { term: "Syslog Server", definition: "A centralized server that receives, stores, and manages log messages from network devices using the Syslog protocol" },
    ],
    content: `## Network Time Protocol (NTP)

### Why Time Synchronization Matters

Accurate time on network devices is critical for several reasons:
- **Log correlation** — When troubleshooting, you need timestamps from different devices to match so you can trace the sequence of events
- **Security** — Certificates, authentication tokens, and Kerberos all depend on accurate clocks
- **Forensics** — After a security incident, accurate timestamps are essential for investigating what happened and when
- **Compliance** — Many regulations require accurate, synchronized timekeeping

### How NTP Works

**Network Time Protocol (NTP)** synchronizes clocks over a network using UDP port 123. NTP uses a **hierarchical** system of time sources organized by **stratum levels**.

| Stratum | Description |
|---------|-------------|
| 0 | Reference clocks — atomic clocks, GPS receivers (not directly used on the network) |
| 1 | Directly connected to a stratum 0 device; authoritative time servers |
| 2 | Synchronizes to stratum 1 servers |
| 3 | Synchronizes to stratum 2 servers |
| ... | Up to stratum 15 |
| 16 | Unsynchronized — the device considers its clock unreliable |

A Cisco router can act as both an **NTP client** (synchronizing to an upstream server) and an **NTP server** (providing time to downstream devices). NTP uses an algorithm to select the best time source and can combine multiple sources for higher accuracy.

### Configuring NTP

**As an NTP client:**
\`\`\`
! Synchronize to an external NTP server
R1(config)# ntp server 203.0.113.10

! Or use a named server
R1(config)# ntp server pool.ntp.org
\`\`\`

**As an NTP server (for downstream clients):**
\`\`\`
! The router will serve time to NTP clients automatically
! You can optionally specify which source interface
R1(config)# ntp source Loopback0
\`\`\`

**NTP authentication (optional but recommended):**
\`\`\`
R1(config)# ntp authenticate
R1(config)# ntp authentication-key 1 md5 MyNtpPassword
R1(config)# ntp trusted-key 1
R1(config)# ntp server 203.0.113.10 key 1
\`\`\`

**NTP peer (for redundancy between two devices):**
\`\`\`
! Both devices synchronize to each other as peers
R1(config)# ntp peer 10.0.0.2
\`\`\`

### Verifying NTP

\`\`\`
R1# show ntp status
R1# show ntp associations
R1# show ntp associations detail
\`\`\`

The output of \`show ntp status\` will indicate whether the clock is synchronized, the reference clock address, and the current stratum level.

---

## Syslog

### What Is Syslog?

**Syslog** is a standardized logging protocol that allows network devices to send event messages to a centralized **Syslog server**. This centralization is essential because:
- Device logs stored locally are lost if the device fails
- Centralized logs make it easier to search and correlate events across the network
- It supports security monitoring and compliance requirements

Syslog uses **UDP port 514** by default (TCP 1468 can also be used for reliable delivery with some implementations).

### Syslog Severity Levels

Every Syslog message is assigned a **severity level** from 0 to 7. The lower the number, the more severe the message:

| Level | Severity | Keyword | Description |
|-------|----------|---------|-------------|
| 0 | Emergency | **emerg** | System is unusable (e.g., complete hardware failure) |
| 1 | Alert | **alert** | Immediate action required (e.g., system database corruption) |
| 2 | Critical | **crit** | Critical conditions (e.g., hardware failure on a backup link) |
| 3 | Error | **err** | Error conditions (e.g., interface down, authentication failure) |
| 4 | Warning | **warning** | Warning conditions (e.g., high CPU utilization) |
| 5 | Notification | **notice** | Normal but significant conditions (e.g., interface flapping) |
| 6 | Informational | **info** | Informational messages (e.g., link up/down) |
| 7 | Debug | **debug** | Debug-level messages (used during troubleshooting) |

A mnemonic to remember: **"Every Alley Cat Eats Worms — Nightly, It's Disgusting"** or simply remember that Emergency is 0 and Debug is 7.

### Syslog Message Format

A typical Syslog message contains:
\`\`\`
<seq>: *Jan 15 14:23:01.000: %LINK-3-UPDOWN: Interface GigabitEthernet0/0, changed state to down
\`\`\`

Components:
- **Timestamp** — when the event occurred
- **Facility** — the source of the message (e.g., LINK, SYS, CONFIG)
- **Severity** — the level number (3 in this example)
- **Mnemonic** — a short code for the message type (UPDOWN)
- **Description** — the actual message text

### Configuring Syslog on a Cisco Router

\`\`\`
! Send logs to a Syslog server
R1(config)# logging host 10.0.0.100

! Set the logging severity level (messages at this level and MORE severe are sent)
R1(config)# logging trap informational

! Configure logging source interface (recommended)
R1(config)# logging source-interface Loopback0

! Enable logging to the monitor (SSH/Telnet session)
R1(config)# logging monitor informational

! Enable logging to the buffer (RAM)
R1(config)# logging buffered 16000 informational

! Set the buffer size
R1(config)# logging buffered 32000
\`\`\`

### Logging Destinations

| Destination | Command | Description |
|-------------|---------|-------------|
| Console | \`logging console\` | Messages displayed on the physical console (default: enabled) |
| Monitor | \`logging monitor\` | Messages sent to Telnet/SSH sessions |
| Buffer | \`logging buffered\` | Messages stored in RAM |
| Syslog server | \`logging host\` | Messages sent to a remote Syslog server |

### Verifying Syslog

\`\`\`
R1# show logging
R1# show logging history
\`\`\`

The \`show logging\` command displays the current logging configuration, buffer contents, and statistics.

### Best Practices

- Always configure NTP before relying on Syslog timestamps — otherwise, log times will be inaccurate
- Use a **dedicated Syslog server** (e.g., Kiwi Syslog, Splunk, Graylog) for centralized logging
- Set appropriate severity levels — avoid logging debug messages to the console in production (it can overwhelm the router)
- Use **logging source-interface** to ensure consistent source IP for all log messages
`,
  },

  4: {
    objectives: [
      "Explain the purpose of SNMP and its role in network management",
      "Differentiate between SNMPv1, SNMPv2c, and SNMPv3 in terms of security and features",
      "Configure SNMP on a Cisco router with community strings and traps",
      "Describe the purpose of Quality of Service (QoS) and why it is needed",
      "Explain QoS classification and marking, including DSCP and CoS values",
    ],
    keyTerms: [
      { term: "SNMP", definition: "Simple Network Management Protocol — a protocol used to monitor and manage network devices, operating on UDP ports 161 (queries) and 162 (traps)" },
      { term: "Community String", definition: "A plaintext password used in SNMPv1 and SNMPv2c to authenticate access to a device's management information" },
      { term: "SNMP Trap", definition: "An unsolicited alert message sent from an SNMP agent to a management station when a specific event occurs on the device" },
      { term: "MIB", definition: "Management Information Base — a hierarchical database of managed objects on a network device that SNMP can query or modify" },
      { term: "QoS", definition: "Quality of Service — a set of techniques used to manage network traffic by prioritizing certain types of traffic to ensure performance for critical applications" },
      { term: "DSCP", definition: "Differentiated Services Code Point — a 6-bit field in the IP header (ToS byte) used to classify and mark packets for QoS treatment" },
    ],
    content: `## Simple Network Management Protocol (SNMP)

### What Is SNMP?

**SNMP (Simple Network Management Protocol)** is the standard protocol for **monitoring and managing** network devices. It allows a central management station (NMS) to:

- **Monitor** device status — CPU usage, interface errors, bandwidth utilization
- **Collect** statistics — traffic counters, uptime, error rates
- **Receive alerts** — when critical events occur (link down, high CPU, configuration change)
- **Configure** devices remotely (though this is less common)

SNMP uses **UDP port 161** for queries (GET, SET) and **UDP port 162** for traps (unsolicited alerts).

### SNMP Architecture

| Component | Role |
|-----------|------|
| **SNMP Manager (NMS)** | The management station that queries agents and receives traps (e.g., SolarWinds, PRTG, Nagios) |
| **SNMP Agent** | Software running on the managed device (router, switch, server) that responds to queries and sends traps |
| **MIB** | Management Information Base — a structured database of managed objects that the agent exposes; each object has a unique OID (Object Identifier) |

### SNMP Versions

| Feature | SNMPv1 | SNMPv2c | SNMPv3 |
|---------|--------|---------|--------|
| Authentication | Community string (plaintext) | Community string (plaintext) | Username/password (encrypted) |
| Encryption | None | None | Yes (DES, AES) |
| Integrity | None | None | Yes (MD5, SHA) |
| Security Model | No security | No security | USM (User-based Security Model) |
| Trap format | Basic | Enhanced (Inform) | Enhanced (Inform) |
| Recommended | No | No | **Yes** |

**SNMPv1** — The original version; uses simple community strings (plaintext passwords) for authentication. No encryption.

**SNMPv2c** — Adds improvements like **Inform** messages (acknowledged traps) and bulk retrieval operations. Still uses plaintext community strings.

**SNMPv3** — The recommended version. Adds **authentication** (username/password), **encryption** (privacy), and **message integrity**. Uses three security levels:

| Security Level | Authentication | Encryption | Description |
|----------------|---------------|------------|-------------|
| **noAuthNoPriv** | No | No | Username only, no security |
| **authNoPriv** | Yes | No | Username + password, no encryption |
| **authPriv** | Yes | Yes | Username + password + encryption (recommended) |

### Community Strings

Community strings act as passwords in SNMPv1 and v2c:

- **Read-only (ro)** — allows GET queries to retrieve information
- **Read-write (rw)** — allows GET and SET to retrieve and modify information

\`\`\`
! Configure SNMPv2c with community strings
R1(config)# snmp-server community MyReadOnly RO
R1(config)# snmp-server community MyReadWrite RW
\`\`\`

**Important:** Always use SNMPv3 in production. Community strings are sent in plaintext and can be easily captured.

### Configuring SNMPv3

\`\`\`
! Create an SNMP view to restrict access
R1(config)# snmp-server view MY_VIEW internet included

! Create a group with security level
R1(config)# snmp-server group MY_GROUP v3 auth read MY_VIEW

! Create a user in the group
R1(config)# snmp-server user MyUser MY_GROUP v3 auth sha MyPassword123 priv aes 128 MyPrivPassword456
\`\`\`

### SNMP Traps and Informs

**Traps** are unsolicited messages sent from the agent to the NMS when an event occurs. They are **unacknowledged** — the agent sends them and does not know if the NMS received them.

**Informs** (SNMPv2c and later) are like traps but are **acknowledged** — the NMS confirms receipt.

\`\`\`
! Configure trap destination
R1(config)# snmp-server host 10.0.0.100 version 3 auth MyUser
R1(config)# snmp-server enable traps

! Enable specific trap types
R1(config)# snmp-server enable traps snmp linkdown linkup
R1(config)# snmp-server enable traps envmon
R1(config)# snmp-server enable traps config
\`\`\`

### Verifying SNMP

\`\`\`
R1# show snmp
R1# show snmp user
R1# show snmp group
R1# show snmp community
\`\`\`

---

## Quality of Service (QoS)

### Why QoS Is Needed

Not all network traffic is equal. A voice call is extremely sensitive to delay and jitter, while a file transfer can tolerate delays but needs reliable delivery. **Quality of Service (QoS)** is a set of techniques that ensures critical traffic receives the treatment it needs.

Without QoS, all packets are treated equally (**best-effort delivery**). This works fine on uncongested links but causes problems when traffic exceeds the link capacity:
- **Voice calls** become choppy or drop
- **Video conferencing** freezes or pixelates
- **Critical applications** become unresponsive

### The Four Pillars of QoS

| Pillar | Description |
|--------|-------------|
| **Classification** | Identifying and categorizing traffic based on criteria (IP address, port, DSCP, ACL) |
| **Marking** | Tagging packets with a priority value so downstream devices know how to treat them |
| **Queuing** | Placing packets into different queues based on their class; each queue is serviced at a different rate |
| **Congestion Management** | Deciding which queue to transmit from first when the link is congested |

### Classification and Marking

**Classification** is the first step — you must identify traffic before you can prioritize it. Methods include:

- **ACLs** — match on source/destination IP or port numbers
- **NBAR** (Network-Based Application Recognition) — deep packet inspection to identify applications
- **Input interface** — classify based on which interface the traffic arrived on

**Marking** sets a value in the packet header that downstream devices can read:

| Layer | Marking Field | Size | Location |
|-------|---------------|------|----------|
| Layer 2 | **CoS** (Class of Service) | 3 bits | 802.1Q tag (VLAN frames) |
| Layer 3 | **DSCP** (Differentiated Services Code Point) | 6 bits | IP header ToS byte |
| Layer 3 | **IP Precedence** | 3 bits | IP header ToS byte (legacy) |

**DSCP** is the most commonly used marking at Layer 3. Common DSCP values:

| DSCP Value | Per-Hop Behavior | Typical Traffic |
|------------|-----------------|-----------------|
| 0 (BE) | Best Effort | Default traffic |
| 26 (AF31) | Assured Forwarding | Critical data |
| 34 (AF41) | Assured Forwarding | Streaming video |
| 46 (EF) | Expedited Forwarding | Voice (highest priority) |

### Marking with ACLs and Class Maps

\`\`\`
! Create an ACL to identify voice traffic
R1(config)# access-list 100 permit udp any any range 16384 32767

! Create a class map
R1(config)# class-map match-any VOICE
R1(config-cmap)# match access-group 100
R1(config-cmap)# exit

! Create a policy map to mark traffic
R1(config)# policy-map MARK_VOICE
R1(config-pmap)# class VOICE
R1(config-pmap-c)# set dscp ef
R1(config-pmap-c)# exit
R1(config-pmap)# exit

! Apply the policy to an interface
R1(config)# interface GigabitEthernet0/0
R1(config-if)# service-policy output MARK_VOICE
\`\`\`

### QoS Trust Boundaries

A **trust boundary** is the point in the network where QoS markings are accepted. Traffic that crosses the trust boundary has its markings rewritten. Typically, the trust boundary is at the **access switch** — trust markings from IP phones but not from PCs.

\`\`\`
! Trust QoS markings from an IP phone
SW1(config)# interface GigabitEthernet0/1
SW1(config-if)# mls qos trust dscp
\`\`\`

### Best Practices for QoS

- Classify and mark traffic **as close to the source** as possible
- Use **DSCP** for marking (it is end-to-end and widely supported)
- Reserve **priority queuing** for real-time traffic (voice, video)
- Keep QoS policies simple and consistent across the network
- Monitor and adjust QoS policies based on actual traffic patterns
`,
  },

  5: {
    objectives: [
      "Explain the security risks of Telnet and why SSH is the preferred remote access protocol",
      "Describe the SSH connection process and how RSA keys are used",
      "Generate RSA keys and configure SSH on a Cisco router or switch",
      "Configure local AAA authentication for SSH access",
      "Verify and troubleshoot SSH connectivity",
    ],
    keyTerms: [
      { term: "SSH", definition: "Secure Shell — a cryptographic network protocol for secure remote access, operating on TCP port 22, that encrypts all traffic including credentials" },
      { term: "Telnet", definition: "A legacy remote access protocol operating on TCP port 23 that transmits all data including passwords in plaintext — not recommended for production use" },
      { term: "RSA", definition: "Rivest-Shamir-Adleman — a public-key cryptographic algorithm used by SSH to generate key pairs for secure authentication and session encryption" },
      { term: "AAA", definition: "Authentication, Authorization, and Accounting — a security framework that controls who can access a device, what they can do, and logs their activities" },
      { term: "VTY Lines", definition: "Virtual Terminal Lines — logical interfaces on a Cisco device that handle remote access sessions (Telnet and SSH)" },
    ],
    content: `## Remote Access: Telnet vs SSH

### Telnet — The Legacy Protocol

**Telnet** (TCP port 23) was the original protocol for remotely accessing network devices. It provides a text-based command-line interface over the network. However, Telnet has a critical security flaw: **all data is transmitted in plaintext**, including usernames and passwords. Anyone who captures the traffic with a packet sniffer (like Wireshark) can read everything.

**Telnet should NEVER be used in production networks.** It exists in the CCNA curriculum for historical context and understanding why SSH was developed.

### SSH — The Secure Alternative

**SSH (Secure Shell)** (TCP port 22) provides the same remote access functionality as Telnet but with **encryption**. All traffic between the client and server is encrypted, including:
- Username and password
- Commands typed during the session
- Output displayed on the screen

SSH uses **RSA (or other) public-key cryptography** to establish a secure session. When you first connect to a device, the SSH client verifies the server's identity using its **host key**. This prevents man-in-the-middle attacks.

| Feature | Telnet | SSH |
|---------|--------|-----|
| Port | TCP 23 | TCP 22 |
| Encryption | None | Full session encryption |
| Authentication | Username/Password (plaintext) | Username/Password + RSA keys |
| Security | **Insecure** | **Secure** |
| Recommended | No | **Yes** |

## Configuring SSH on a Cisco Device

### Prerequisites

Before SSH will work, you must configure:
1. A **hostname** (other than the default "Router")
2. A **domain name**
3. **RSA keys** (generated from the domain name)
4. **Local user accounts** or AAA for authentication
5. **VTY lines** configured for SSH

### Step-by-Step Configuration

\`\`\`
! Step 1: Set a hostname (SSH will not work with the default "Router")
R1(config)# hostname CCNA-R1

! Step 2: Set a domain name (required for key generation)
CCNA-R1(config)# ip domain-name example.com

! Step 3: Generate RSA keys
CCNA-R1(config)# crypto key generate rsa general-keys modulus 2048
% The name for the keys will be: CCNA-R1.example.com
% General purpose Key pair generation will be done.
% Keypair generation process may take a few minutes...

! Step 4: Create a local user account
CCNA-R1(config)# username admin privilege 15 secret MySecurePassword

! Step 5: Configure VTY lines for SSH
CCNA-R1(config)# line vty 0 4
CCNA-R1(config-line)# transport input ssh
CCNA-R1(config-line)# login local
CCNA-R1(config-line)# exec-timeout 10 0
CCNA-R1(config-line)# exit

! Step 6: Enable SSH version 2 (recommended)
CCNA-R1(config)# ip ssh version 2

! Optional: Limit SSH authentication attempts
CCNA-R1(config)# ip ssh authentication-retries 3

! Optional: Set SSH timeout
CCNA-R1(config)# ip ssh time-out 60
\`\`\`

### Configuration Explained

**crypto key generate rsa general-keys modulus 2048**
This generates the RSA key pair used by SSH. The **modulus** determines key length — 2048 bits is the minimum recommended. Higher values (4096) are more secure but take longer to generate. Without these keys, SSH cannot function.

**transport input ssh**
This restricts VTY lines to accept ONLY SSH connections. If you use \`transport input all\` or \`transport input telnet ssh\`, Telnet would also be allowed — which defeats the security purpose.

**login local**
This tells the router to authenticate users against locally configured usernames and passwords rather than a line password.

**privilege 15**
This grants the user full administrative access (equivalent to enable mode) upon login.

### AAA Authentication (Alternative)

For enterprise environments, you can use **AAA (Authentication, Authorization, Accounting)** for SSH authentication:

\`\`\`
! Enable AAA
CCNA-R1(config)# aaa new-model

! Configure authentication for login
CCNA-R1(config)# aaa authentication login SSH_AUTH local

! Apply to VTY lines
CCNA-R1(config)# line vty 0 4
CCNA-R1(config-line)# transport input ssh
CCNA-R1(config-line)# login authentication SSH_AUTH
\`\`\`

AAA provides a more scalable and flexible authentication framework. In production, AAA is often configured to use a **RADIUS** or **TACACS+** server for centralized authentication.

## Connecting via SSH

From a client machine, connect using an SSH client:

\`\`\`
! From a Linux/macOS terminal
ssh admin@192.168.1.1

! From PuTTY (Windows)
! Select SSH, enter IP address and port 22

! From another Cisco device
CCNA-R2# ssh -l admin 192.168.1.1
\`\`\`

The first time you connect, you will be asked to verify the server's fingerprint. This is the **host key verification** step — it ensures you are connecting to the intended device.

## Verifying and Troubleshooting SSH

\`\`\`
! Verify SSH is configured and running
CCNA-R1# show ip ssh
SSH Enabled - version 2.0
Authentication timeout: 60 secs; Authentication retries: 3

! See who is currently connected
CCNA-R1# show users

! See VTY line configuration
CCNA-R1# show line vty 0 4

! See active sessions
CCNA-R1# show ssh
\`\`\`

### Common SSH Issues and Solutions

| Problem | Cause | Solution |
|---------|-------|----------|
| "SSH not enabled" | No RSA keys generated | Run \`crypto key generate rsa\` |
| Connection refused | VTY lines not configured for SSH | Set \`transport input ssh\` on VTY lines |
| Authentication fails | Wrong credentials or no user account | Verify \`username\` configuration |
| "No host key" error | Default hostname "Router" or no domain name | Set hostname and \`ip domain-name\` |
| Slow connection | DNS resolution failing | Configure \`ip name-server\` or use IP address |

### Securing VTY Lines Further

\`\`\`
! Restrict SSH access to specific source IPs
CCNA-R1(config)# access-list 10 permit 192.168.1.0 0.0.0.255
CCNA-R1(config)# line vty 0 4
CCNA-R1(config-line)# access-class 10 in

! Set maximum concurrent sessions
CCNA-R1(config)# line vty 0 15
CCNA-R1(config-line)# session-limit 5

! Display a login banner
CCNA-R1(config)# banner login #
Unauthorized access is prohibited. All activity is monitored.
#
\`\`\`

## Key Takeaways

- **Never use Telnet** in production — always use SSH
- Generate RSA keys with at least **2048-bit modulus**
- Use \`transport input ssh\` to block Telnet on VTY lines
- Configure **local user accounts** or AAA for authentication
- Use **access-class** on VTY lines to restrict who can connect
- Always verify SSH operation with \`show ip ssh\` and \`show ssh\`
`,
  },
};
