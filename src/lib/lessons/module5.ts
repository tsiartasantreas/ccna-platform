export const module5Lessons: Record<number, { objectives: string[]; keyTerms: { term: string; definition: string }[]; content: string }> = {
  1: {
    objectives: [
      "Identify common network security threats including DoS, spoofing, and man-in-the-middle attacks",
      "Explain the differences between active and passive network attacks",
      "Describe reconnaissance techniques attackers use to gather information about a target network",
      "Recognize social engineering tactics and how they compromise network security",
      "Understand defense-in-depth strategies to protect against multiple attack vectors"
    ],
    keyTerms: [
      { term: "Denial of Service (DoS)", definition: "An attack that overwhelms a target system with traffic or requests, rendering it unavailable to legitimate users" },
      { term: "Man-in-the-Middle (MITM)", definition: "An attack where the adversary secretly intercepts and potentially alters communication between two parties who believe they are communicating directly" },
      { term: "Spoofing", definition: "An attack where a threat actor falsifies network data such as IP addresses, MAC addresses, or DNS entries to impersonate another device" },
      { term: "Reconnaissance", definition: "The preliminary phase of an attack where the adversary gathers information about the target network using scanning tools, social engineering, or open-source intelligence" },
      { term: "Zero-Day Exploit", definition: "An attack that exploits a previously unknown vulnerability in software or hardware before the vendor has released a patch" }
    ],
    content: `## Security Threats Overview

Network security is a critical concern for every organization. Understanding the types of threats that exist is the first step in building an effective defense. This lesson covers the most common attack vectors you will encounter in real-world networks and on the CCNA exam.

## Types of Network Attacks

Network attacks can be broadly categorized into two groups: **active attacks** and **passive attacks**.

| Attack Type | Description | Example |
|-------------|-------------|---------|
| **Active** | The attacker modifies data or disrupts network operations | DoS, MITM with alteration, SQL injection |
| **Passive** | The attacker monitors or captures data without altering it | Packet sniffing, traffic analysis |

## Denial of Service (DoS) Attacks

A **Denial of Service (DoS)** attack aims to make a network service unavailable by flooding it with illegitimate traffic. When multiple source systems are used, it becomes a **Distributed Denial of Service (DDoS)** attack.

Common DoS attack types include:

- **SYN Flood**: The attacker sends a large number of TCP SYN requests but never completes the three-way handshake, exhausting the server's connection table.
- **UDP Flood**: Sends massive amounts of UDP packets to random ports on the target, forcing it to respond with ICMP unreachable messages.
- **Ping of Death**: Sends malformed or oversized packets using the ping command to crash the target system.
- **Smurf Attack**: Sends ICMP echo requests to a network's broadcast address with the source IP spoofed to the victim's address, causing all hosts to reply to the victim.
- **ICMP Flood**: Overwhelms the target with ICMP echo request (ping) packets.

To mitigate DoS attacks, network administrators use techniques such as rate limiting, ingress/egress filtering, and dedicated DDoS mitigation appliances.

## Reconnaissance Attacks

Before launching a direct attack, threat actors often perform **reconnaissance** to map out the target network. This includes:

- **Packet sniffing**: Using tools like Wireshark to capture and analyze network traffic. On a hub or poorly configured switch, an attacker can see all traffic on the segment.
- **Ping sweeps**: Scanning a range of IP addresses to identify live hosts using tools like \`fping\` or \`nmap\`.
- **Port scanning**: Identifying open ports and services running on target systems.

\`\`\`bash
# Example nmap scan to discover open ports
nmap -sS -p 1-1024 192.168.1.0/24
\`\`\`

- **OSINT (Open Source Intelligence)**: Gathering publicly available information from DNS records, WHOIS databases, social media, and company websites.

## Spoofing Attacks

**Spoofing** involves falsifying identity information to gain unauthorized access or misdirect traffic:

- **IP Spoofing**: Forging the source IP address in packet headers. This is commonly used in reflection attacks and to bypass access control lists.
- **MAC Spoofing**: Changing a device's MAC address to impersonate another device on the local network, potentially bypassing port security or MAC-based filtering.
- **ARP Spoofing (ARP Poisoning)**: Sending falsified ARP messages to associate the attacker's MAC address with the IP address of a legitimate host (often the default gateway). This enables man-in-the-middle attacks.

## Man-in-the-Middle (MITM) Attacks

In a **MITM** attack, the adversary positions themselves between two communicating parties. The attacker can:

1. Passively monitor all traffic (eavesdropping)
2. Actively modify data in transit
3. Redirect traffic to malicious destinations

Common MITM techniques include ARP spoofing, DNS poisoning, and rogue DHCP servers. Encryption protocols like TLS/SSL and IPSec are primary defenses against MITM attacks.

## Social Engineering

**Social engineering** exploits human psychology rather than technical vulnerabilities:

- **Phishing**: Sending fraudulent emails that appear legitimate to trick users into revealing credentials or clicking malicious links.
- **Spear Phishing**: Targeted phishing aimed at specific individuals or organizations.
- **Vishing**: Voice-based phishing using phone calls.
- **Tailgating**: Physically following an authorized person into a restricted area.

## Defense-in-Depth

No single security measure is sufficient. **Defense-in-depth** uses multiple layers of security controls:

1. **Physical security** — locked server rooms, badge access
2. **Network security** — firewalls, ACLs, VLANs, IDS/IPS
3. **Host security** — endpoint protection, OS hardening, patch management
4. **Application security** — input validation, secure coding practices
5. **User education** — security awareness training, phishing simulations

By layering these controls, an attacker must defeat multiple defenses to reach critical assets, significantly reducing the likelihood of a successful breach.`
  },

  2: {
    objectives: [
      "Configure standard and extended numbered ACLs on a Cisco router",
      "Create and apply named ACLs using both standard and extended formats",
      "Calculate and apply wildcard masks correctly in ACL statements",
      "Explain the concept of implicit deny and how ACL processing order affects traffic filtering",
      "Troubleshoot ACL configurations using show and debug commands"
    ],
    keyTerms: [
      { term: "Access Control List (ACL)", definition: "A set of rules configured on a router or switch that permit or deny traffic based on criteria such as source/destination IP, protocol, and port numbers" },
      { term: "Wildcard Mask", definition: "A 32-bit value used in ACLs and OSPF that specifies which bits of an address must match (0) and which bits are ignored (1), the inverse of a subnet mask" },
      { term: "Implicit Deny", definition: "An invisible entry at the end of every ACL that denies all traffic not explicitly permitted by a preceding rule; represented as 'deny any any'" },
      { term: "Standard ACL", definition: "An ACL that filters traffic based solely on the source IP address; numbered 1-99 and 1300-1999" },
      { term: "Extended ACL", definition: "An ACL that filters traffic based on source and destination IP addresses, protocols, and port numbers; numbered 100-199 and 2000-2699" }
    ],
    content: `## Access Control Lists (ACLs)

**Access Control Lists (ACLs)** are one of the most fundamental security tools available on Cisco routers and switches. ACLs are ordered lists of **permit** or **deny** statements, also called **Access Control Entries (ACEs)**, that are processed sequentially against network traffic.

## How ACLs Work

When a packet arrives at an interface with an ACL applied, the router evaluates the packet against each ACE in order, from top to bottom:

1. If the packet matches an ACE, the specified action (permit or deny) is taken immediately.
2. Processing stops at the first match — no further ACEs are evaluated.
3. If no ACE matches, the packet hits the **implicit deny** at the end of the ACL and is dropped.

This means the **order of ACEs is critical**. A broad permit statement placed before a specific deny statement will allow traffic that was intended to be blocked.

> **Important**: Every ACL has an implicit "deny any any" at the end. If you create an ACL with only deny statements, all traffic will be blocked. Always include at least one permit statement.

## ACL Types

| ACL Type | Number Range | Filters On | Applied To |
|----------|-------------|------------|------------|
| Standard Numbered | 1-99, 1300-1999 | Source IP only | Closest to destination |
| Extended Numbered | 100-199, 2000-2699 | Source/dest IP, protocol, port | Closest to source |
| Standard Named | N/A (name-based) | Source IP only | Closest to destination |
| Extended Named | N/A (name-based) | Source/dest IP, protocol, port | Closest to source |

## Standard Numbered ACLs

Standard ACLs filter based on **source IP address only**. They are simple but limited. Since they cannot distinguish based on destination or protocol, they should be placed as **close to the destination** as possible to avoid inadvertently blocking legitimate traffic.

### Configuration Example

\`\`\`
! Create standard ACL 10
Router(config)# access-list 10 permit 192.168.1.0 0.0.0.255
Router(config)# access-list 10 permit host 10.0.0.5
Router(config)# access-list 10 deny any

! Apply to an interface (outbound toward the destination)
Router(config)# interface GigabitEthernet0/1
Router(config-if)# ip access-group 10 out
\`\`\`

The keyword \`host\` is used for a single IP address (equivalent to a wildcard mask of 0.0.0.0). The keyword \`any\` matches all addresses (equivalent to 0.0.0.0 255.255.255.255).

## Extended Numbered ACLs

Extended ACLs provide granular control by filtering on:

- Source and destination IP address
- Protocol (TCP, UDP, ICMP, IP, etc.)
- Source and destination port numbers
- Established connections (for TCP)

### Configuration Example

\`\`\`
! Deny HTTP traffic from 192.168.1.0/24 to 10.0.0.0/8
Router(config)# access-list 100 deny tcp 192.168.1.0 0.0.0.255 10.0.0.0 0.255.255.255 eq 80

! Permit all other IP traffic
Router(config)# access-list 100 permit ip any any

! Apply to an interface (inbound, closest to the source)
Router(config)# interface GigabitEthernet0/0
Router(config-if)# ip access-group 100 in
\`\`\`

Extended ACLs should be placed as **close to the source** as possible to filter unwanted traffic early and conserve bandwidth.

### Common Protocol and Port References

| Protocol | Keyword | Port Number |
|----------|---------|-------------|
| HTTP | www / http | 80 |
| HTTPS | https | 443 |
| FTP Data | ftp-data | 20 |
| FTP Control | ftp | 21 |
| SSH | ssh | 22 |
| Telnet | telnet | 23 |
| SMTP | smtp | 25 |
| DNS | domain | 53 |
| DHCP Server | bootps | 67 |
| DHCP Client | bootpc | 68 |

### Filtering Based on Established Connections

For TCP traffic, you can use the \`established\` keyword to allow only return traffic for sessions that were initiated from the inside:

\`\`\`
Router(config)# access-list 110 permit tcp any any established
\`\`\`

This matches packets with the ACK or RST bits set, indicating they are part of an existing connection.

## Wildcard Masks

A **wildcard mask** is the inverse of a subnet mask. Each bit position indicates whether the corresponding bit in the IP address must match (0) or is ignored (1).

| Subnet Mask | Wildcard Mask | Meaning |
|-------------|---------------|---------|
| 255.255.255.0 (/24) | 0.0.0.255 | Match first 24 bits |
| 255.255.255.252 (/30) | 0.0.0.3 | Match first 30 bits |
| 255.255.0.0 (/16) | 0.0.255.255 | Match first 16 bits |

**Example**: To match the network 192.168.1.0/24, use the wildcard mask 0.0.0.255:
\`\`\`
access-list 10 permit 192.168.1.0 0.0.0.255
\`\`\`

**Non-contiguous wildcard masks** are also possible in Cisco IOS. For example, to match only even-numbered hosts in a subnet:
\`\`\`
access-list 10 permit 192.168.1.0 0.0.0.254
\`\`\`
This matches addresses where the last bit is 0 (even numbers).

## Named ACLs

Named ACLs use descriptive names instead of numbers, making them easier to manage and identify.

### Standard Named ACL

\`\`\`
Router(config)# ip access-list standard BLOCK_SALES
Router(config-std-nacl)# permit 192.168.10.0 0.0.0.255
Router(config-std-nacl)# deny 192.168.20.0 0.0.0.255
Router(config-std-nacl)# permit any

Router(config)# interface GigabitEthernet0/1
Router(config-if)# ip access-group BLOCK_SALES out
\`\`\`

### Extended Named ACL

\`\`\`
Router(config)# ip access-list extended RESTRICT_WEB
Router(config-ext-nacl)# deny tcp 192.168.1.0 0.0.0.255 any eq 80
Router(config-ext-nacl)# deny tcp 192.168.1.0 0.0.0.255 any eq 443
Router(config-ext-nacl)# permit ip any any

Router(config)# interface GigabitEthernet0/0
Router(config-if)# ip access-group RESTRICT_WEB in
\`\`\`

Named ACLs have a significant advantage: individual ACEs can be removed or inserted without deleting the entire ACL. With numbered ACLs, you must remove and reconfigure the entire list to make changes.

## Modifying Named ACLs

Within named ACL configuration mode, you can insert or remove specific entries:

\`\`\`
Router(config)# ip access-list extended RESTRICT_WEB
Router(config-ext-nacl)# no deny tcp 192.168.1.0 0.0.0.255 any eq 80
Router(config-ext-nacl)# 5 permit tcp 192.168.1.0 0.0.0.255 host 10.0.0.1 eq 443
\`\`\`

Using sequence numbers (like \`5\` above) allows you to control the exact position of an ACE within the list.

## Verifying and Troubleshooting ACLs

\`\`\`
! Display all ACLs with hit counts
Router# show access-lists

! Display a specific ACL
Router# show access-lists 100

! Display the ACL applied to a specific interface
Router# show ip interface GigabitEthernet0/0

! Debug ACL processing in real-time
Router# debug ip packet 100 detail
\`\`\`

The hit count in \`show access-lists\` output shows how many packets matched each ACE, which is invaluable for troubleshooting.

## ACL Best Practices

1. Place extended ACLs close to the **source**, standard ACLs close to the **destination**.
2. Always account for the implicit deny — include a final permit statement if needed.
3. Use named ACLs for easier management on modern IOS versions.
4. Document each ACE with remarks using the \`remark\` keyword.
5. Test ACLs carefully before applying to production interfaces.
6. Remember that ACLs do not filter traffic originated by the router itself — only transit traffic.`
  },

  3: {
    objectives: [
      "Configure port security on a Cisco switch to restrict access by MAC address",
      "Explain the three port security violation modes and their behaviors",
      "Configure sticky MAC address learning for dynamic MAC address persistence",
      "Understand DHCP snooping and its role in preventing rogue DHCP servers",
      "Differentiate between trusted and untrusted ports in a DHCP snooping environment"
    ],
    keyTerms: [
      { term: "Port Security", definition: "A Layer 2 security feature on Cisco switches that restricts which MAC addresses are allowed to access a given switch port" },
      { term: "Sticky MAC", definition: "A port security feature that dynamically learns and permanently saves MAC addresses to the running configuration, combining the flexibility of dynamic learning with the persistence of static entries" },
      { term: "DHCP Snooping", definition: "A security feature that filters untrusted DHCP messages and builds a binding table of legitimate IP-to-MAC-to-port mappings to prevent rogue DHCP server attacks" },
      { term: "Violation Mode", definition: "The action taken by a switch port when an unauthorized device attempts to access a port-secured interface; modes include protect, restrict, and shutdown" },
      { term: "Untrusted Port", definition: "A switch port connected to an end user or network segment where DHCP snooping drops DHCP server messages (OFFER, ACK, NAK) to prevent rogue DHCP server activity" }
    ],
    content: `## Port Security & DHCP Snooping

Layer 2 security is often overlooked but is critical for protecting the access layer of a network. This lesson covers two essential switch security features: **port security** and **DHCP snooping**.

## Port Security Overview

**Port security** limits which MAC addresses can send frames into a switch port. This prevents unauthorized devices from connecting to the network by simply plugging into an available wall jack or switch port.

Port security works on access ports and can also be configured on trunk ports. Key parameters include:

- **Maximum MAC addresses**: The number of allowed MAC addresses per port (default is 1).
- **Secure MAC addresses**: The specific MAC addresses allowed on the port (static, dynamic, or sticky).
- **Violation mode**: What happens when an unauthorized MAC address is detected.

## Enabling Port Security

Before configuring port security, the port must be set to **access mode** (not dynamic auto/desirable) and must not be in a channel group:

\`\`\`
Switch(config)# interface FastEthernet0/1
Switch(config-if)# switchport mode access
Switch(config-if)# switchport port-security
\`\`\`

### Configuring Maximum MAC Addresses

\`\`\`
Switch(config-if)# switchport port-security maximum 2
\`\`\`

This allows up to 2 MAC addresses on the port. If a third device attempts to send traffic, a violation occurs.

### Static Secure MAC Addresses

You can manually specify which MAC addresses are allowed:

\`\`\`
Switch(config-if)# switchport port-security mac-address 001A.2B3C.4D5E
Switch(config-if)# switchport port-security mac-address 001A.2B3C.4D5F
\`\`\`

## Sticky MAC Addresses

**Sticky MAC** learning combines the simplicity of dynamic learning with the persistence of static configuration. When sticky learning is enabled, the switch dynamically learns MAC addresses and "sticks" them to the running configuration:

\`\`\`
Switch(config-if)# switchport port-security mac-address sticky
\`\`\`

When a device sends its first frame through the port, the switch learns its MAC address and adds it as a sticky secure MAC address. This entry persists in the running configuration even if the interface goes down.

To save sticky entries permanently, you must copy the running configuration to the startup configuration:

\`\`\`
Switch# copy running-config startup-config
\`\`\`

Without this step, sticky MAC entries are lost on a reboot and must be relearned.

## Violation Modes

When an unauthorized MAC address is detected on a secured port, the switch takes action based on the configured **violation mode**:

| Mode | Action | Drops Offending Traffic | Sends Syslog/SNMP | Increments Violation Counter | Shuts Down Port |
|------|--------|------------------------|-------------------|-------------------------------|-----------------|
| **protect** | Drops packets from unknown MACs | Yes | No | No | No |
| **restrict** | Drops packets from unknown MACs | Yes | Yes | Yes | No |
| **shutdown** | Shuts down the port (err-disabled) | Yes | Yes | Yes | Yes |

**Shutdown mode** is the **default**. When a violation occurs in shutdown mode, the port enters the **err-disabled** state. To recover, an administrator must manually re-enable the port:

\`\`\`
Switch(config)# interface FastEthernet0/1
Switch(config-if)# shutdown
Switch(config-if)# no shutdown
\`\`\`

Alternatively, you can configure automatic recovery after a timeout:

\`\`\`
Switch(config)# errdisable recovery cause psecure-violation
Switch(config)# errdisable recovery interval 300
\`\`\`

This automatically recovers err-disabled ports due to port security violations after 300 seconds.

## Verifying Port Security

\`\`\`
! Display port security status for all interfaces
Switch# show port-security

! Display port security details for a specific interface
Switch# show port-security interface FastEthernet0/1

! Display all secure MAC addresses
Switch# show port-security address
\`\`\`

Sample output from \`show port-security interface\`:
\`\`\`
Port Security              : Enabled
Port Status                : Secure-up
Violation Mode             : Shutdown
Aging Time                 : 0 mins
Aging Type                 : Absolute
SecureStatic Address Aging : Disabled
Maximum MAC Addresses      : 1
Total MAC Addresses        : 1
Configured MAC Addresses   : 0
Sticky MAC Addresses       : 1
Last Source Address:Vlan    : 001A.2B3C.4D5E:1
Security Violation Count   : 0
\`\`\`

## DHCP Snooping Overview

**DHCP snooping** is a Layer 2 security feature that protects against **rogue DHCP server attacks**. In a typical attack, a malicious user connects a rogue DHCP server to the network and offers incorrect IP configuration (wrong gateway, DNS, etc.) to clients, enabling man-in-the-middle attacks.

DHCP snooping works by classifying switch ports as either **trusted** or **untrusted**:

- **Trusted ports**: Connect to legitimate DHCP servers or other trusted infrastructure (uplinks to routers, other switches, or the actual DHCP server). Only trusted ports can send DHCP server messages (OFFER, ACK, NAK).
- **Untrusted ports**: Connect to end-user devices. DHCP snooping filters DHCP server messages arriving on untrusted ports, dropping any OFFER, ACK, or NAK responses.

## DHCP Snooping Binding Table

As DHCP snooping processes DHCP traffic, it builds a **binding table** that maps:

| IP Address | MAC Address | VLAN | Interface | Lease Time |
|------------|-------------|------|-----------|------------|
| 192.168.1.10 | 001A.2B3C.4D5E | 1 | Fa0/1 | 86400 |
| 192.168.1.11 | 001A.2B3C.4D5F | 1 | Fa0/2 | 86400 |

This binding table is used by other security features like Dynamic ARP Inspection (DAI) and IP Source Guard.

## Configuring DHCP Snooping

### Enable DHCP Snooping Globally

\`\`\`
Switch(config)# ip dhcp snooping
\`\`\`

### Enable for Specific VLANs

\`\`\`
Switch(config)# ip dhcp snooping vlan 10,20,30
\`\`\`

### Configure Trusted Ports

\`\`\`
Switch(config)# interface GigabitEthernet0/1
Switch(config-if)# ip dhcp snooping trust
\`\`\`

Upstream interfaces connecting to the legitimate DHCP server should be trusted. Access ports connecting to end users are untrusted by default.

### Set Rate Limiting on Untrusted Ports

To prevent DHCP exhaustion attacks where an attacker sends thousands of DHCP requests to consume the entire address pool:

\`\`\`
Switch(config)# interface FastEthernet0/1
Switch(config-if)# ip dhcp snooping limit rate 15
\`\`\`

This limits the port to 15 DHCP packets per second. Exceeding this rate causes the port to be err-disabled.

### Add Option 82 (Relay Agent Information)

\`\`\`
Switch(config)# ip dhcp snooping information option
\`\`\`

Option 82 adds relay agent information to DHCP requests, helping the DHCP server identify which switch port and VLAN the request originated from.

## Verifying DHCP Snooping

\`\`\`
! Display DHCP snooping status and configuration
Switch# show ip dhcp snooping

! Display the DHCP snooping binding table
Switch# show ip dhcp snooping binding

! Display DHCP snooping statistics
Switch# show ip dhcp snooping statistics
\`\`\`

## Combining Port Security and DHCP Snooping

For maximum Layer 2 security, use both features together:

1. **Port security** restricts which MAC addresses can access each port.
2. **DHCP snooping** prevents rogue DHCP servers and validates IP-to-MAC-to-port bindings.
3. **Dynamic ARP Inspection (DAI)** uses the DHCP snooping binding table to validate ARP packets.
4. **IP Source Guard** uses the binding table to filter traffic from non-legitimate IP sources.

This layered approach ensures that even if one security mechanism is bypassed, additional layers provide protection.`
  },

  4: {
    objectives: [
      "Explain the three components of AAA (Authentication, Authorization, and Accounting)",
      "Configure local AAA on a Cisco router using named method lists",
      "Describe how RADIUS and TACACS+ protocols differ in their operation and security features",
      "Configure 802.1X port-based network access control with supplicant, authenticator, and authentication server roles",
      "Implement AAA best practices in enterprise network environments"
    ],
    keyTerms: [
      { term: "AAA", definition: "Authentication, Authorization, and Accounting — a security framework that controls who can access the network (authentication), what they can do (authorization), and tracks their actions (accounting)" },
      { term: "RADIUS", definition: "Remote Authentication Dial-In User Service — an open-standard AAA protocol that uses UDP ports 1812 (authentication) and 1813 (accounting), encrypting only the password" },
      { term: "TACACS+", definition: "Terminal Access Controller Access-Control System Plus — a Cisco proprietary AAA protocol that uses TCP port 49 and encrypts the entire packet body for enhanced security" },
      { term: "802.1X", definition: "An IEEE standard for port-based network access control that requires devices (supplicants) to authenticate before gaining network access through an authenticator to an authentication server" },
      { term: "Supplicant", definition: "The client device or software that requests network access and responds to authentication challenges in an 802.1X environment" }
    ],
    content: `## AAA & 802.1X

**AAA (Authentication, Authorization, and Accounting)** is the cornerstone of network access security. It provides a structured framework for controlling who accesses the network, what they can do, and recording their activities. **802.1X** extends these concepts to the physical switch port level.

## The AAA Framework

### Authentication

**Authentication** answers the question: "Who are you?" It verifies the identity of a user or device before granting access. Authentication methods include:

- Username and password
- One-time passwords (OTP)
- Digital certificates
- Biometrics
- Multi-factor authentication (MFA)

### Authorization

**Authorization** answers the question: "What are you allowed to do?" After authentication succeeds, authorization determines which resources the user can access and what actions they can perform. Examples include:

- Access to specific VLANs
- Permission to use certain protocols
- Privilege level on a router (0-15)
- Time-of-day restrictions

### Accounting

**Accounting** answers the question: "What did you do?" It records user activities for auditing and troubleshooting:

- Login and logout times
- Commands executed
- Resources accessed
- Data transferred
- Connection duration

## AAA Protocols: RADIUS vs TACACS+

| Feature | RADIUS | TACACS+ |
|---------|--------|---------|
| **Standard** | Open (RFC 2865) | Cisco Proprietary |
| **Transport** | UDP (1812/1813) | TCP (49) |
| **Encryption** | Password only | Entire packet body |
| **AAA Support** | Combines auth and accounting | Separates auth, authz, and accounting |
| **Protocol Support** | Primarily network access | Device administration (CLI access) |
| **Use Case** | 802.1X, VPN, Wi-Fi | Router/switch CLI management |

**RADIUS** is the preferred protocol for network access scenarios (802.1X, wireless authentication, VPN). **TACACS+** is preferred for device administration because it separates the three AAA functions and encrypts the entire packet.

## Configuring AAA on Cisco Routers

### Enable AAA

\`\`\`
Router(config)# aaa new-model
\`\`\`

> **Warning**: Enabling \`aaa new-model\` immediately applies default AAA settings. Ensure you have console access and a local fallback account before enabling this on production devices.

### Configure Local AAA

For smaller networks without a dedicated AAA server:

\`\`\`
! Create local users
Router(config)# username admin privilege 15 secret Str0ngP@ss!

! Define authentication method list
Router(config)# aaa authentication login default local
Router(config)# aaa authentication enable default enable

! Define authorization method list
Router(config)# aaa authorization exec default local

! Define accounting method list
Router(config)# aaa accounting exec default start-stop local
Router(config)# aaa accounting commands 15 default start-stop local
\`\`\`

### Configure AAA with RADIUS

For enterprise environments with a RADIUS server (such as Cisco ISE or FreeRADIUS):

\`\`\`
! Define the RADIUS server
Router(config)# radius server MY_RADIUS
Router(config-radius-server)# address ipv4 10.0.0.100 auth-port 1812 acct-port 1813
Router(config-radius-server)# key SecretKey123

! Create a server group (optional but recommended)
Router(config)# aaa group server radius RADIUS_GROUP
Router(config-sg-radius)# server name MY_RADIUS

! Configure AAA using RADIUS with local fallback
Router(config)# aaa authentication login AUTH_LIST group RADIUS_GROUP local
Router(config)# aaa authorization exec AUTHZ_LIST group RADIUS_GROUP local
Router(config)# aaa accounting exec ACCT_LIST start-stop group RADIUS_GROUP

! Apply the method list to console and VTY lines
Router(config)# line console 0
Router(config-line)# login authentication AUTH_LIST
Router(config-line)# authorization exec AUTHZ_LIST
Router(config-line)# accounting commands 15 ACCT_LIST

Router(config)# line vty 0 4
Router(config-line)# login authentication AUTH_LIST
Router(config-line)# authorization exec AUTHZ_LIST
Router(config-line)# transport input ssh
\`\`\`

The \`local\` keyword at the end of the method list acts as a **fallback** — if the RADIUS server is unreachable, the router uses locally configured credentials.

### Method List Keywords

| Keyword | Description |
|---------|-------------|
| \`group\` | Use a named group of AAA servers |
| \`local\` | Use the local username database |
| \`local-case\` | Use local database with case-sensitive passwords |
| \`enable\` | Use the enable password |
| \`none\` | No authentication (use with caution) |
| \`default\` | The default method list applied to all lines |

## 802.1X Port-Based Network Access Control

**IEEE 802.1X** provides port-based network access control. Before 802.1X, a device simply plugged into a switch port and gained full network access. With 802.1X, the port remains blocked until the device authenticates.

### 802.1X Roles

The 802.1X framework defines three roles:

1. **Supplicant**: The client device requesting access (laptop, phone, etc.). The supplicant runs 802.1X client software (built into most modern operating systems).
2. **Authenticator**: The network device that controls physical access to the network (the switch or wireless access point). It acts as an intermediary between the supplicant and the authentication server.
3. **Authentication Server**: The server that validates the supplicant's credentials (typically a RADIUS server like Cisco ISE).

### 802.1X Authentication Process

The authentication flow uses the **Extensible Authentication Protocol (EAP)**:

1. The switch port detects a new device (supplicant) and blocks all traffic except 802.1X EAPOL (EAP over LAN) frames.
2. The switch sends an EAP-Request/Identity to the supplicant.
3. The supplicant responds with EAP-Response/Identity containing its username.
4. The switch forwards this to the RADIUS server.
5. The RADIUS server challenges the supplicant through EAP (methods include EAP-TLS with certificates, PEAP with username/password, etc.).
6. The supplicant provides the required credentials.
7. The RADIUS server sends an Access-Accept or Access-Reject.
8. On Access-Accept, the switch opens the port and applies the authorized VLAN and ACLs.
9. On Access-Reject, the port remains blocked or moves to a guest VLAN.

### Configuring 802.1X on a Cisco Switch

\`\`\`
! Enable AAA
Switch(config)# aaa new-model

! Configure RADIUS server
Switch(config)# radius server ISE_SERVER
Switch(config-radius-server)# address ipv4 10.0.0.100 auth-port 1812 acct-port 1813
Switch(config-radius-server)# key RadiusSecret

! Configure AAA method lists for 802.1X
Switch(config)# aaa authentication dot1x default group radius
Switch(config)# aaa authorization network default group radius

! Enable 802.1X globally
Switch(config)# dot1x system-auth-control

! Configure the access switch port
Switch(config)# interface FastEthernet0/1
Switch(config-if)# switchport mode access
Switch(config-if)# authentication port-control auto
Switch(config-if)# dot1x pae authenticator

! Optional: Configure a guest VLAN for unauthenticated devices
Switch(config-if)# authentication fallback RADIUS_SERVER
Switch(config-if)# authentication event fail action next-method
\`\`\`

### 802.1X Port States

| State | Description |
|-------|-------------|
| **Unauthorized** | Port blocks all traffic except EAPOL; default state |
| **Authorized** | Port forwards all traffic after successful authentication |
| **Force-Authorized** | Port always allows traffic (bypasses authentication) |
| **Force-Unauthorized** | Port always blocks traffic |

To configure a port as force-authorized (for devices that do not support 802.1X, like printers):

\`\`\`
Switch(config-if)# authentication port-control force-authorized
\`\`\`

### MAB (MAC Authentication Bypass)

For devices that cannot run 802.1X supplicant software (printers, IP cameras, IoT devices), **MAB** allows authentication based on MAC address:

\`\`\`
Switch(config-if)# mab
Switch(config-if)# authentication order dot1x mab
Switch(config-if)# authentication priority dot1x mab
\`\`\`

The switch first attempts 802.1X. If the device does not respond, it falls back to MAB, sending the device's MAC address to the RADIUS server for authentication.

## Verifying AAA and 802.1X

\`\`\`
! Display AAA configuration
Router# show aaa sessions
Router# show aaa user all

! Display 802.1X status
Switch# show dot1x
Switch# show dot1x interface FastEthernet0/1
Switch# show dot1x interface FastEthernet0/1 details

! Display authentication sessions
Switch# show authentication sessions
Switch# show authentication sessions interface FastEthernet0/1
\`\`\`

## AAA Best Practices

1. Always configure a **local fallback** account before enabling AAA with a remote server.
2. Use **TACACS+** for device administration, **RADIUS** for network access.
3. Implement **multi-factor authentication** for administrative access.
4. Enable **accounting** to maintain an audit trail of all administrative actions.
5. Use **privilege levels** and **role-based access** to limit what each administrator can do.
6. Test AAA configuration thoroughly on a non-production device before deploying to production.`
  },

  5: {
    objectives: [
      "Distinguish between site-to-site and remote access VPN architectures",
      "Explain the IPSec framework including IKE phases, AH, and ESP protocols",
      "Describe GRE tunneling and its use cases in combination with IPSec",
      "Configure zone-based firewall (ZBF) policies on a Cisco router",
      "Understand how VPN and firewall technologies work together to secure network communications"
    ],
    keyTerms: [
      { term: "Virtual Private Network (VPN)", definition: "A technology that creates an encrypted tunnel across a public network (such as the Internet) to provide secure remote connectivity between sites or users" },
      { term: "IPSec", definition: "Internet Protocol Security — a framework of protocols that provides encryption, authentication, and integrity verification for IP packets, commonly used to build VPN tunnels" },
      { term: "GRE Tunnel", definition: "Generic Routing Encapsulation — a tunneling protocol that encapsulates a wide variety of protocol packet types inside IP tunnels, enabling routing protocols to operate across the tunnel" },
      { term: "Zone-Based Firewall (ZBF)", definition: "A Cisco IOS security feature that organizes interfaces into zones and applies policies between zones, replacing the older Context-Based Access Control (CBAC) model" },
      { term: "IKE", definition: "Internet Key Exchange — a protocol used in IPSec to negotiate security associations, authenticate peers, and establish shared encryption keys; operates in two phases" }
    ],
    content: `## VPN Concepts & Firewalls

**Virtual Private Networks (VPNs)** and **firewalls** are essential components of a secure network architecture. VPNs provide secure connectivity over untrusted networks, while firewalls control what traffic is allowed to pass between network segments. This lesson covers both technologies as tested on the CCNA exam.

## VPN Overview

A **VPN** creates a secure, encrypted tunnel across an untrusted network (typically the Internet) so that remote sites or users can communicate as if they were directly connected to the private network.

### VPN Types

| Type | Description | Use Case | Protocols |
|------|-------------|----------|-----------|
| **Site-to-Site** | Connects two entire networks permanently | Branch office to headquarters | IPSec, GRE over IPSec |
| **Remote Access** | Connects individual users to a network | Work-from-home employees | IPSec, SSL/TLS, L2TP |

## Site-to-Site VPN

A **site-to-site VPN** creates a permanent encrypted tunnel between two routers (or firewalls) at different locations. All traffic between the sites traverses the encrypted tunnel transparently — end users do not need VPN client software.

**Example**: A company has a headquarters in New York and a branch office in London. Each location has a router with a public IP address. An IPSec tunnel is configured between these routers so that all inter-office traffic is encrypted.

### Site-to-Site VPN Characteristics

- Tunnel endpoints are routers, firewalls, or VPN concentrators
- All traffic between sites passes through the tunnel
- Configuration is done on the network devices, not on end-user machines
- Typically uses IPSec for encryption
- Provides full network-to-network connectivity

## Remote Access VPN

A **remote access VPN** allows individual users to securely connect to the corporate network from anywhere using VPN client software. The user's device establishes an encrypted tunnel to a VPN concentrator or firewall at the corporate site.

### Remote Access VPN Characteristics

- Each user runs VPN client software
- Connection is initiated by the user (on-demand)
- Typically uses SSL/TLS (clientless) or IPSec (client-based)
- User authenticates with credentials and optionally a certificate
- Traffic from the user's device to the corporate network is encrypted

Common protocols for remote access include:

- **SSL/TLS VPN**: Runs over HTTPS (port 443). Can be clientless (browser-based) or use a thin client.
- **IPSec VPN**: Requires dedicated client software but provides robust encryption.
- **L2TP/IPSec**: Combines Layer 2 Tunneling Protocol with IPSec encryption.

## IPSec Framework

**IPSec (Internet Protocol Security)** is the most widely used VPN technology. It is not a single protocol but a **framework** of protocols and algorithms that provide three key services:

### IPSec Security Services

1. **Confidentiality (Encryption)**: Ensures data cannot be read by unauthorized parties. Algorithms: AES (preferred), 3DES.
2. **Authentication**: Verifies the identity of the remote peer. Methods: Pre-shared keys (PSK), digital certificates.
3. **Integrity**: Ensures data was not modified in transit. Algorithms: SHA-256, SHA-384, MD5 (deprecated).

### IPSec Protocols

| Protocol | Function | IP Protocol Number |
|----------|----------|-------------------|
| **AH (Authentication Header)** | Provides integrity and authentication but NOT encryption | 51 |
| **ESP (Encapsulating Security Payload)** | Provides integrity, authentication, AND encryption | 50 |

**ESP** is the preferred protocol because it provides all three services. AH is rarely used in modern deployments because it cannot encrypt data and has NAT traversal issues.

### IPSec Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| **Transport Mode** | Encrypts only the payload; original IP header is preserved | Host-to-host communication |
| **Tunnel Mode** | Encrypts the entire original packet; a new IP header is added | Site-to-site VPN (most common) |

In **tunnel mode** (used for site-to-site VPNs), the original IP packet is completely encapsulated inside a new IP packet with a new header. This hides the internal network addressing from the public network.

### IKE (Internet Key Exchange)

**IKE** negotiates the Security Associations (SAs) between peers. It operates in two phases:

**IKE Phase 1 — ISAKMP SA (Management Tunnel)**:
- Establishes a secure, authenticated channel between peers
- Negotiates encryption, hashing, authentication method, and Diffie-Hellman group
- Two modes: Main Mode (more secure, 6 messages) or Aggressive Mode (faster, 3 messages)
- The result is an ISAKMP SA that protects Phase 2 negotiations

**IKE Phase 2 — IPSec SA (Data Tunnel)**:
- Negotiates the parameters for the actual data encryption (ESP)
- Uses Quick Mode (3 messages)
- The result is two IPSec SAs (one for each direction)

### Configuring a Site-to-Site IPSec VPN

Here is a simplified configuration for an IPSec VPN tunnel between two routers:

\`\`\`
! ===== STEP 1: Define interesting traffic with ACL =====
Router(config)# ip access-list extended VPN_TRAFFIC
Router(config-ext-nacl)# permit ip 192.168.1.0 0.0.0.255 192.168.2.0 0.0.0.255

! ===== STEP 2: Configure IKE Phase 1 (ISAKMP Policy) =====
Router(config)# crypto isakmp policy 10
Router(config-isakmp)# encryption aes 256
Router(config-isakmp)# hash sha256
Router(config-isakmp)# authentication pre-share
Router(config-isakmp)# group 14
Router(config-isakmp)# lifetime 86400

! ===== STEP 3: Configure pre-shared key =====
Router(config)# crypto isakmp key Pr3$haredK3y address 203.0.113.2

! ===== STEP 4: Configure IKE Phase 2 (IPSec Transform Set) =====
Router(config)# crypto ipsec transform-set MY_TRANSFORM esp-aes 256 esp-sha256-hmac
Router(cfg-crypto-trans)# mode tunnel

! ===== STEP 5: Create crypto map =====
Router(config)# crypto map MY_VPN 10 ipsec-isakmp
Router(config-crypto-map)# set peer 203.0.113.2
Router(config-crypto-map)# set transform-set MY_TRANSFORM
Router(config-crypto-map)# match address VPN_TRAFFIC

! ===== STEP 6: Apply crypto map to interface =====
Router(config)# interface GigabitEthernet0/0
Router(config-if)# crypto map MY_VPN
\`\`\`

The configuration on the peer router must mirror these settings (same encryption, hash, pre-shared key, etc.).

### Verifying IPSec VPN

\`\`\`
! Check IKE Phase 1 (ISAKMP) status
Router# show crypto isakmp sa

! Check IKE Phase 2 (IPSec) status
Router# show crypto ipsec sa

! View detailed IPSec statistics
Router# show crypto ipsec sa detail

! Debug IKE negotiations
Router# debug crypto isakmp
Router# debug crypto ipsec
\`\`\`

## GRE Tunnels

**GRE (Generic Routing Encapsulation)** is a tunneling protocol that can encapsulate a wide variety of protocol types. GRE by itself provides **no encryption** — it simply creates a logical point-to-point tunnel over IP.

### GRE Characteristics

- Encapsulates multicast, broadcast, and non-IP traffic (unlike IPSec alone)
- Supports dynamic routing protocols (OSPF, EIGRP) across the tunnel
- Adds a 24-byte overhead header
- Protocol number 47

### Why Combine GRE with IPSec?

IPSec alone has limitations:
- IPSec only supports **unicast** traffic
- IPSec cannot carry **routing protocol** packets directly
- IPSec does not natively support **multicast** or **broadcast**

GRE solves these problems by encapsulating all traffic types, and then IPSec encrypts the GRE-encapsulated packets. This gives you the best of both worlds: GRE's protocol flexibility with IPSec's security.

### Configuring a GRE over IPSec Tunnel

\`\`\`
! Create the GRE tunnel interface
Router(config)# interface Tunnel0
Router(config-if)# ip address 10.10.10.1 255.255.255.252
Router(config-if)# tunnel source GigabitEthernet0/0
Router(config-if)# tunnel destination 203.0.113.2
Router(config-if)# tunnel mode gre ip

! Configure OSPF over the tunnel
Router(config)# router ospf 1
Router(config-router)# network 10.10.10.0 0.0.0.3 area 0
Router(config-router)# network 192.168.1.0 0.0.0.255 area 0

! Apply IPSec protection to the tunnel (using IPSec profile instead of crypto map)
Router(config)# crypto ipsec transform-set GRE_TRANSFORM esp-aes 256 esp-sha256-hmac
Router(cfg-crypto-trans)# mode transport

Router(config)# crypto ipsec profile GRE_PROFILE
Router(config-ipsec-profile)# set transform-set GRE_TRANSFORM

Router(config)# interface Tunnel0
Router(config-if)# tunnel protection ipsec profile GRE_PROFILE
\`\`\`

> **Note**: When using GRE over IPSec, use **transport mode** (not tunnel mode) for the IPSec transform set. GRE already provides the tunnel encapsulation, so IPSec only needs to encrypt the payload.

## Zone-Based Firewall (ZBF)

**Zone-Based Firewall (ZBF)** is a Cisco IOS security feature that replaces the older CBAC (Context-Based Access Control) model. ZBF organizes interfaces into **zones** and applies security policies between zones.

### ZBF Concepts

- **Zone**: A group of interfaces that share a common security policy (e.g., INSIDE, OUTSIDE, DMZ).
- **Zone-Pair**: A unidirectional pairing of a source zone to a destination zone (e.g., INSIDE-to-OUTSIDE).
- **Policy Map**: Defines the actions (inspect, drop, pass) applied to traffic flowing between zones.

### Default ZBF Behavior

- Traffic between interfaces in the **same zone** is allowed (pass)
- Traffic between interfaces in **different zones** is **denied** by default
- Traffic to or from an interface **not in any zone** is allowed (to avoid breaking management access)

### ZBF Actions

| Action | Description |
|--------|-------------|
| **Inspect** | Like a stateful firewall — allows return traffic automatically |
| **Drop** | Silently discards traffic (or sends reset with \`log\` keyword) |
| **Pass** | Allows traffic but does NOT track state (return traffic must be explicitly allowed) |

> **Important**: Use **inspect** for most traffic (TCP, UDP, ICMP) because it tracks connections and allows return traffic. Use **pass** only when stateful tracking is not needed.

### Configuring Zone-Based Firewall

\`\`\`
! ===== STEP 1: Create security zones =====
Router(config)# zone security INSIDE
Router(config)# zone security OUTSIDE
Router(config)# zone security DMZ

! ===== STEP 2: Assign interfaces to zones =====
Router(config)# interface GigabitEthernet0/0
Router(config-if)# zone-member security INSIDE

Router(config)# interface GigabitEthernet0/1
Router(config-if)# zone-member security OUTSIDE

Router(config)# interface GigabitEthernet0/2
Router(config-if)# zone-member security DMZ

! ===== STEP 3: Define class maps to match traffic =====
Router(config)# class-map type inspect match-any INSIDE_TO_OUTSIDE
Router(config-cmap)# match protocol tcp
Router(config-cmap)# match protocol udp
Router(config-cmap)# match protocol icmp

Router(config)# class-map type inspect match-any OUTSIDE_TO_DMZ
Router(config-cmap)# match protocol tcp
Router(config-cmap)# match protocol http
Router(config-cmap)# match protocol https

! ===== STEP 4: Define policy maps =====
Router(config)# policy-map type inspect INSIDE_TO_OUTSIDE_POLICY
Router(config-pmap)# class type inspect INSIDE_TO_OUTSIDE
Router(config-pmap-c)# inspect

Router(config-pmap)# class class-default
Router(config-pmap-c)# drop log

Router(config)# policy-map type inspect OUTSIDE_TO_DMZ_POLICY
Router(config-pmap)# class type inspect OUTSIDE_TO_DMZ
Router(config-pmap-c)# inspect

Router(config-pmap)# class class-default
Router(config-pmap-c)# drop log

! ===== STEP 5: Create zone-pairs and apply policies =====
Router(config)# zone-pair security INSIDE_TO_OUTSIDE source INSIDE destination OUTSIDE
Router(config-sec-zone-pair)# service-policy type inspect INSIDE_TO_OUTSIDE_POLICY

Router(config)# zone-pair security OUTSIDE_TO_DMZ source OUTSIDE destination DMZ
Router(config-sec-zone-pair)# service-policy type inspect OUTSIDE_TO_DMZ_POLICY

! ===== STEP 6: Allow DMZ to initiate traffic to inside (if needed) =====
Router(config)# zone-pair security DMZ_TO_INSIDE source DMZ destination INSIDE
Router(config-sec-zone-pair)# service-policy type inspect DMZ_TO_INSIDE_POLICY
\`\`\`

### Verifying Zone-Based Firewall

\`\`\`
! Display zone configuration
Router# show zone security

! Display zone-pair configuration
Router# show zone-pair security

! Display policy-map statistics
Router# show policy-map type inspect zone-pair

! Display active sessions tracked by the inspect action
Router# show policy-map type inspect sessions
\`\`\`

## VPN and Firewall Integration

In a typical enterprise network, VPN and firewall technologies work together:

1. The **firewall** (ZBF or dedicated appliance) controls what traffic enters and leaves each network zone.
2. **Site-to-site VPN** tunnels connect branch offices through the firewall.
3. **Remote access VPN** terminates on the firewall or VPN concentrator, allowing remote workers secure access.
4. **GRE over IPSec** enables dynamic routing between sites while maintaining encryption.

The recommended approach is to place VPN termination on the firewall itself (if it supports it) or on a router in the DMZ, behind the external firewall. This ensures all VPN traffic is inspected before reaching the internal network.`
  }
};
