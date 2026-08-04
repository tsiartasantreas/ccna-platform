export const module2Lessons: Record<number, { objectives: string[]; keyTerms: { term: string; definition: string }[]; content: string }> = {
  1: {
    objectives: [
      'Understand Ethernet frame format and components',
      'Identify MAC address structure and types',
      'Compare collision domains and broadcast domains',
      'Explain how Ethernet operates at Layer 2',
    ],
    keyTerms: [
      { term: 'MAC Address', definition: 'A 48-bit hardware address burned into a network interface card (e.g., AA:BB:CC:DD:EE:FF)' },
      { term: 'Ethernet Frame', definition: 'The Layer 2 PDU containing destination/source MAC, type, data, and FCS' },
      { term: 'Collision Domain', definition: 'A network segment where devices can cause collisions with each other' },
      { term: 'Broadcast Domain', definition: 'A network segment where broadcast frames are received by all devices' },
      { term: 'FCS', definition: 'Frame Check Sequence — a trailer field used for error detection (CRC)' },
    ],
    content: `## Ethernet Fundamentals

**Ethernet** (IEEE 802.3) is the dominant LAN technology. It operates at Layer 1 (Physical) and Layer 2 (Data Link) of the OSI model.

### Ethernet Frame Format

| Field | Size | Description |
|-------|------|-------------|
| **Preamble** | 7 bytes | Synchronization pattern (alternating 1s and 0s) |
| **SFD** | 1 byte | Start Frame Delimiter (10101011) |
| **Destination MAC** | 6 bytes | MAC address of the receiving device |
| **Source MAC** | 6 bytes | MAC address of the sending device |
| **Type/Length** | 2 bytes | Protocol type (0x0800 = IPv4) or frame length |
| **Data** | 46-1500 bytes | Payload (the actual data being sent) |
| **FCS** | 4 bytes | Frame Check Sequence for error detection |

**Minimum frame size:** 64 bytes (including headers)
**Maximum frame size:** 1518 bytes (standard Ethernet)

## MAC Addresses

A **MAC address** is a 48-bit (6-byte) hardware identifier assigned to a network interface.

### MAC Address Structure

\`\`\`
AA:BB:CC:DD:EE:FF
│   │   │   │   │   │
│   │   └───┘   └───┘
│   │      │       │
│   │      │       └─ Device ID (assigned by manufacturer)
│   └──────┘
│       │
│       └─ Device ID (24 bits)
│
└─ OUI (Organizationally Unique Identifier) - 24 bits
   Assigned by IEEE to manufacturers
\`\`\`

### MAC Address Types

- **Unicast** — Frame sent to one specific device (bit 0 of first byte = 0)
- **Broadcast** — Frame sent to all devices (FF:FF:FF:FF:FF:FF)
- **Multicast** — Frame sent to a group of devices (bit 1 of first byte = 1)

## Collision Domains vs Broadcast Domains

### Collision Domain
A **collision domain** is a network segment where two devices transmitting at the same time can cause a collision.

- **Hubs** — All ports are ONE collision domain (shared)
- **Switches** — Each port is its OWN collision domain (micro-segmentation)
- **Routers** — Each interface is its own collision domain

### Broadcast Domain
A **broadcast domain** is a network segment where a broadcast frame is received by all devices.

- **Switches** — All ports in the same VLAN are ONE broadcast domain
- **Routers** — Each interface is its OWN broadcast domain (broadcasts don't cross routers)

> **Key insight:** Switches reduce collision domains. Routers reduce broadcast domains.

### Example

\`\`\`
[Hub] ─── All 4 ports = 1 collision domain, 1 broadcast domain

[Switch] ─── Each port = separate collision domain
              All ports (same VLAN) = 1 broadcast domain

[Router] ─── Each interface = separate collision domain AND broadcast domain
\`\`\`

## Ethernet Standards

| Standard | Speed | Name | Cable | Distance |
|----------|-------|------|-------|----------|
| 802.3 | 10 Mbps | Ethernet | Coax/UTP | 100m |
| 802.3u | 100 Mbps | Fast Ethernet | Cat 5 UTP | 100m |
| 802.3ab | 1 Gbps | Gigabit Ethernet | Cat 5e UTP | 100m |
| 802.3an | 10 Gbps | 10 Gigabit Ethernet | Cat 6a UTP | 100m |
| 802.3ba | 40/100 Gbps | 40/100 Gigabit | Fiber | Varies |`,
  },
  2: {
    objectives: [
      'Describe how a switch learns MAC addresses',
      'Explain the switch forwarding, flooding, and aging processes',
      'Understand the MAC address table',
      'Configure and verify switch operations',
    ],
    keyTerms: [
      { term: 'MAC Learning', definition: 'The process of a switch recording source MAC addresses and their associated ports' },
      { term: 'Forwarding', definition: 'Sending a frame out the port where the destination MAC was learned' },
      { term: 'Flooding', definition: 'Sending a frame out all ports except the source when the destination MAC is unknown' },
      { term: 'Aging', definition: 'The process of removing MAC address entries after a timeout period' },
      { term: 'CAM Table', definition: 'Content Addressable Memory table — stores the MAC address to port mappings' },
    ],
    content: `## Switch Operations

A **switch** is a Layer 2 device that forwards frames based on MAC addresses. Unlike hubs, switches provide dedicated bandwidth per port and reduce collisions.

### How a Switch Learns MAC Addresses

When a switch receives a frame, it follows this process:

1. **Learn:** Record the **source MAC address** and the incoming port in the MAC address table
2. **Forward/Flood:** Look up the **destination MAC address** in the table
   - If found → **Forward** the frame out the specific port
   - If not found → **Flood** the frame out all ports (except the source)
3. **Filter:** If source and destination are on the same port, discard the frame

### MAC Address Table (CAM Table)

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

**Entry types:**
- **DYNAMIC** — Learned automatically (default aging: 300 seconds)
- **STATIC** — Manually configured by administrator

### MAC Address Aging

MAC addresses are removed from the table after the **aging timer** expires (default: 300 seconds). This ensures the table stays current as devices move between ports.

\`\`\`
! Change aging time
Switch(config)# mac address-table aging-time 600
\`\`\`

## Frame Processing Decision

When a switch receives a frame:

| Condition | Action |
|-----------|--------|
| Known unicast (dest MAC in table) | Forward to specific port |
| Unknown unicast (dest MAC not in table) | Flood to all ports in same VLAN |
| Broadcast (FF:FF:FF:FF:FF:FF) | Flood to all ports in same VLAN |
| Known multicast | Flood to all ports (or configured multicast group) |

## Switch Configuration Basics

\`\`\`
! Set hostname
Switch(config)# hostname SW1

! Configure interface speed and duplex
SW1(config)# interface GigabitEthernet0/0
SW1(config-if)# speed 1000
SW1(config-if)# duplex full

! Set interface description
SW1(config-if)# description Connection to PC1

! Enable/disable interface
SW1(config-if)# shutdown
SW1(config-if)# no shutdown
\`\`\`

### Verifying Switch Operations

\`\`\`
! Show MAC address table
show mac address-table

! Show interface status
show interfaces status

! Show interface details
show interfaces GigabitEthernet0/0

! Clear MAC address table
clear mac address-table dynamic
\`\`\`

## Switch Forwarding Methods

| Method | Description | Latency |
|--------|-------------|---------|
| **Store-and-Forward** | Receives entire frame, checks CRC, then forwards | Higher (more reliable) |
| **Cut-Through** | Forwards after reading destination MAC only | Lower (less reliable) |
| **Fragment-Free** | Receives first 64 bytes before forwarding | Medium |

> Modern switches use **store-and-forward** by default for reliability.`,
  },
  3: {
    objectives: [
      'Understand VLAN concepts and benefits',
      'Configure access and trunk ports',
      'Explain 802.1Q encapsulation',
      'Configure VLANs on Cisco switches',
    ],
    keyTerms: [
      { term: 'VLAN', definition: 'Virtual LAN — a logical broadcast domain that groups devices regardless of physical location' },
      { term: 'Access Port', definition: 'A switch port that belongs to a single VLAN and connects to end devices' },
      { term: 'Trunk Port', definition: 'A switch port that carries traffic for multiple VLANs between switches' },
      { term: '802.1Q', definition: 'The IEEE standard for VLAN tagging on Ethernet frames' },
      { term: 'Native VLAN', definition: 'The VLAN that is not tagged on a trunk port (default: VLAN 1)' },
    ],
    content: `## VLAN Concepts

A **VLAN (Virtual LAN)** is a logical grouping of devices that creates separate broadcast domains, regardless of physical location.

### Benefits of VLANs

- **Broadcast control** — Broadcasts stay within the VLAN
- **Security** — Devices in different VLANs cannot communicate without a router
- **Flexibility** — Users can be grouped logically, not just physically
- **Performance** — Reduces unnecessary broadcast traffic
- **Simplified management** — Changes can be made without rewiring

### VLAN Types

| Type | ID Range | Description |
|------|----------|-------------|
| **Normal VLANs** | 1-1005 | Standard VLANs (1 is default) |
| **Extended VLANs** | 1006-4094 | Supported on modern switches |
| **Data VLAN** | User-defined | Carries user data traffic |
| **Management VLAN** | Typically VLAN 1 | For switch management access |
| **Native VLAN** | Default: VLAN 1 | Untagged VLAN on trunks |

## Access Ports vs Trunk Ports

### Access Ports
- Belongs to **one VLAN** only
- Connects to end devices (PCs, printers, servers)
- Frames are sent **untagged**

### Trunk Ports
- Carries traffic for **multiple VLANs**
- Connects switches to switches (or switches to routers)
- Frames are **tagged** with VLAN ID (except native VLAN)

### 802.1Q Encapsulation

When a frame traverses a trunk, a **4-byte 802.1Q tag** is inserted:

| Field | Size | Description |
|-------|------|-------------|
| **TPID** | 2 bytes | Tag Protocol ID (0x8100 for 802.1Q) |
| **Priority** | 3 bits | CoS (Class of Service) for QoS |
| **DEI** | 1 bit | Drop Eligible Indicator |
| **VLAN ID** | 12 bits | VLAN number (1-4094) |

## VLAN Configuration

### Creating VLANs

\`\`\`
Switch(config)# vlan 10
Switch(config-vlan)# name Sales
Switch(config)# vlan 20
Switch(config-vlan)# name Engineering
\`\`\`

### Assigning Access Ports

\`\`\`
Switch(config)# interface GigabitEthernet0/1
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 10
\`\`\`

### Configuring Trunk Ports

\`\`\`
Switch(config)# interface GigabitEthernet0/24
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk native vlan 99
Switch(config-if)# switchport trunk allowed vlan 10,20,30
\`\`\`

### Verifying VLAN Configuration

\`\`\`
! Show VLAN information
show vlan brief

! Show trunk status
show interfaces trunk

! Show specific interface mode
show interfaces GigabitEthernet0/1 switchport
\`\`\`

### Example Output

\`\`\`
Switch# show vlan brief
VLAN  Name                 Status    Ports
----  --------------------  ------    -----
1     default              active    Gi0/0, Gi0/2, Gi0/3
10    Sales                active    Gi0/1
20    Engineering          active    Gi0/4
\`\`\`

## DTP (Dynamic Trunking Protocol)

**DTP** negotiates trunking between switches (Cisco proprietary):

| Mode | Description |
|------|-------------|
| **dynamic auto** | Will become trunk if the other side is trunk or desirable |
| **dynamic desirable** | Actively tries to become a trunk |
| **trunk** | Always trunk, sends DTP frames |
| **access** | Always access, never trunk |

> **Best practice:** Explicitly set trunk/access modes. Disable DTP with \`switchport nonegotiate\`.`,
  },
  4: {
    objectives: [
      'Understand EtherChannel concepts and benefits',
      'Configure EtherChannel using LACP and PAgP',
      'Explain load balancing methods',
      'Verify EtherChannel configuration',
    ],
    keyTerms: [
      { term: 'EtherChannel', definition: 'Bundling multiple physical links into one logical link for increased bandwidth and redundancy' },
      { term: 'LACP', definition: 'Link Aggregation Control Protocol — IEEE 802.3ad standard for EtherChannel negotiation' },
      { term: 'PAgP', definition: 'Port Aggregation Protocol — Cisco proprietary EtherChannel negotiation protocol' },
      { term: 'Load Balancing', definition: 'Distributing traffic across EtherChannel member links based on hashing algorithms' },
    ],
    content: `## EtherChannel Overview

**EtherChannel** bundles multiple physical Ethernet links into a single logical link. This provides:

- **Increased bandwidth** — Aggregate bandwidth of all links (e.g., 4× 1Gbps = 4 Gbps)
- **Redundancy** — If one link fails, traffic shifts to remaining links
- **Load balancing** — Traffic distributed across member links
- **Simplified STP** — STP sees one logical link, not multiple physical links

### EtherChannel Limits

- Maximum **8 active** links per EtherChannel (on most switches)
- Maximum **16 links** configured (8 active + 8 standby)
- All links must have matching configurations (speed, duplex, VLAN, mode)

## EtherChannel Protocols

### LACP (Link Aggregation Control Protocol)
- **IEEE 802.3ad** standard (open standard, multi-vendor)
- Modes: **active** (initiates negotiation) or **passive** (responds to negotiation)
- At least one side must be **active**

### PAgP (Port Aggregation Protocol)
- **Cisco proprietary**
- Modes: **desirable** (initiates) or **auto** (responds)
- At least one side must be **desirable**

### Static (On)
- No negotiation protocol
- Both sides forced to bundle
- **Not recommended** — no protection against misconfigurations

## Configuration Examples

### LACP Configuration

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

### PAgP Configuration

\`\`\`
Switch1(config)# interface range GigabitEthernet0/1 - 2
Switch1(config-if-range)# channel-group 1 mode desirable

Switch2(config)# interface range GigabitEthernet0/1 - 2
Switch2(config-if-range)# channel-group 1 mode auto
\`\`\`

### Static (On) Configuration

\`\`\`
Switch1(config)# interface range GigabitEthernet0/1 - 2
Switch1(config-if-range)# channel-group 1 mode on

Switch2(config)# interface range GigabitEthernet0/1 - 2
Switch2(config-if-range)# channel-group 1 mode on
\`\`\`

## Load Balancing Methods

EtherChannel load balancing uses a hash algorithm to determine which link to use:

| Method | Hash Based On |
|--------|---------------|
| **src-mac** | Source MAC address |
| **dst-mac** | Destination MAC address |
| **src-dst-mac** | Source and destination MAC |
| **src-ip** | Source IP address |
| **dst-ip** | Destination IP address |
| **src-dst-ip** | Source and destination IP (default, recommended) |
| **src-port** | Source port number |
| **dst-port** | Destination port number |
| **src-dst-port** | Source and destination port |

\`\`\`
! Configure load balancing method
Switch(config)# port-channel load-balance src-dst-ip
\`\`\`

## Verification

\`\`\`
! Show EtherChannel summary
show etherchannel summary

! Show detailed port-channel info
show etherchannel port-channel

! Show load balancing method
show etherchannel load-balance
\`\`\`

### Example Output

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
      'Understand STP purpose and operation',
      'Describe the root bridge election process',
      'Identify STP port roles and states',
      'Configure STP enhancements (PortFast, BPDU Guard)',
    ],
    keyTerms: [
      { term: 'STP', definition: 'Spanning Tree Protocol — prevents Layer 2 loops by blocking redundant paths' },
      { term: 'Root Bridge', definition: 'The switch elected as the central reference point in the STP topology' },
      { term: 'BPDU', definition: 'Bridge Protocol Data Unit — STP messages exchanged between switches' },
      { term: 'PortFast', definition: 'Immediately transitions a port to forwarding (for end devices only)' },
      { term: 'BPDU Guard', definition: 'Disables a port if BPDUs are received (protects against rogue switches)' },
    ],
    content: `## Why STP?

**Spanning Tree Protocol (STP)** prevents Layer 2 loops in networks with redundant links. Without STP, broadcast frames would circulate endlessly, causing a **broadcast storm** that can crash the network.

### What STP Does

1. **Elects a root bridge** — One switch becomes the central reference point
2. **Calculates best paths** — Determines the shortest path to the root bridge
3. **Blocks redundant ports** — Puts some ports in a blocking state to prevent loops
4. **Provides failover** — If an active link fails, a blocked port can transition to forwarding

## Root Bridge Election

The switch with the **lowest Bridge ID** becomes the root bridge.

**Bridge ID** = Priority (2 bytes) + MAC Address (6 bytes)

- Default priority: **32768**
- Lowest priority wins; if tied, lowest MAC address wins

\`\`\`
! Set a switch as root bridge (lower priority)
Switch(config)# spanning-tree vlan 1 priority 4096

! Or use the shortcut
Switch(config)# spanning-tree vlan 1 root primary
\`\`\`

## STP Port Roles

| Role | Description | State |
|------|-------------|-------|
| **Root Port (RP)** | Best path to root bridge (on non-root switches) | Forwarding |
| **Designated Port (DP)** | Best path from each segment toward the root | Forwarding |
| **Blocked Port** | Redundant port that is blocked to prevent loops | Blocking |
| **Disabled Port** | Administratively shut down | Disabled |

### Path Cost

STP uses **cost** to determine the best path. Lower cost = better path.

| Speed | STP Cost (IEEE 802.1D) |
|-------|----------------------|
| 10 Mbps | 100 |
| 100 Mbps | 19 |
| 1 Gbps | 4 |
| 10 Gbps | 2 |

## STP Port States

| State | Duration | Description |
|-------|----------|-------------|
| **Blocking** | 20 sec | Receives BPDUs only, no data forwarding |
| **Listening** | 15 sec | Sends/receives BPDUs, no data forwarding |
| **Learning** | 15 sec | Learns MAC addresses, no data forwarding |
| **Forwarding** | Active | Normal operation, forwards data |
| **Disabled** | - | Administratively shut down |

**Total convergence time:** ~30-50 seconds (with default timers)

## STP Variants

| Variant | Description | Convergence |
|---------|-------------|-------------|
| **STP (802.1D)** | Original IEEE standard | 30-50 sec |
| **RSTP (802.1w)** | Rapid STP, faster convergence | 1-6 sec |
| **PVST+** | Cisco per-VLAN STP | 30-50 sec per VLAN |
| **Rapid PVST+** | Cisco per-VLAN RSTP | 1-6 sec per VLAN |
| **MST (802.1s)** | Maps multiple VLANs to fewer STP instances | Varies |

## STP Enhancements

### PortFast
Immediately transitions a port to **forwarding** state, bypassing listening/learning. Use ONLY on access ports connected to end devices.

\`\`\`
! Enable PortFast on an access port
Switch(config)# interface GigabitEthernet0/1
Switch(config-if)# spanning-tree portfast

! Enable PortFast on all access ports globally
Switch(config)# spanning-tree portfast default
\`\`\`

### BPDU Guard
Disables (err-disables) a port if it receives BPDUs. Prevents rogue switches from affecting STP topology.

\`\`\`
! Enable BPDU Guard on an interface
Switch(config)# interface GigabitEthernet0/1
Switch(config-if)# spanning-tree bpduguard enable

! Enable BPDU Guard globally on all PortFast ports
Switch(config)# spanning-tree portfast bpduguard default
\`\`\`

## Verification Commands

\`\`\`
! Show STP information
show spanning-tree

! Show STP for specific VLAN
show spanning-tree vlan 1

! Show root bridge info
show spanning-tree root

! Show STP interface details
show spanning-tree interface GigabitEthernet0/1
\`\`\``,
  },
  6: {
    objectives: [
      'Understand 802.11 wireless standards',
      'Compare 2.4 GHz and 5 GHz frequency bands',
      'Explain wireless concepts (SSID, BSS, CSMA/CA)',
      'Describe wireless security protocols',
    ],
    keyTerms: [
      { term: '802.11', definition: 'IEEE standard family for wireless LANs (Wi-Fi)' },
      { term: 'SSID', definition: 'Service Set Identifier — the name of a wireless network' },
      { term: 'BSS', definition: 'Basic Service Set — a single access point and its associated clients' },
      { term: 'CSMA/CA', definition: 'Carrier Sense Multiple Access with Collision Avoidance — Wi-Fi media access method' },
      { term: 'WPA3', definition: 'Wi-Fi Protected Access 3 — latest wireless security standard' },
    ],
    content: `## 802.11 Wireless Standards

Wi-Fi is defined by the **IEEE 802.11** family of standards:

| Standard | Frequency | Max Speed | Year | Notes |
|----------|-----------|-----------|------|-------|
| **802.11a** | 5 GHz | 54 Mbps | 1999 | Shorter range, less interference |
| **802.11b** | 2.4 GHz | 11 Mbps | 1999 | Longer range, more interference |
| **802.11g** | 2.4 GHz | 54 Mbps | 2003 | Backward compatible with 802.11b |
| **802.11n (Wi-Fi 4)** | 2.4/5 GHz | 600 Mbps | 2009 | MIMO technology |
| **802.11ac (Wi-Fi 5)** | 5 GHz | 6.9 Gbps | 2013 | MU-MIMO, beamforming |
| **802.11ax (Wi-Fi 6)** | 2.4/5/6 GHz | 9.6 Gbps | 2019 | OFDMA, BSS coloring |

## Frequency Bands

### 2.4 GHz Band
- **Channels:** 11 channels (US), 13 channels (EU)
- **Non-overlapping:** Channels 1, 6, 11
- **Range:** Longer range, better wall penetration
- **Interference:** More crowded (microwaves, Bluetooth, baby monitors)

### 5 GHz Band
- **Channels:** More channels available (up to 25 non-overlapping)
- **Range:** Shorter range, less wall penetration
- **Interference:** Less crowded, more available bandwidth
- **DFS channels:** May be shared with radar

### 6 GHz Band (Wi-Fi 6E)
- **Channels:** 59 new 20 MHz channels
- **Range:** Similar to 5 GHz
- **Interference:** Minimal — dedicated to Wi-Fi 6E devices

## Wireless Concepts

### SSID (Service Set Identifier)
The **SSID** is the name of the wireless network that clients see and connect to.

### BSS (Basic Service Set)
A **BSS** consists of a single access point (AP) and all associated clients. Each BSS is identified by a **BSSID** (the MAC address of the AP).

### ESS (Extended Service Set)
An **ESS** consists of multiple BSSs connected by a wired backbone, allowing clients to roam between APs.

### CSMA/CA (Collision Avoidance)

Unlike Ethernet's CSMA/CD (collision detection), Wi-Fi uses **CSMA/CA** (collision avoidance):

1. **Listen** — Check if the channel is clear
2. **Wait** — If busy, wait a random backoff time
3. **Send** — Transmit when clear
4. **ACK** — Wait for acknowledgment; retransmit if no ACK

> **Note:** Wi-Fi is **half-duplex** — a device cannot send and receive simultaneously.

## Wireless Security

| Protocol | Encryption | Security Level |
|----------|-----------|----------------|
| **WEP** | RC4 (40/104-bit) | ❌ Broken — do not use |
| **WPA** | TKIP (RC4) | ⚠️ Weak — deprecated |
| **WPA2** | AES-CCMP | ✅ Good — widely used |
| **WPA3** | SAE + AES-GCMP | ✅ Best — recommended |

### Authentication Methods

- **PSK (Pre-Shared Key)** — Shared password (home/SOHO)
- **802.1X/EAP** — Enterprise authentication via RADIUS server
- **Open** — No authentication (public hotspots, use with VPN)

### WPA3 Improvements
- **SAE (Simultaneous Authentication of Equals)** — Replaces PSK, resistant to offline dictionary attacks
- **Forward secrecy** — Compromised key doesn't expose past traffic
- **Protected Management Frames (PMF)** — Prevents deauthentication attacks`,
  },
  7: {
    objectives: [
      'Understand PoE standards and power budgets',
      'Describe wireless security threats and mitigations',
      'Configure wireless security on a WLC',
      'Explain the wireless authentication process',
    ],
    keyTerms: [
      { term: 'PoE', definition: 'Power over Ethernet — delivers electrical power along with data over Ethernet cables' },
      { term: 'WLC', definition: 'Wireless LAN Controller — centralized management device for lightweight APs' },
      { term: 'CAPWAP', definition: 'Control and Provisioning of Wireless APs — protocol between AP and WLC' },
      { term: 'Rogue AP', definition: 'An unauthorized access point connected to the network' },
      { term: 'Deauthentication Attack', definition: 'Sending forged deauth frames to disconnect clients' },
    ],
    content: `## Power over Ethernet (PoE)

**PoE** delivers electrical power to devices over standard Ethernet cables, eliminating the need for separate power cables.

### PoE Standards

| Standard | Power per Port | Year | Notes |
|----------|---------------|------|-------|
| **802.3af (PoE)** | 15.4 W | 2003 | Original PoE standard |
| **802.3at (PoE+)** | 30 W | 2009 | For higher-power devices |
| **802.3bt (PoE++)** | 60 W (Type 3) / 100 W (Type 4) | 2018 | For PTZ cameras, displays |

### PoE Device Roles

- **PSE (Power Sourcing Equipment)** — The switch or injector that provides power
- **PD (Powered Device)** — The device that receives power (AP, IP phone, camera)

### PoE Power Budget

Switches have a total **power budget** that must be shared across all PoE ports:

\`\`\`
! Show PoE status
show power inline

! Example output:
Available:370.0(w)  Used:90.0(w)  Remaining:280.0(w)

Interface    Admin  Oper    Power   Device          Class
Gi0/1        auto   on      15.4    IP Phone        3
Gi0/2        auto   on      30.0    Access Point    4
Gi0/3        auto   off     0.0     n/a             n/a
\`\`\`

## Wireless Security Threats

### Common Attacks

1. **Rogue AP** — Unauthorized AP connected to the network
   - Mitigation: Wireless Intrusion Prevention System (WIPS)

2. **Evil Twin** — Attacker creates a fake AP with the same SSID
   - Mitigation: 802.1X authentication, WIDS monitoring

3. **Deauthentication Attack** — Forged deauth frames disconnect clients
   - Mitigation: WPA3 (Protected Management Frames)

4. **War Driving** — Scanning for open/weak wireless networks
   - Mitigation: Strong encryption, hidden SSIDs (limited effectiveness)

5. **Man-in-the-Middle** — Attacker intercepts traffic between client and AP
   - Mitigation: WPA3, certificate-based authentication

## Cisco Wireless Architecture

### Autonomous APs
- Standalone, self-contained APs
- Each AP configured individually
- Suitable for small deployments

### Lightweight APs with WLC
- APs are "thin" — controlled by a WLC
- Centralized configuration and management
- CAPWAP tunnel between AP and WLC
- Suitable for enterprise deployments

### Cloud-Based
- APs managed from the cloud (Meraki, etc.)
- Simplified management
- Subscription-based licensing

## WLC Configuration Concepts

### AP Join Process
1. AP boots and discovers WLC (DHCP, DNS, or broadcast)
2. AP downloads firmware from WLC (if needed)
3. AP downloads configuration from WLC
4. AP is ready to serve clients

### Creating a WLAN
1. Create a WLAN profile (SSID, security, VLAN)
2. Assign to AP groups
3. Enable the WLAN

\`\`\`
! WLC CLI example
config wlan create 1 Corporate
config wlan security wpa2 enable 1
config wlan interface 1 vlan10
config wlan enable 1
\`\`\`

## Best Practices

- Use **WPA3** or **WPA2-Enterprise** (802.1X) for corporate networks
- Enable **Protected Management Frames** (PMF)
- Use **rogue AP detection** via WIDS/WIPS
- Segment wireless traffic into separate VLANs
- Disable SSID broadcasting for guest networks (limited security benefit)
- Implement **band steering** to move clients to 5 GHz`,
  },
};
