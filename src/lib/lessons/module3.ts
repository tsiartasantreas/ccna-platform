export const module3Lessons: Record<number, { objectives: string[]; keyTerms: { term: string; definition: string }[]; content: string }> = {
  1: {
    objectives: [
      "Read and interpret the output of the `show ip route` command",
      "Explain how a router builds and populates its routing table",
      "Differentiate between directly connected, static, and dynamic routes",
      "Describe Administrative Distance (AD) and how it influences path selection",
      "Apply the longest prefix match rule to determine the best route"
    ],
    keyTerms: [
      { term: "Routing Table", definition: "A data structure stored in router RAM that lists known networks, their next-hop addresses, exit interfaces, and metrics. The router consults this table for every packet forwarding decision." },
      { term: "Administrative Distance (AD)", definition: "A value (0–255) that rates the trustworthiness of a route source. Lower AD is preferred. For example, a directly connected route (AD 0) is always preferred over an OSPF-learned route (AD 110)." },
      { term: "Metric", definition: "A value used by a routing protocol to determine the best path to a destination when multiple routes exist from the same source. OSPF uses cost (based on bandwidth); EIGRP uses a composite of bandwidth and delay." },
      { term: "Longest Prefix Match", definition: "The rule stating that a router always selects the route with the most specific (longest) subnet mask when multiple routes match a destination IP address." },
      { term: "Next-Hop", definition: "The IP address of the next router in the path to the destination network. The router forwards the packet to this address." }
    ],
    content: `## Understanding the Routing Table

Every router maintains a **routing table** — a database of known networks and the best paths to reach them. When a packet arrives, the router examines the destination IP address, looks up the routing table, and forwards the packet out the appropriate interface toward the next-hop router.

You can view the routing table with:

\`\`\`
Router# show ip route
\`\`\`

A typical output looks like this:

\`\`\`
Codes: L - local, C - connected, S - static, R - RIP, M - mobile, B - BGP
       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area

Gateway of last resort is 203.0.113.1 to network 0.0.0.0

S*   0.0.0.0/0 [1/0] via 203.0.113.1
      10.0.0.0/8 is variably subnetted, 4 subnets, 2 masks
C        10.1.1.0/24 is directly connected, GigabitEthernet0/0
L        10.1.1.1/32 is directly connected, GigabitEthernet0/0
O        10.2.2.0/24 [110/20] via 10.1.1.2, 00:05:32, GigabitEthernet0/0
S        10.3.3.0/24 [1/0] via 10.1.1.254
\`\`\`

### Route Source Codes

| Code | Source          | Description                                      |
|------|-----------------|--------------------------------------------------|
| C    | Connected       | Network is directly attached to a router interface |
| L    | Local           | The router's own interface IP (/32 host route)    |
| S    | Static          | Manually configured by an administrator           |
| O    | OSPF            | Learned via OSPF routing protocol                 |
| D    | EIGRP           | Learned via EIGRP routing protocol                |
| R    | RIP             | Learned via RIP routing protocol                  |
| B    | BGP             | Learned via BGP (used in ISP networks)            |

## How Routes Enter the Routing Table

Routes are added to the routing table from three main sources:

1. **Directly connected networks** — automatically added when an interface is configured with an IP address and brought up (no shutdown). These have an AD of 0.
2. **Static routes** — manually configured by an administrator. Default AD is 1.
3. **Dynamic routing protocols** — learned automatically through protocols like OSPF (AD 110), EIGRP (AD 90), or RIP (AD 120).

## Administrative Distance (AD)

When the router learns about the **same network** from multiple sources, it uses **Administrative Distance** to choose the most trustworthy source. Lower AD wins.

| Route Source       | Default AD |
|--------------------|------------|
| Directly connected | 0          |
| Static route       | 1          |
| EIGRP              | 90         |
| OSPF               | 110        |
| RIP                | 120        |
| Unknown / Unreachable | 255    |

**Example:** If a router learns about 10.2.2.0/24 via both OSPF (AD 110) and a static route (AD 1), the static route is placed in the routing table because AD 1 < AD 110.

## The Routing Table Entry Explained

Each entry contains:

- **Route code and prefix** — e.g., \`O 10.2.2.0/24\`
- **Administrative Distance and Metric** — shown in brackets like \`[110/20]\` meaning AD 110, metric 20
- **Next-hop address** — the IP of the next router, e.g., \`via 10.1.1.2\`
- **Timer** — how long since the route was last updated
- **Exit interface** — the local interface to forward packets out of

## Longest Prefix Match

When a packet's destination matches **multiple** entries in the routing table, the router uses the **longest prefix match** rule — it selects the route with the **most specific** (longest) subnet mask.

**Example:**

The routing table contains:
- \`10.0.0.0/8\` via Router A
- \`10.1.0.0/16\` via Router B
- \`10.1.1.0/24\` via Router C

A packet destined for **10.1.1.50** matches all three entries. The router selects \`10.1.1.0/24\` (the /24 route) because it has the longest prefix — it is the most specific match.

## Verifying the Routing Table

Key verification commands:

\`\`\`
Router# show ip route                    ! Full routing table
Router# show ip route 10.2.2.0          ! Route for a specific network
Router# show ip route connected         ! Only connected routes
Router# show ip route static            ! Only static routes
Router# show ip route ospf              ! Only OSPF routes
\`\`\`

Understanding how the routing table is built and how route selection works is fundamental to all networking. Every topic in this module builds on these concepts.`
  },

  2: {
    objectives: [
      "Configure and verify static routes on a Cisco router",
      "Explain the purpose and configuration of a default route",
      "Differentiate between network routes and host routes",
      "Configure floating static routes using administrative distance",
      "Troubleshoot common static route issues"
    ],
    keyTerms: [
      { term: "Static Route", definition: "A manually configured route in the routing table. The administrator defines the destination network, subnet mask, and next-hop address or exit interface." },
      { term: "Default Route", definition: "A route with the prefix 0.0.0.0/0 that matches all destination addresses. Used as the gateway of last resort when no more specific route exists. Also called a quad-zero route." },
      { term: "Floating Static Route", definition: "A static route configured with a higher-than-default administrative distance so it only appears in the routing table when the primary route fails. Acts as a backup path." },
      { term: "Host Route", definition: "A route to a specific host with a /32 subnet mask (e.g., 192.168.1.100/32). Used to route traffic to one specific device." },
      { term: "Next-Hop Recursive Lookup", definition: "When a static route points to a next-hop IP that is not directly connected, the router must perform an additional lookup to find the exit interface for that next-hop address." }
    ],
    content: `## Static Route Fundamentals

A **static route** is a manually configured entry in the routing table. Unlike dynamic routing protocols, static routes do not consume bandwidth for updates and give the administrator full control over the path traffic takes.

### Basic Static Route Configuration

\`\`\`
Router(config)# ip route <destination-network> <subnet-mask> <next-hop-address>
\`\`\`

**Example:** To reach network 10.2.2.0/24 via next-hop 10.1.1.2:

\`\`\`
Router(config)# ip route 10.2.2.0 255.255.255.0 10.1.1.2
\`\`\`

You can also specify an exit interface instead of (or along with) the next-hop:

\`\`\`
Router(config)# ip route 10.2.2.0 255.255.255.0 GigabitEthernet0/1
Router(config)# ip route 10.2.2.0 255.255.255.0 GigabitEthernet0/1 10.1.1.2
\`\`\`

Using both the exit interface and next-hop is recommended on multi-access networks (like Ethernet) to avoid ARP issues.

### Verifying Static Routes

\`\`\`
Router# show ip route static
S    10.2.2.0/24 [1/0] via 10.1.1.2

Router# show running-config | section ip route
ip route 10.2.2.0 255.255.255.0 10.1.1.2
\`\`\`

The \`[1/0]\` means Administrative Distance 1 (default for static routes), Metric 0.

## Default Route (Gateway of Last Resort)

A **default route** matches any destination that does not have a more specific route in the routing table. It is configured with the quad-zero prefix:

\`\`\`
Router(config)# ip route 0.0.0.0 0.0.0.0 <next-hop-address>
\`\`\`

**Example:**

\`\`\`
Router(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1
\`\`\`

In the routing table, this appears as:

\`\`\`
S*   0.0.0.0/0 [1/0] via 203.0.113.1
\`\`\`

The asterisk (*) indicates this is the **gateway of last resort**. Default routes are essential for branch offices and stub networks that have a single path to the rest of the network or the internet.

## Host Routes

A **host route** is a route to a single specific IP address, using a /32 mask:

\`\`\`
Router(config)# ip route 192.168.1.100 255.255.255.255 10.1.1.2
\`\`\`

This creates a route for exactly one host: 192.168.1.100. Host routes take precedence over any network route that might include that address, because of the **longest prefix match** rule (/32 is always the most specific).

Common uses for host routes include:
- Routing to a specific server via a particular path
- Network management and monitoring
- Overriding a network route for a single device

## Floating Static Routes

A **floating static route** is a backup route that only becomes active when the primary route disappears from the routing table. This is achieved by setting a **higher AD** than the primary route source.

### Configuration Example

Suppose OSPF (AD 110) provides the primary route to 10.2.2.0/24. We want a static route as backup via a different path:

\`\`\`
Router(config)# ip route 10.2.2.0 255.255.255.0 10.3.3.1 150
\`\`\`

The \`150\` at the end sets the AD to 150, which is higher than OSPF's 110. This means:

- **Normal operation:** OSPF route (AD 110) is in the routing table
- **OSPF fails:** OSPF route is removed, and the floating static (AD 150) is installed
- **OSPF recovers:** OSPF route (AD 110) replaces the floating static (AD 150)

**Verification:**

\`\`\`
Router# show ip route 10.2.2.0
Routing entry for 10.2.2.0/24
  Known via "ospf 1", distance 110, metric 20
  Last update from 10.1.1.2 on GigabitEthernet0/0, 00:10:32 ago
\`\`\`

When OSPF fails:

\`\`\`
Router# show ip route 10.2.2.0
Routing entry for 10.2.2.0/24
  Known via "static", distance 150, metric 0
  Routing Descriptor Blocks:
  * 10.3.3.1
\`\`\`

## Removing and Troubleshooting Static Routes

To remove a static route, prefix the command with \`no\`:

\`\`\`
Router(config)# no ip route 10.2.2.0 255.255.255.0 10.1.1.2
\`\`\`

**Common issues:**

| Problem | Cause | Solution |
|---------|-------|----------|
| Route not in table | Next-hop is unreachable | Verify next-hop is reachable |
| Route not forwarding | Missing return route | Configure routes in both directions |
| Recursive lookup failure | Next-hop not in routing table | Ensure next-hop network is known |
| Route inactive | Higher AD than existing route | Check AD values |

Always remember: static routes must be configured **in both directions** for two-way communication. If Router A has a static route to Router B's network, Router B must also have a route back to Router A's network.`
  },

  3: {
    objectives: [
      "Explain why inter-VLAN routing is necessary and how it works",
      "Configure Router-on-a-Stick (ROAS) using subinterfaces",
      "Configure inter-VLAN routing using a Layer 3 switch with SVIs",
      "Compare ROAS and Layer 3 switch approaches for scalability",
      "Verify inter-VLAN routing operation with show and ping commands"
    ],
    keyTerms: [
      { term: "Inter-VLAN Routing", definition: "The process of forwarding traffic between different VLANs. Since VLANs are separate broadcast domains, a Layer 3 device (router or Layer 3 switch) is required to route between them." },
      { term: "Router-on-a-Stick (ROAS)", definition: "A method of inter-VLAN routing where a single physical router interface is configured with multiple subinterfaces, each associated with a different VLAN. The switch port is configured as a trunk." },
      { term: "SVI (Switch Virtual Interface)", definition: "A virtual interface on a Layer 3 switch that represents a VLAN. SVIs are assigned IP addresses and serve as default gateways for hosts in their respective VLANs." },
      { term: "Subinterface", definition: "A logical interface created on a physical router interface. Each subinterface is assigned to a VLAN and configured with an IP address and encapsulation (802.1Q tag)." },
      { term: "802.1Q Trunk", definition: "A link between switches (or a switch and router) that carries traffic for multiple VLANs by tagging frames with VLAN identifiers." }
    ],
    content: `## Why Inter-VLAN Routing?

By default, devices in different VLANs **cannot communicate** with each other. VLANs create separate broadcast domains at Layer 2. To enable communication between VLANs, you need a **Layer 3 device** — either a router or a Layer 3 switch — to perform routing.

## Method 1: Router-on-a-Stick (ROAS)

**Router-on-a-Stick** uses a single physical router interface connected to a switch via a **trunk link**. The router interface is divided into **subinterfaces**, each assigned to a different VLAN.

### Network Setup

- Switch with VLAN 10 (192.168.10.0/24) and VLAN 20 (192.168.20.0/24)
- Router connected to the switch via GigabitEthernet0/0
- Switch port connected to the router is configured as a trunk

### Switch Configuration

\`\`\`
Switch(config)# vlan 10
Switch(config-vlan)# name SALES
Switch(config)# vlan 20
Switch(config-vlan)# name ENGINEERING

Switch(config)# interface GigabitEthernet0/1
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk allowed vlan 10,20
\`\`\`

### Router Configuration

\`\`\`
Router(config)# interface GigabitEthernet0/0
Router(config-if)# no shutdown

Router(config)# interface GigabitEthernet0/0.10
Router(config-subif)# encapsulation dot1Q 10
Router(config-subif)# ip address 192.168.10.1 255.255.255.0

Router(config)# interface GigabitEthernet0/0.20
Router(config-subif)# encapsulation dot1Q 20
Router(config-subif)# ip address 192.168.20.1 255.255.255.0
\`\`\`

**Key points:**
- The subinterface number (\`.10\`, \`.20\`) is locally significant — it does not have to match the VLAN number, but matching is a best practice
- \`encapsulation dot1Q <vlan-id>\` tags traffic with the correct VLAN ID
- Each subinterface serves as the **default gateway** for its VLAN

### Verification

\`\`\`
Router# show ip interface brief | include GigabitEthernet0/0
GigabitEthernet0/0        unassigned      YES unset  up      up
GigabitEthernet0/0.10     192.168.10.1    YES manual up      up
GigabitEthernet0/0.20     192.168.20.1    YES manual up      up

Router# show interfaces trunk
\`\`\`

### ROAS Limitations

- The single physical link becomes a **bottleneck** as traffic grows
- The router CPU handles all inter-VLAN forwarding in software
- Not scalable for networks with many VLANs

## Method 2: Layer 3 Switch with SVIs

A **Layer 3 switch** (multilayer switch) can perform routing in **hardware** using ASICs, making it much faster and more scalable than ROAS.

### Switch Configuration

\`\`\`
Switch(config)# ip routing

Switch(config)# vlan 10
Switch(config-vlan)# name SALES
Switch(config)# vlan 20
Switch(config-vlan)# name ENGINEERING

Switch(config)# interface vlan 10
Switch(config-if)# ip address 192.168.10.1 255.255.255.0
Switch(config-if)# no shutdown

Switch(config)# interface vlan 20
Switch(config-if)# ip address 192.168.20.1 255.255.255.0
Switch(config-if)# no shutdown
\`\`\`

**Key commands:**
- \`ip routing\` — enables Layer 3 routing on the switch
- \`interface vlan <id>\` — creates an SVI for the VLAN
- Each SVI acts as the default gateway for devices in that VLAN

### Verification

\`\`\`
Switch# show ip interface brief | include Vlan
Vlan10       192.168.10.1    YES manual up      up
Vlan20       192.168.20.1    YES manual up      up

Switch# show ip route
C    192.168.10.0/24 is directly connected, Vlan10
L    192.168.10.1/32 is directly connected, Vlan10
C    192.168.20.0/24 is directly connected, Vlan20
L    192.168.20.1/32 is directly connected, Vlan20
\`\`\`

## Comparison: ROAS vs. Layer 3 Switch

| Feature | Router-on-a-Stick | Layer 3 Switch with SVIs |
|---------|-------------------|--------------------------|
| Forwarding | Software (router CPU) | Hardware (ASIC) |
| Performance | Limited by single link | High throughput |
| Scalability | Poor (many VLANs = many subinterfaces) | Excellent |
| Cost | Lower (use existing router) | Higher (requires L3 switch) |
| Complexity | Subinterface + trunk config | SVI + ip routing |
| Best for | Small networks, labs | Enterprise networks |

## Choosing the Right Method

- **Small office / lab:** ROAS is simple and cost-effective
- **Campus / enterprise:** Layer 3 switches with SVIs are the standard
- **Modern best practice:** Use SVIs on Layer 3 switches; ROAS is largely legacy

Both methods achieve the same goal — routing between VLANs — but the Layer 3 switch approach is overwhelmingly preferred in production networks.`
  },

  4: {
    objectives: [
      "Explain OSPF concepts including areas, router IDs, and neighbor relationships",
      "Describe the OSPF neighbor formation process and required parameters",
      "Explain the role of the Designated Router (DR) and Backup Designated Router (BDR)",
      "Configure single-area OSPF on Cisco routers",
      "Verify OSPF operation using show and debug commands"
    ],
    keyTerms: [
      { term: "OSPF (Open Shortest Path First)", definition: "An open-standard link-state routing protocol that uses Dijkstra's SPF algorithm to calculate the shortest path to each destination. It uses cost as its metric, based on interface bandwidth." },
      { term: "Router ID (RID)", definition: "A 32-bit identifier unique to each OSPF router. It is selected in order: manually configured RID > highest loopback IP > highest active physical interface IP." },
      { term: "DR/BDR (Designated Router / Backup Designated Router)", definition: "On multi-access networks (like Ethernet), OSPF elects a DR and BDR to reduce the number of adjacencies. All other routers (DROTHERs) only form full adjacencies with the DR and BDR." },
      { term: "Hello Packet", definition: "OSPF messages sent periodically to discover neighbors, establish adjacencies, and maintain neighbor relationships. Default hello interval is 10 seconds on broadcast networks." },
      { term: "Link-State Advertisement (LSA)", definition: "OSPF data structures that describe the network topology. Routers exchange LSAs to build a complete picture of the network, stored in the Link-State Database (LSDB)." }
    ],
    content: `
![Diagram](/images/diagrams/ospf-states.svg)

## OSPF Overview

**OSPF (Open Shortest Path First)** is the most widely used interior gateway protocol in enterprise networks. It is:
- **Open standard** (defined in RFC 2328 for OSPFv2)
- **Link-state** protocol — each router knows the full topology
- Uses **Dijkstra's Shortest Path First (SPF)** algorithm
- Metric is **cost**, calculated as \`10^8 / bandwidth\` (reference bandwidth / interface bandwidth)
- Sends **triggered updates** and periodic refreshes (every 30 minutes)
- Supports **VLSM/CIDR** and is classless

## OSPF Router ID

Every OSPF router has a unique **Router ID (RID)** — a 32-bit number written in dotted decimal. The RID is selected in this order:

1. Manually configured: \`router-id <address>\`
2. Highest loopback interface IP
3. Highest active physical interface IP

**Best practice:** Always configure the RID manually to ensure stability.

\`\`\`
Router(config)# router ospf 1
Router(config-router)# router-id 1.1.1.1
\`\`\`

## OSPF Neighbor Formation

OSPF routers must become **neighbors** before they can exchange routing information. The following parameters must match in Hello packets:

| Parameter | Description |
|-----------|-------------|
| Area ID | Both routers must be in the same area |
| Hello Interval | Default 10 seconds on broadcast, 30 seconds on NBMA |
| Dead Interval | Default 4x Hello (40 sec on broadcast) |
| Subnet Mask | Must match on the shared network |
| Authentication | If used, must match |
| Stub Area Flag | Must match |

### OSPF Neighbor States

1. **Down** — No Hello received
2. **Init** — Hello received, but your RID is not in it
3. **2-Way** — Bidirectional communication confirmed (your RID is in neighbor's Hello)
4. **ExStart** — Master/slave relationship established
5. **Exchange** — Routers exchange Database Description (DBD) packets
6. **Loading** — Routers request missing LSAs using LSR/LSU/LSAck
7. **Full** — Adjacency complete; LSDBs are synchronized

## Designated Router (DR) and Backup DR

On **multi-access networks** (Ethernet), OSPF would form adjacencies between every pair of routers — leading to n(n-1)/2 adjacencies. To reduce overhead, OSPF elects:

- **DR (Designated Router)** — central point for LSA exchange
- **BDR (Backup Designated Router)** — takes over if DR fails
- **DROTHER** — all other routers on the segment

DROTHERs only form **full adjacencies** with the DR and BDR. They stay in the **2-Way** state with each other.

### DR/BDR Election Rules

1. Highest **OSPF priority** (default 1; 0 = not eligible)
2. Highest **Router ID** as tiebreaker

\`\`\`
Router(config)# interface GigabitEthernet0/0
Router(config-if)# ip ospf priority 100
\`\`\`

**Note:** DR/BDR election is **non-preemptive** — once elected, a router keeps its role even if a better candidate joins.

## OSPF Single-Area Configuration

The simplest OSPF deployment puts all interfaces in **Area 0** (the backbone area):

\`\`\`
Router(config)# router ospf 1
Router(config-router)# router-id 1.1.1.1
Router(config-router)# network 10.1.1.0 0.0.0.255 area 0
Router(config-router)# network 10.2.2.0 0.0.0.255 area 0
\`\`\`

The \`network\` command uses a **wildcard mask** (inverse of subnet mask). It tells OSPF which interfaces to activate OSPF on and which area to assign them to.

### Alternative: Interface-Based Configuration

\`\`\`
Router(config)# router ospf 1
Router(config-router)# router-id 1.1.1.1

Router(config)# interface GigabitEthernet0/0
Router(config-if)# ip ospf 1 area 0

Router(config)# interface GigabitEthernet0/1
Router(config-if)# ip ospf 1 area 0
\`\`\`

This method is more explicit and is the modern recommended approach.

## OSPF Cost and Metric

OSPF cost determines the best path. Cost is calculated as:

\`\`\`
Cost = Reference Bandwidth / Interface Bandwidth
\`\`\`

| Interface Type | Bandwidth | Cost |
|----------------|-----------|------|
| FastEthernet   | 100 Mbps  | 1    |
| GigabitEthernet| 1 Gbps    | 1    |
| Serial (T1)    | 1.544 Mbps| 64   |

Since both FastEthernet and GigabitEthernet have cost 1 with the default reference bandwidth, you should adjust it:

\`\`\`
Router(config)# router ospf 1
Router(config-router)# auto-cost reference-bandwidth 10000
\`\`\`

This sets the reference bandwidth to 10 Gbps, allowing OSPF to differentiate between 1G and 10G links.

## Verification Commands

\`\`\`
Router# show ip ospf neighbor
Neighbor ID   Pri  State       Dead Time  Address      Interface
2.2.2.2        1   FULL/DR     00:00:35   10.1.1.2     Gi0/0
3.3.3.3        1   FULL/BDR    00:00:33   10.1.1.3     Gi0/0

Router# show ip ospf interface brief
Interface   PID  Area  IP Address/Mask  Cost  State  Nbrs
Gi0/0       1    0     10.1.1.1/24      1     DR     2
Gi0/1       1    0     10.2.2.1/24      1     DR     1

Router# show ip ospf database

Router# show ip route ospf
O    10.2.2.0/24 [110/2] via 10.1.1.2, 00:10:15, GigabitEthernet0/0
\`\`\`

## OSPF Troubleshooting

| Issue | Check |
|-------|-------|
| Neighbors not forming | Area ID, hello/dead timers, subnet mask, authentication |
| Stuck in 2-Way | Normal for DROTHERs; check priority if unexpected |
| Stuck in ExStart/Exchange | MTU mismatch |
| Route not in table | Check \`show ip ospf database\` for LSA presence |

OSPF is a critical protocol for the CCNA exam. Master the configuration, verification commands, and neighbor states.`
  },

  5: {
    objectives: [
      "Explain why multi-area OSPF is used and how it improves scalability",
      "Identify OSPF area types: standard, stub, totally stubby, and NSSA",
      "Describe the role of ABR and ASBR routers",
      "List and describe the most common OSPF LSA types",
      "Explain how the SPF algorithm calculates the best path"
    ],
    keyTerms: [
      { term: "ABR (Area Border Router)", definition: "A router with interfaces in multiple OSPF areas. The ABR connects non-backbone areas to Area 0 and summarizes routes between areas." },
      { term: "ASBR (Autonomous System Boundary Router)", definition: "A router that connects the OSPF domain to an external routing domain (e.g., another routing protocol or the internet). It injects external routes into OSPF." },
      { term: "LSA (Link-State Advertisement)", definition: "An OSPF data structure that describes network links and topology. Different LSA types carry different information (router links, network links, summary routes, external routes)." },
      { term: "SPF Algorithm", definition: "Dijkstra's Shortest Path First algorithm, used by OSPF to calculate the shortest path tree from the router to every destination network in the area." },
      { term: "Stub Area", definition: "An OSPF area that does not receive Type 5 (external) LSAs. Instead, the ABR injects a default route. Reduces the LSDB size and memory usage." }
    ],
    content: `## Why Multi-Area OSPF?

In a single-area OSPF design, **all routers** share the same Link-State Database (LSDB). As the network grows:

- The LSDB becomes very large
- SPF calculations take longer and consume more CPU
- Any topology change triggers SPF recalculation across the entire area

**Multi-area OSPF** solves this by dividing the network into smaller areas. Each area has its own LSDB, and SPF calculations are limited to within the area. This dramatically improves scalability.

### Multi-Area OSPF Rules

- All areas must connect to **Area 0 (backbone area)**
- Area 0 is the transit area for inter-area traffic
- Routers only share detailed topology information within their area
- Areas exchange **summarized** route information

## OSPF Router Roles

### ABR (Area Border Router)

An **ABR** has at least one interface in Area 0 and one in a non-backbone area. It:
- Maintains separate LSDBs for each area it connects to
- Generates **Type 3 LSAs** (summary LSAs) to advertise routes between areas
- Can summarize routes to reduce LSDB size

### ASBR (Autonomous System Boundary Router)

An **ASBR** connects OSPF to an external routing domain. It:
- Redistributes routes from another protocol (or static routes) into OSPF
- Generates **Type 5 LSAs** (external LSAs) for external routes
- Can exist in any area (though best practice is to place it in Area 0 or a non-stub area)

## OSPF LSA Types

Understanding LSA types is essential for the CCNA exam:

| LSA Type | Name | Description | Generated By |
|----------|------|-------------|--------------|
| 1 | Router LSA | Describes a router's directly connected links within an area | Every router |
| 2 | Network LSA | Describes all routers on a multi-access network | DR |
| 3 | Summary LSA | Advertises inter-area routes (prefixes) | ABR |
| 4 | ASBR Summary LSA | Advertises the location of the ASBR | ABR |
| 5 | AS External LSA | Advertises routes external to OSPF | ASBR |
| 7 | NSSA External LSA | External routes in a NSSA (converted to Type 5 by ABR) | ASBR in NSSA |

**For CCNA, focus on Types 1, 2, 3, and 5.**

### How LSAs Propagate

- **Type 1 and 2** stay **within** their area (intra-area)
- **Type 3** is generated by the ABR and flooded into **other areas**
- **Type 5** is flooded into **all non-stub areas** throughout the OSPF domain

## OSPF Area Types

| Area Type | Accepts Type 1 & 2 | Accepts Type 3 | Accepts Type 5 | Default Route |
|-----------|--------------------|----|-----|------|
| Standard | Yes | Yes | Yes | No |
| Stub | Yes | Yes | No | ABR injects |
| Totally Stubby | Yes | No | No | ABR injects |
| NSSA | Yes | Yes | No (uses Type 7) | Optional |

### Stub Area
- Does not receive **Type 5 LSAs** (external routes)
- The ABR injects a **default route** (0.0.0.0/0) instead
- Reduces LSDB size
- Cannot contain an ASBR

### Totally Stubby Area
- Does not receive **Type 3 or Type 5 LSAs**
- The ABR injects only a **default route**
- Cisco-proprietary extension
- Smallest possible LSDB

### NSSA (Not-So-Stubby Area)
- Like a stub area, but **can contain an ASBR**
- External routes are advertised as **Type 7 LSAs** within the NSSA
- The ABR converts Type 7 to Type 5 for distribution to other areas

## The SPF Algorithm

When OSPF receives LSAs, it builds a **Shortest Path Tree** using Dijkstra's algorithm:

1. Each router places itself as the root of the tree
2. It examines all Type 1 and Type 2 LSAs in its area LSDB
3. It calculates the shortest (lowest cost) path to every destination
4. The best routes are installed in the routing table

**Key point:** SPF runs **per area**. In multi-area OSPF, each area runs SPF independently. The ABR then selects the best inter-area route from Type 3 LSAs.

## Multi-Area OSPF Configuration

\`\`\`
! Router acting as ABR (Area 0 and Area 1)
Router(config)# router ospf 1
Router(config-router)# router-id 2.2.2.2
Router(config-router)# network 10.0.0.0 0.0.0.255 area 0
Router(config-router)# network 10.1.1.0 0.0.0.255 area 1
Router(config-router)# network 10.2.2.0 0.0.0.255 area 1

! Configuring a stub area (all routers in the area must agree)
Router(config)# router ospf 1
Router(config-router)# area 1 stub

! Configuring a totally stubby area (ABR only)
Router(config)# router ospf 1
Router(config-router)# area 1 stub no-summary

! Configuring a NSSA
Router(config)# router ospf 1
Router(config-router)# area 1 nssa
\`\`\`

## Verification for Multi-Area OSPF

\`\`\`
Router# show ip ospf
 Routing Process "ospf 1" with ID 2.2.2.2
 It is an area border router
 ...
 Area 0
   SPF algorithm executed 5 times
 Area 1
   It is a stub area
   SPF algorithm executed 3 times

Router# show ip ospf border-routers
\`\`\`

Multi-area OSPF is the standard for any medium-to-large network. Understanding area types, LSA types, and ABR/ASBR roles is critical for both the exam and real-world networking.`
  },

  6: {
    objectives: [
      "Explain the purpose of First Hop Redundancy Protocols (FHRPs)",
      "Describe how HSRP provides gateway redundancy using virtual IP and virtual MAC",
      "Configure and verify HSRP on Cisco routers or Layer 3 switches",
      "Explain HSRP active/standby failover and preemption",
      "Compare HSRP, VRRP, and GLBP at a high level"
    ],
    keyTerms: [
      { term: "FHRP (First Hop Redundancy Protocol)", definition: "A protocol that provides gateway redundancy by allowing multiple routers to share a virtual IP address. If the active router fails, a standby router takes over seamlessly." },
      { term: "HSRP (Hot Standby Router Protocol)", definition: "A Cisco-proprietary FHRP that provides gateway redundancy. One router is the active gateway and another is standby. They share a virtual IP and virtual MAC address." },
      { term: "VRRP (Virtual Router Redundancy Protocol)", definition: "An open-standard FHRP (RFC 5798) similar to HSRP. The active router is called the master, and backups take over if the master fails." },
      { term: "Virtual IP Address", definition: "An IP address shared by the HSRP group that hosts use as their default gateway. This IP does not belong to any physical interface — it is a logical address owned by the active router." },
      { term: "Virtual MAC Address", definition: "A MAC address generated by HSRP (e.g., 0000.0C07.ACXX for HSRPv1) that the active router uses to respond to ARP requests for the virtual IP. This MAC stays the same during failover." }
    ],
    content: `## The Problem: Single Point of Failure

In a typical network, hosts are configured with a **single default gateway**. If that gateway router fails, all hosts lose connectivity — even if another router is available.

**First Hop Redundancy Protocols (FHRPs)** solve this by allowing multiple routers to share a **virtual IP address**. Hosts point to the virtual IP as their default gateway. If the primary router fails, another router automatically takes over.

## HSRP (Hot Standby Router Protocol)

**HSRP** is the most commonly used FHRP in Cisco networks.

### How HSRP Works

1. Two or more routers form an **HSRP group**
2. One router becomes the **Active** router — it owns the virtual IP and forwards traffic
3. Another becomes the **Standby** router — it monitors the Active and is ready to take over
4. Hosts are configured with the **virtual IP** as their default gateway

### Virtual IP and Virtual MAC

| Component | Example | Notes |
|-----------|---------|-------|
| Virtual IP | 192.168.1.1 | Used by hosts as default gateway |
| Virtual MAC (HSRPv1) | 0000.0C07.ACXX | XX = HSRP group number in hex |
| Active Router IP | 192.168.1.2 | Physical IP of the active router |
| Standby Router IP | 192.168.1.3 | Physical IP of the standby router |

The **virtual MAC** is critical: when hosts send an ARP request for the virtual IP, the Active router replies with the virtual MAC. If failover occurs, the new Active router uses the **same virtual MAC**, so hosts do not need to re-ARP.

### HSRP States

1. **Initial** — Starting state
2. **Learn** — Waiting to hear from the Active router
3. **Listen** — Monitoring Hello messages
4. **Standby** — Candidate to become Active
5. **Active** — Currently forwarding traffic for the virtual IP

### HSRP Timers

- **Hello timer** — How often Hello messages are sent (default: 3 seconds)
- **Hold timer** — How long to wait before declaring Active down (default: 10 seconds)

## HSRP Configuration

### Router A (Active)

\`\`\`
RouterA(config)# interface GigabitEthernet0/0
RouterA(config-if)# ip address 192.168.1.2 255.255.255.0
RouterA(config-if)# standby version 2
RouterA(config-if)# standby 1 ip 192.168.1.1
RouterA(config-if)# standby 1 priority 110
RouterA(config-if)# standby 1 preempt
\`\`\`

### Router B (Standby)

\`\`\`
RouterB(config)# interface GigabitEthernet0/0
RouterB(config-if)# ip address 192.168.1.3 255.255.255.0
RouterB(config-if)# standby version 2
RouterB(config-if)# standby 1 ip 192.168.1.1
RouterB(config-if)# standby 1 priority 100
RouterB(config-if)# standby 1 preempt
\`\`\`

### Key Configuration Notes

- \`standby 1 ip 192.168.1.1\` — defines HSRP group 1 with virtual IP 192.168.1.1
- \`standby 1 priority 110\` — higher priority becomes Active (default is 100)
- \`standby 1 preempt\` — allows a higher-priority router to reclaim the Active role
- \`standby version 2\` — uses HSRPv2 (supports group numbers 0–4095, millisecond timers)

## HSRP Failover

When the Active router fails:

1. Standby router stops receiving Hello messages
2. After the Hold timer expires (default 10 seconds), Standby transitions to **Active**
3. New Active router starts responding to ARP with the virtual MAC
4. Traffic flows through the new Active router — **hosts notice nothing**

When the original router recovers:
- Without **preemption**: it becomes Standby (the current Active keeps its role)
- With **preemption**: it reclaims Active status because it has higher priority

## HSRP Verification

\`\`\`
Router# show standby
GigabitEthernet0/0 - Group 1
  State is Active
    2 state changes, last state change 00:15:23
  Virtual IP address is 192.168.1.1
  Active virtual MAC address is 0000.0c9f.f001
  Local virtual MAC address is 0000.0c9f.f001 (v2 default)
  Hello time 3 sec, hold time 10 sec
  Priority 110 (default 100)
  Preemption enabled
  Active router is local
  Standby router is 192.168.1.3, priority 100

Router# show standby brief
                     P indicates configured to preempt.
                     |
Interface   Grp  Pri  P  State   Active          Standby         Virtual IP
Gi0/0        1   110  P  Active  local           192.168.1.3     192.168.1.1
\`\`\`

## VRRP (Virtual Router Redundancy Protocol)

**VRRP** is the open-standard equivalent of HSRP (RFC 5798). Key differences:

| Feature | HSRP | VRRP |
|---------|------|------|
| Standard | Cisco proprietary | Open standard (RFC 5798) |
| Active/Standby names | Active / Standby | Master / Backup |
| Default Priority | 100 | 100 |
| Preemption | Disabled by default | Enabled by default |
| Virtual MAC | 0000.0C07.ACxx (v1) | 0000.5E00.01xx |

VRRP configuration (on supported platforms):

\`\`\`
Router(config)# interface GigabitEthernet0/0
Router(config-if)# vrrp 1 ip 192.168.1.1
Router(config-if)# vrrp 1 priority 110
\`\`\`

## GLBP (Gateway Load Balancing Protocol)

**GLBP** is a Cisco-proprietary FHRP that provides both redundancy **and load balancing**. Unlike HSRP/VRRP where only one router forwards traffic at a time:

- All routers in a GLBP group can **actively forward traffic**
- An **AVG (Active Virtual Gateway)** assigns virtual MACs to group members
- Hosts are distributed across the routers

GLBP is beyond the CCNA scope but worth knowing exists.

## Choosing an FHRP

| Protocol | Vendor | Load Balancing | Use Case |
|----------|--------|----------------|----------|
| HSRP | Cisco | No (single active) | Cisco-only networks |
| VRRP | Open | No (single master) | Multi-vendor networks |
| GLBP | Cisco | Yes (active-active) | Cisco, need load sharing |

## Best Practices

- **Always configure preemption** — ensures the preferred router becomes Active after recovery
- **Use HSRPv2** for new deployments — supports more groups and faster timers
- **Track interfaces** — reduce priority when an upstream link fails to trigger failover:

\`\`\`
Router(config)# track 1 interface GigabitEthernet0/1 line-protocol
Router(config)# interface GigabitEthernet0/0
Router(config-if)# standby 1 track 1 decrement 20
\`\`\`

This reduces the HSRP priority by 20 if the tracked interface goes down, causing the standby router to take over.

FHRPs are a fundamental part of any redundant network design. Understanding HSRP configuration and failover behavior is essential for the CCNA exam and real-world network operations.`
  }
};
