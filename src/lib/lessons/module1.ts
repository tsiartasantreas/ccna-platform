export const module1Lessons: Record<
  number,
  {
    objectives: string[];
    keyTerms: { term: string; definition: string }[];
    content: string;
  }
> = {
  // ─── Lesson 1: OSI & TCP/IP Models ─────────────────────────────────────────
  1: {
    objectives: [
      "Identify and describe the purpose of each of the seven layers of the OSI model",
      "Explain how data encapsulation works as information moves down the OSI stack",
      "Recognize the Protocol Data Unit (PDU) associated with each OSI layer",
      "Compare the OSI model with the TCP/IP model and explain their relationship",
      "Describe how real-world protocols map to specific layers in both models",
    ],
    keyTerms: [
      {
        term: "OSI Model",
        definition:
          "The Open Systems Interconnection model is a conceptual framework that divides network communication into seven abstraction layers, from physical signals to application data.",
      },
      {
        term: "Encapsulation",
        definition:
          "The process by which each layer adds its own header (and sometimes trailer) to the data received from the layer above, wrapping it with protocol-specific control information.",
      },
      {
        term: "PDU (Protocol Data Unit)",
        definition:
          "The unit of data specific to each OSI layer: data (Application/Presentation/Session), segment (Transport), packet (Network), frame (Data Link), and bits (Physical).",
      },
      {
        term: "TCP/IP Model",
        definition:
          "A four-layer practical networking model (Application, Transport, Internet, Network Access) used by the modern Internet, developed by DARPA.",
      },
      {
        term: "De-encapsulation",
        definition:
          "The reverse of encapsulation, where each layer strips its header as data moves up the receiving stack from Physical to Application.",
      },
    ],
    content: `
![Diagram](/images/diagrams/osi-model.svg)

## The OSI Reference Model

The **Open Systems Interconnection (OSI)** model was developed by the International Organization for Standardization (ISO) in the late 1970s. It provides a universal language for describing how network devices and software communicate. Understanding the OSI model is foundational for every networking professional because it gives you a structured way to troubleshoot, design, and discuss networks.

The model is divided into **seven layers**, each with a distinct responsibility. A helpful mnemonic to remember the layers from bottom to top is **"Please Do Not Throw Sausage Pizza Away"** — Physical, Data Link, Network, Transport, Session, Presentation, Application.

---

### Layer 7 — Application

The **Application layer** is the closest to the end user. It does **not** refer to applications themselves (like a web browser), but rather to the protocols and services that applications use to communicate over the network. Protocols operating at this layer include **HTTP/HTTPS** (web browsing), **SMTP** (email sending), **POP3/IMAP** (email retrieval), **FTP** (file transfer), **DNS** (name resolution), **DHCP** (automatic IP configuration), and **SNMP** (network management).

When you type a URL into your browser, the browser interacts with Layer 7 protocols to formulate the request.

### Layer 6 — Presentation

The **Presentation layer** is responsible for **data formatting, encryption, and compression**. It ensures that data sent by one system's Application layer can be read by the receiving system's Application layer. Examples include **SSL/TLS encryption**, **JPEG/GIF image formatting**, and **ASCII/EBCDIC character encoding**. In modern networking stacks, these functions are often handled directly by the application or the operating system.

### Layer 5 — Session

The **Session layer** establishes, manages, and terminates **sessions** between applications. A session is a sustained dialogue between two devices. This layer handles **dialogue control** (determining whose turn it is to transmit) and **synchronization** (inserting checkpoints into data streams so that transfers can resume after a failure). Protocols and APIs such as **NetBIOS**, **RPC (Remote Procedure Call)**, and **PPTP** operate here.

### Layer 4 — Transport

The **Transport layer** is critical for end-to-end communication. Its two primary protocols are:

- **TCP (Transmission Control Protocol)** — connection-oriented, reliable delivery with sequencing, acknowledgments, flow control, and error recovery. Used for HTTP, FTP, SMTP, and SSH.
- **UDP (User Datagram Protocol)** — connectionless, best-effort delivery with low overhead. Used for DNS queries, VoIP, video streaming, and DHCP.

The Transport layer uses **port numbers** (0–65535) to identify specific applications or services. Well-known ports (0–1023) include HTTP (80), HTTPS (443), SSH (22), and DNS (53). Registered ports (1024–49151) and dynamic/private ports (49152–65535) serve other purposes.

At this layer, data is called a **segment** (TCP) or **datagram** (UDP).

### Layer 3 — Network

The **Network layer** handles **logical addressing** and **routing**. The primary protocol at this layer is **IP (Internet Protocol)**, which assigns logical addresses (IPv4 or IPv6) to devices and determines the best path to a destination through a process called **routing**. Devices that operate at Layer 3 are **routers** and **Layer 3 switches**.

Key concepts include:
- **IP addressing** — every device gets a unique logical address
- **Routing** — routers use routing tables and protocols (OSPF, EIGRP, BGP) to forward packets
- **Fragmentation** — breaking packets that are too large for a given network medium

The PDU at Layer 3 is called a **packet**.

### Layer 2 — Data Link

The **Data Link layer** provides **node-to-node** connectivity and is divided into two sublayers by IEEE:

1. **LLC (Logical Link Control) — IEEE 802.2**: Multiplexes protocols, identifies network layer protocols, and provides flow control.
2. **MAC (Media Access Control) — IEEE 802.3/802.11**: Controls how devices on a shared medium gain access. Provides **physical addressing** via MAC addresses (48-bit, written as six hex octets like \`AA:BB:CC:11:22:33\`).

Switches operate at Layer 2. They use **MAC address tables** to forward frames only to the port where the destination device resides. The PDU at Layer 2 is a **frame**, which includes a header (source/destination MAC, EtherType) and a trailer (Frame Check Sequence for error detection).

### Layer 1 — Physical

The **Physical layer** deals with the actual **electrical, optical, or radio signals** transmitted over a medium. It defines specifications for cables (copper, fiber), connectors (RJ-45, LC, SC), signaling (voltage levels, light pulses), and data rates. Devices like **hubs**, **repeaters**, and the physical NICs in computers operate here. The PDU at this layer is raw **bits** (ones and zeros).

---

### OSI Layers Summary Table

| Layer | Name           | PDU       | Key Function                | Example Protocols/Devices       |
|-------|----------------|-----------|-----------------------------|---------------------------------|
| 7     | Application    | Data      | User services               | HTTP, DNS, FTP, SMTP            |
| 6     | Presentation   | Data      | Formatting, encryption      | SSL/TLS, JPEG, ASCII            |
| 5     | Session        | Data      | Session management          | NetBIOS, RPC, PPTP              |
| 4     | Transport      | Segment   | End-to-end delivery         | TCP, UDP                        |
| 3     | Network        | Packet    | Logical addressing, routing | IP, ICMP, routers               |
| 2     | Data Link      | Frame     | Physical addressing         | Ethernet, MAC, switches         |
| 1     | Physical       | Bits      | Signal transmission         | Cables, NICs, hubs              |

---

## Encapsulation and De-encapsulation

When a host sends data, each layer adds its own header to the data from the layer above — this is **encapsulation**. The process works as follows:

1. **Application layer** creates the **data** (e.g., an HTTP request).
2. **Transport layer** adds a TCP or UDP header, creating a **segment**. The header includes source and destination port numbers.
3. **Network layer** adds an IP header, creating a **packet**. The header includes source and destination IP addresses.
4. **Data Link layer** adds an Ethernet header and trailer (FCS), creating a **frame**. The header includes source and destination MAC addresses.
5. **Physical layer** converts the frame to **bits** and transmits them as signals over the cable.

On the receiving host, **de-encapsulation** occurs in reverse: the Physical layer converts signals to bits, the Data Link layer strips the frame header and verifies the FCS, the Network layer processes the IP header, the Transport layer delivers data to the correct application port, and so on up to the Application layer.

---

## The TCP/IP Model

The **TCP/IP model** (also called the Internet protocol suite) is the practical model that the modern Internet is built upon. It has **four layers**:

| TCP/IP Layer        | Corresponds to OSI Layers | Example Protocols               |
|---------------------|---------------------------|---------------------------------|
| Application         | 7, 6, 5                   | HTTP, DNS, FTP, SSH, SMTP       |
| Transport           | 4                         | TCP, UDP                        |
| Internet            | 3                         | IP, ICMP, ARP                   |
| Network Access      | 2, 1                      | Ethernet, Wi-Fi, PPP            |

The TCP/IP model merges the top three OSI layers into a single **Application layer** and merges the bottom two OSI layers into a single **Network Access layer** (sometimes called the **Link** or **Network Interface layer**). The **Transport** and **Internet** layers map directly to their OSI counterparts.

### Key Differences Between the Models

- The OSI model is a **reference model** — theoretical and educational. The TCP/IP model is a **practical model** — it describes how the Internet actually works.
- The OSI model has 7 layers; the TCP/IP model has 4.
- The OSI model was developed by ISO; the TCP/IP model was developed by the U.S. Department of Defense (DARPA).
- In practice, most network engineers use the OSI model for **troubleshooting and discussion** but implement the TCP/IP model in real networks.

### Why Both Models Matter for the CCNA

Cisco expects you to understand both models fluently. Troubleshooting questions often reference OSI layers ("This problem is at Layer 3"), while protocol behavior is described in TCP/IP terms. Being able to translate between the two is an essential skill.

---

### Practical Troubleshooting Using the OSI Model

When a user reports "I can't reach the website," a structured approach follows the OSI layers from the bottom up:

1. **Layer 1** — Is the cable plugged in? Is the link light on?
2. **Layer 2** — Is the switch port active? Is the MAC address in the table?
3. **Layer 3** — Does the host have a valid IP? Can it ping the default gateway?
4. **Layer 4** — Is the correct port open? Is a firewall blocking the port?
5. **Layers 5-7** — Is DNS resolving correctly? Is the application configured properly?

This bottom-up approach is one of the most valuable troubleshooting methodologies you will learn.`,
  },

  // ─── Lesson 2: Network Topologies & Types ──────────────────────────────────
  2: {
    objectives: [
      "Describe the characteristics of star, mesh, partial mesh, ring, and hybrid topologies",
      "Distinguish between LAN, WAN, MAN, and SOHO network types",
      "Explain the advantages and disadvantages of each topology",
      "Identify common WAN technologies and their use cases",
      "Describe the components typically found in a SOHO network",
    ],
    keyTerms: [
      {
        term: "Topology",
        definition:
          "The physical or logical arrangement of devices and cables in a network, describing how nodes are interconnected.",
      },
      {
        term: "Star Topology",
        definition:
          "A network design where all devices connect to a central device (switch or hub); the most common topology in modern LANs.",
      },
      {
        term: "WAN (Wide Area Network)",
        definition:
          "A network that spans a large geographic area, connecting LANs across cities, countries, or continents, often leased from service providers.",
      },
      {
        term: "SOHO (Small Office/Home Office)",
        definition:
          "A small network setup typical of a home office or small business, usually containing a router, switch, wireless access point, and a handful of devices.",
      },
      {
        term: "Full Mesh",
        definition:
          "A topology where every device has a direct point-to-point link to every other device, providing maximum redundancy at high cost.",
      },
    ],
    content: `## Network Topologies

A network **topology** describes the arrangement of elements (links, nodes) in a communication network. Topologies can be described as **physical** (how cables are actually laid out) or **logical** (how data flows regardless of physical wiring).

Understanding topologies helps you design networks that balance **cost, performance, scalability, and fault tolerance**.

---

### Star Topology

In a **star topology**, every device connects to a **central device** — typically a switch (modern) or hub (legacy). This is the dominant topology in today's Ethernet LANs.

**Advantages:**
- Easy to install and manage
- Failure of one cable/device does not affect the rest of the network
- Simple to add new devices
- Troubleshooting is straightforward

**Disadvantages:**
- The central device is a **single point of failure** — if the switch fails, the entire segment goes down
- Requires more cabling than some other topologies
- Limited by the number of ports on the central device

**Real-world example:** An office floor with 24 workstations connected to a Cisco Catalyst 2960 switch in a wiring closet.

---

### Bus Topology

In a **bus topology**, all devices share a single cable (the "bus" or "backbone"). Signals travel in both directions and are received by all devices. A **terminator** is required at each end of the bus to prevent signal reflection.

**Advantages:**
- Simple and inexpensive for small networks
- Requires less cabling than star

**Disadvantages:**
- A cable break disrupts the entire network
- Difficult to troubleshoot
- Performance degrades as more devices are added (shared bandwidth)
- Largely **obsolete** in modern networking

**Historical note:** Early 10BASE2 (thin coax) and 10BASE5 (thick coax) Ethernet used bus topology.

---

### Ring Topology

In a **ring topology**, each device connects to exactly two other devices, forming a closed loop. Data travels in **one direction** (unidirectional) around the ring, passing through each device until it reaches its destination.

**Advantages:**
- Predictable performance (token-based access prevents collisions)
- Equal access for all devices

**Disadvantages:**
- A single device or cable failure can break the entire ring
- Difficult to add or remove devices
- Slower than switched Ethernet

**Variations:** **Dual-ring topology** (used in FDDI and SONET/SDH) uses two rings traveling in opposite directions for redundancy. If the primary ring fails, traffic switches to the secondary ring.

---

### Mesh Topology

In a **mesh topology**, devices are interconnected with multiple paths between them.

- **Full mesh:** Every device connects directly to every other device. If there are *n* devices, each device has *n-1* connections, and the total number of links is *n(n-1)/2*. This provides **maximum redundancy** but is expensive and complex.
- **Partial mesh:** Only some devices have direct connections to others. This balances cost and redundancy.

**Advantages:**
- Excellent fault tolerance — if one link fails, traffic reroutes
- High bandwidth availability due to multiple paths

**Disadvantages:**
- Expensive and complex to implement (especially full mesh)
- Difficult to manage at scale

**Real-world example:** The Internet itself is a partial mesh. Between routers in a data center, partial or full mesh is common. WAN connections between branch offices often use a hub-and-spoke (star) or partial mesh design.

---

### Hybrid Topology

A **hybrid topology** combines two or more basic topologies. For example, a large enterprise campus might use:
- **Star** topology within each floor (workstations to switches)
- **Partial mesh** between distribution-layer switches for redundancy
- **Hierarchical** design connecting access, distribution, and core layers

Most real-world networks are hybrid topologies. Cisco's **three-tier hierarchical model** (Core, Distribution, Access) is a structured hybrid approach:

| Layer      | Role                                      | Topology Hint             |
|------------|-------------------------------------------|---------------------------|
| **Core**   | High-speed backbone, fast transport       | Mesh or partial mesh      |
| **Distribution** | Policy enforcement, routing, filtering | Redundant links to core  |
| **Access** | End-user connectivity                     | Star (hosts to switches)  |

For smaller networks, Cisco recommends the **collapsed core** model, where the distribution and core layers are combined into one layer.

---

## Network Types

### LAN (Local Area Network)

A **LAN** covers a small geographic area — a single building, floor, or campus. Key characteristics:

- Owned and managed by a single organization
- High-speed connectivity (1 Gbps, 10 Gbps, or even 40/100 Gbps)
- Uses Ethernet (IEEE 802.3) and Wi-Fi (IEEE 802.11)
- Low latency and low error rates
- Typically uses private IP addressing (RFC 1918)

### WLAN (Wireless LAN)

A **WLAN** uses radio waves instead of cables. Standards include **802.11a/b/g/n/ac/ax (Wi-Fi 6)**. WLANs extend LAN connectivity to mobile devices and areas where cabling is impractical. Security protocols like **WPA3** protect wireless communications.

### WAN (Wide Area Network)

A **WAN** spans a large geographic area — connecting LANs across cities, states, or countries. Key characteristics:

- Often uses leased lines, MPLS, or Internet-based VPNs from service providers
- Lower speeds than LANs (though this gap is narrowing)
- Higher latency and potentially higher error rates
- Technologies include **MPLS**, **Metro Ethernet**, **Frame Relay** (legacy), **ATM** (legacy), **PPP**, **HDLC**, and **SD-WAN**

### MAN (Metropolitan Area Network)

A **MAN** spans a city or large campus. It is larger than a LAN but smaller than a WAN. Cable TV networks and municipal Wi-Fi are examples.

### SAN (Storage Area Network)

A **SAN** is a specialized, high-speed network that provides **block-level storage access** to servers. It uses **Fibre Channel (FC)** or **iSCSI** protocols and is separate from the general-purpose LAN.

---

## SOHO Networks

A **Small Office/Home Office (SOHO)** network typically includes:

| Component                  | Purpose                                |
|----------------------------|----------------------------------------|
| **Router / Gateway**       | Connects to the ISP; provides NAT, DHCP, firewall |
| **Switch (if separate)**   | Connects wired devices                 |
| **Wireless Access Point**  | Provides Wi-Fi connectivity            |
| **Modem**                  | Converts ISP signal (DSL, cable, fiber) to Ethernet |
| **End devices**            | PCs, printers, phones, smart devices   |

In many SOHO setups, a single **wireless router** combines the router, switch, AP, and sometimes modem into one device (e.g., a consumer-grade router from Netgear, ASUS, or TP-Link).

A typical SOHO design:
\`\`\`
[Internet] --- [Modem] --- [Wireless Router/Switch/AP] --- [PCs, Printers, Phones]
\`\`\`

For the CCNA, understand that SOHO networks differ from enterprise networks primarily in scale, complexity, and the level of device management required.`,
  },

  // ─── Lesson 3: Cabling & Physical Infrastructure ───────────────────────────
  3: {
    objectives: [
      "Identify the characteristics and use cases of Cat5e, Cat6, Cat6a, and Cat7 copper cabling",
      "Compare single-mode and multi-mode fiber optic cables",
      "Recognize common cable connectors (RJ-45, LC, SC, ST) and their applications",
      "Distinguish between straight-through, crossover, and rollover cables and their uses",
      "Explain the purpose of cabling standards T568A and T568B",
    ],
    keyTerms: [
      {
        term: "UTP (Unshielded Twisted Pair)",
        definition:
          "A copper cable with pairs of wires twisted together to reduce electromagnetic interference; the most common cabling in LANs.",
      },
      {
        term: "Single-Mode Fiber (SMF)",
        definition:
          "Fiber optic cable with a very small core (8-10 microns) that carries a single mode of light, supporting long-distance transmission up to tens of kilometers.",
      },
      {
        term: "Multi-Mode Fiber (MMF)",
        definition:
          "Fiber optic cable with a larger core (50 or 62.5 microns) that carries multiple modes of light, suitable for shorter distances (up to about 2 km).",
      },
      {
        term: "RJ-45",
        definition:
          "An 8-pin modular connector used for Ethernet twisted-pair cabling; the standard connector at the end of UTP patch cables.",
      },
      {
        term: "Crossover Cable",
        definition:
          "A cable wired so that the transmit pins on one end connect to the receive pins on the other, used to connect similar devices (switch-to-switch, PC-to-PC).",
      },
    ],
    content: `## Copper Cabling

Copper cabling uses electrical signals to transmit data. The most common type in modern networking is **Unshielded Twisted Pair (UTP)**, defined by the **TIA/EIA-568** standards.

### How Twisted Pair Works

Each UTP cable contains **four pairs** of wires (eight wires total). The wires in each pair are twisted together at regular intervals. This twisting causes electromagnetic interference (EMI) from external sources to affect both wires in the pair equally, allowing the receiver to cancel out the noise — a technique called **differential signaling**.

### Cable Categories

| Category  | Max Speed    | Max Distance | Frequency   | Use Case                     |
|-----------|-------------|--------------|-------------|------------------------------|
| Cat5      | 100 Mbps    | 100 m        | 100 MHz     | Legacy Fast Ethernet (obsolete) |
| Cat5e     | 1 Gbps      | 100 m        | 100 MHz     | Standard LAN cabling         |
| Cat6      | 1 Gbps (10 Gbps to 55 m) | 100 m | 250 MHz | Enhanced LAN, short 10G runs |
| Cat6a     | 10 Gbps     | 100 m        | 500 MHz     | 10 Gigabit Ethernet          |
| Cat7      | 10 Gbps     | 100 m        | 600 MHz     | Data centers (shielded)      |
| Cat8      | 25/40 Gbps  | 30 m         | 2000 MHz    | Data center interconnects    |

**Key takeaway for the CCNA:** Cat5e and Cat6 are the most commonly deployed in enterprise LANs. All UTP Ethernet has a **maximum segment length of 100 meters** (approximately 328 feet), which includes the patch cables at both ends.

### T568A and T568B Wiring Standards

Two wiring standards define which colored wire goes to which pin on an RJ-45 connector:

| Pin | T568A Color      | T568B Color      |
|-----|-------------------|-------------------|
| 1   | White/Green       | White/Orange      |
| 2   | Green             | Orange            |
| 3   | White/Orange      | White/Green       |
| 4   | Blue              | Blue              |
| 5   | White/Blue        | White/Blue        |
| 6   | Orange            | Green             |
| 7   | White/Brown       | White/Brown       |
| 8   | Brown             | Brown             |

**T568B** is more common in the United States. Both standards are functionally equivalent as long as both ends of a cable use the **same** standard.

### Cable Types

- **Straight-through cable:** Both ends use the **same** standard (T568B-T568B). Used to connect **unlike** devices: PC to switch, switch to router.
- **Crossover cable:** One end uses T568A and the other T568B (the transmit and receive pairs are swapped). Used to connect **like** devices: switch to switch, PC to PC, router to router.
- **Rollover cable (console cable):** A Cisco-proprietary cable used to connect a PC's serial port to a router or switch's **console port** for initial configuration. One end has a DB-9 or USB connector; the other has an RJ-45 connector.

**Auto-MDI/MDI-X:** Modern Ethernet ports support **auto-MDI/MDI-X**, which automatically detects whether a straight-through or crossover cable is connected and adjusts accordingly. This means crossover cables are rarely needed in practice, but you should still understand them for the exam.

---

## Fiber Optic Cabling

Fiber optic cable transmits data as **pulses of light** through a glass or plastic core. It offers several advantages over copper:

- **Immunity to EMI** — light is not affected by electromagnetic interference
- **Longer distances** — can span kilometers instead of 100 meters
- **Higher bandwidth** — supports very high data rates (10 Gbps, 40 Gbps, 100 Gbps+)
- **Greater security** — extremely difficult to tap without detection

### Single-Mode vs. Multi-Mode Fiber

| Characteristic       | Single-Mode (SMF)        | Multi-Mode (MMF)           |
|----------------------|--------------------------|------------------------------|
| Core diameter        | 8-10 microns             | 50 or 62.5 microns          |
| Light source         | Laser                    | LED or VCSEL                 |
| Distance             | Up to 40+ km             | Up to ~2 km (varies by grade)|
| Cost                 | Higher (laser transceivers) | Lower                      |
| Color coding         | Yellow jacket (typically) | Orange (OM1/OM2), aqua (OM3/OM4) |
| Use case             | WAN, long campus runs    | LAN backbone, data center    |

**Fiber grades (OM ratings):**
- **OM1** — 62.5 micron, legacy, supports 100 Mbps to 1 Gbps
- **OM2** — 50 micron, supports up to 1 Gbps
- **OM3** — 50 micron, laser-optimized, supports 10 Gbps up to 300 m
- **OM4** — 50 micron, supports 10 Gbps up to 400 m, 100 Gbps up to 150 m
- **OS1/OS2** — Single-mode, used for long-haul and campus backbone connections

### Fiber Connectors

| Connector | Description                                      |
|-----------|--------------------------------------------------|
| **SC**    | Square/Subscriber Connector — push-pull, snap-in. Common in enterprise and telecom. |
| **LC**    | Lucent Connector — small form factor, very common in modern switches and SFP modules. |
| **ST**    | Straight Tip — bayonet-style twist-lock. Found in older installations. |
| **MTRJ**  | Mechanical Transfer Registered Jack — small, duplex connector. Less common. |

A useful memory aid: **SC = "Standard Connector" or "Square," LC = "Little Connector" (small form factor), ST = "Stick and Twist."**

### Fiber Patch Cable Polarity

Fiber cables can be:
- **Simplex** — one fiber for one-way communication
- **Duplex** — two fibers, one for transmit and one for receive (most common)

When connecting devices, the **transmit (Tx)** on one end must connect to the **receive (Rx)** on the other end. If a link does not come up, swapping the fiber strands at one end is a common troubleshooting step.

---

## Cabling Best Practices

- Keep UTP cable runs **under 100 meters**
- Avoid running UTP cables parallel to high-voltage electrical cables (EMI risk)
- Use **cable management** (trays, labels, patch panels) for organization
- Maintain proper **bend radius** for fiber to avoid signal loss
- Document all cable runs with **cable labels** and **floor plans**
- Test every cable run with a **cable tester** or **certifier** after installation`,
  },

  // ─── Lesson 4: IPv4 Addressing & Binary Math ──────────────────────────────
  4: {
    objectives: [
      "Convert between binary and decimal number systems",
      "Describe the structure of an IPv4 address including network and host portions",
      "Identify the five address classes (A through E) and their default subnet masks",
      "Distinguish between public and private IPv4 address ranges",
      "Explain special addresses such as loopback, broadcast, and APIPA",
    ],
    keyTerms: [
      {
        term: "IPv4 Address",
        definition:
          "A 32-bit logical address assigned to a network interface, written in dotted decimal notation (e.g., 192.168.1.1) with four octets separated by periods.",
      },
      {
        term: "Subnet Mask",
        definition:
          "A 32-bit number that divides an IPv4 address into the network portion and the host portion; the 1 bits represent the network, and the 0 bits represent the host.",
      },
      {
        term: "Default Gateway",
        definition:
          "The router interface that a host sends traffic to when the destination is on a different network; it must be on the same subnet as the host.",
      },
      {
        term: "Private Address Space",
        definition:
          "IPv4 ranges defined by RFC 1918 that are not routable on the public Internet: 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16.",
      },
      {
        term: "Broadcast Address",
        definition:
          "An address where all host bits are set to 1 (e.g., 192.168.1.255 with a /24 mask); packets sent to this address are received by all hosts on the network.",
      },
    ],
    content: `## Binary Number System

Computers and networking devices operate using **binary** (base-2), where every value is represented by ones and zeros. Understanding binary is essential for IPv4 addressing and subnetting.

### Binary to Decimal Conversion

An IPv4 address is **32 bits** long, divided into four **octets** of 8 bits each. Each bit position has a decimal value based on powers of 2:

| Bit Position (right to left) | 7   | 6   | 5   | 4   | 3   | 2   | 1   | 0   |
|------------------------------|-----|-----|-----|-----|-----|-----|-----|-----|
| Power of 2                   | 2^7 | 2^6 | 2^5 | 2^4 | 2^3 | 2^2 | 2^1 | 2^0 |
| Decimal Value                | 128 | 64  | 32  | 16  | 8   | 4   | 2   | 1   |

To convert binary to decimal, **add up the decimal values of all bit positions that contain a 1.**

**Example:** \`11000000\` = 128 + 64 + 0 + 0 + 0 + 0 + 0 + 0 = **192**

**Example:** \`10101000\` = 128 + 0 + 32 + 0 + 8 + 0 + 0 + 0 = **168**

**Full IP address example:**

| Octet 1       | Octet 2       | Octet 3       | Octet 4       |
|---------------|---------------|---------------|---------------|
| 11000000      | 10101000      | 00000001      | 01100100      |
| = 192         | = 168         | = 1           | = 100         |

Result: **192.168.1.100**

### Decimal to Binary Conversion

To convert decimal to binary, repeatedly subtract the largest power of 2 that fits:

**Example:** Convert **172** to binary:
- 172 - 128 = 44 → bit 7 = **1**
- 44 - 64 = cannot subtract → bit 6 = **0**
- 44 - 32 = 12 → bit 5 = **1**
- 12 - 16 = cannot subtract → bit 4 = **0**
- 12 - 8 = 4 → bit 3 = **1**
- 4 - 4 = 0 → bit 2 = **1**
- 0 - 2 = cannot subtract → bit 1 = **0**
- 0 - 1 = cannot subtract → bit 0 = **0**

Result: **10101100** = 172

### Quick Reference: Powers of 2

| 2^n  | Value |
|------|-------|
| 2^0  | 1     |
| 2^1  | 2     |
| 2^2  | 4     |
| 2^3  | 8     |
| 2^4  | 16    |
| 2^5  | 32    |
| 2^6  | 64    |
| 2^7  | 128   |
| 2^8  | 256   |
| 2^10 | 1024  |
| 2^16 | 65,536|

Memorize this table — it will be used constantly in subnetting.

---

## IPv4 Address Structure

An IPv4 address has two parts:

1. **Network portion** — identifies the network (like a street name)
2. **Host portion** — identifies a specific device on that network (like a house number)

The **subnet mask** determines where the network portion ends and the host portion begins.

**Example:**
\`\`\`
IP Address:   192.168.1.100     = 11000000.10101000.00000001.01100100
Subnet Mask:  255.255.255.0     = 11111111.11111111.11111111.00000000
                                  |<---- Network ---->|<-- Host -->|
\`\`\`

The first three octets (24 bits) identify the **network** (192.168.1.0), and the last octet (8 bits) identifies the **host** (100).

---

## Address Classes

IPv4 addresses were historically divided into five classes:

| Class | First Octet Range | Default Mask      | Network/Host Bits | Purpose              |
|-------|-------------------|-------------------|-------------------|----------------------|
| A     | 1-126             | 255.0.0.0 (/8)    | N.H.H.H           | Very large networks  |
| B     | 128-191           | 255.255.0.0 (/16) | N.N.H.H           | Medium networks      |
| C     | 192-223           | 255.255.255.0 (/24)| N.N.N.H          | Small networks       |
| D     | 224-239           | N/A               | N/A               | Multicast            |
| E     | 240-255           | N/A               | N/A               | Experimental/Reserved|

**Note:** The range 127.0.0.0 to 127.255.255.255 is reserved for **loopback** testing (127.0.0.1 = localhost).

**Classless addressing (CIDR):** Modern networks use **Classless Inter-Domain Routing (CIDR)**, defined in RFC 4632, which allows subnet masks of any length (not just /8, /16, or /24). This is written as **prefix notation**, such as 192.168.1.0/24.

---

## Public vs. Private Addresses

**RFC 1918** defines three ranges of private IPv4 addresses that are **not routable** on the public Internet:

| Class | Private Range                   | CIDR Notation     |
|-------|---------------------------------|--------------------|
| A     | 10.0.0.0 — 10.255.255.255      | 10.0.0.0/8         |
| B     | 172.16.0.0 — 172.31.255.255    | 172.16.0.0/12      |
| C     | 192.168.0.0 — 192.168.255.255  | 192.168.0.0/16     |

Private addresses are used inside LANs and require **NAT (Network Address Translation)** to communicate with the public Internet. Most home and corporate networks use private addressing internally.

**Public addresses** are globally unique and assigned by **IANA** (Internet Assigned Numbers Authority) through regional registries (ARIN, RIPE, APNIC, LACNIC, AFRINIC).

---

## Special Addresses

| Address/Range                  | Purpose                                      |
|--------------------------------|----------------------------------------------|
| **0.0.0.0**                   | Default route / unspecified address           |
| **127.0.0.0/8**               | Loopback (127.0.0.1 = localhost)             |
| **169.254.0.0/16**            | APIPA (Automatic Private IP Addressing) — assigned by Windows when DHCP fails |
| **255.255.255.255**           | Limited broadcast (all hosts on local network)|
| **Network broadcast**         | All host bits set to 1 (e.g., 192.168.1.255) |
| **First address in range**    | Network address (e.g., 192.168.1.0) — not assignable to hosts |
| **Last address in range**     | Directed broadcast — not typically assignable |

---

## Assigning IPv4 Addresses to a Host

To configure a host on a network, you need at minimum:

1. **IP address** — unique on the network
2. **Subnet mask** — defines the network boundary
3. **Default gateway** — the router IP for reaching other networks (optional if no Internet/WAN access needed)
4. **DNS server** — for name resolution (optional but practically essential)

A host determines whether a destination is **local** (same network) or **remote** (different network) by comparing its own IP and subnet mask to the destination IP. If the destination is local, the host sends the frame directly. If remote, the host sends the frame to the **default gateway**.

\`\`\`
# Windows: View IP configuration
ipconfig /all

# Linux/macOS: View IP configuration
ip addr show
ifconfig
\`\`\``,
  },

  // ─── Lesson 5: IPv4 Subnetting & VLSM ─────────────────────────────────────
  5: {
    objectives: [
      "Explain the purpose of subnetting and its benefits for network design",
      "Calculate the number of subnets and hosts per subnet for a given prefix length",
      "Determine network, broadcast, and valid host addresses for a given subnet",
      "Apply VLSM (Variable Length Subnet Masking) to design efficient address plans",
      "Practice subnetting with real-world scenarios and shortcut methods",
    ],
    keyTerms: [
      {
        term: "Subnetting",
        definition:
          "The process of dividing a larger network into smaller, more manageable sub-networks (subnets) by borrowing bits from the host portion of the address.",
      },
      {
        term: "VLSM (Variable Length Subnet Masking)",
        definition:
          "A technique that allows different subnets within the same network to use different subnet mask lengths, enabling efficient use of address space.",
      },
      {
        term: "CIDR (Classless Inter-Domain Routing)",
        definition:
          "An addressing scheme that uses prefix notation (e.g., /24) instead of classful masks, allowing flexible allocation of IP address blocks.",
      },
      {
        term: "Network Address",
        definition:
          "The first address in a subnet, where all host bits are 0 (e.g., 192.168.1.0/24); it identifies the subnet and cannot be assigned to a host.",
      },
      {
        term: "Broadcast Address",
        definition:
          "The last address in a subnet, where all host bits are 1 (e.g., 192.168.1.255/24); packets sent here reach all hosts in the subnet.",
      },
    ],
    content: `
![Diagram](/images/diagrams/subnetting.svg)

## Why Subnetting?

Without subnetting, a Class B network like 172.16.0.0/16 would be a single flat network with 65,534 hosts — impractical for many reasons:

- **Broadcast traffic** would overwhelm all devices
- **Security** would be difficult to enforce
- **Network management** would be unwieldy
- **Address waste** — few organizations need 65,000 hosts on one segment

**Subnetting** solves these problems by dividing a large network into smaller, logical sub-networks.

---

## Subnetting Fundamentals

### The Key Formula

When you borrow *n* bits from the host portion to create subnets:

- **Number of subnets** = 2^n
- **Number of hosts per subnet** = 2^h - 2 (where h = remaining host bits)

You subtract 2 because each subnet reserves the **network address** (all host bits = 0) and the **broadcast address** (all host bits = 1).

**Example:** Given 192.168.1.0/24, borrow 3 bits for subnetting (making it /27):

\`\`\`
Original:  /24 = 11111111.11111111.11111111.00000000  (8 host bits)
New:       /27 = 11111111.11111111.11111111.11100000  (5 host bits)
                                                  ^^^
                                              3 borrowed bits
\`\`\`

- Number of subnets: 2^3 = **8 subnets**
- Hosts per subnet: 2^5 - 2 = **30 hosts each**

---

## Identifying Subnet Details

For any given IP address and prefix, you can calculate:

1. **Network address** — set all host bits to 0
2. **Broadcast address** — set all host bits to 1
3. **First usable host** — network address + 1
4. **Last usable host** — broadcast address - 1

### Example: Find the network details for 192.168.1.130/27

**Step 1:** Determine the block size (increment).
/27 means the subnet mask is 255.255.255.224. The interesting octet is the fourth.
256 - 224 = **32** (block size)

**Step 2:** List the subnet boundaries (multiples of 32 in the fourth octet):
- 192.168.1.0 (subnet 0)
- 192.168.1.32
- 192.168.1.64
- 192.168.1.96
- **192.168.1.128** ← 130 falls here
- 192.168.1.160
- 192.168.1.192
- 192.168.1.224

**Step 3:** Fill in the details:

| Field              | Value               |
|--------------------|---------------------|
| Network Address    | 192.168.1.128       |
| First Usable Host  | 192.168.1.129       |
| Last Usable Host   | 192.168.1.158       |
| Broadcast Address  | 192.168.1.159       |
| Subnet Mask        | 255.255.255.224 (/27)|
| Usable Hosts       | 30                  |

---

## Common Subnet Masks Quick Reference

| CIDR | Subnet Mask         | Block Size | Usable Hosts |
|------|---------------------|------------|--------------|
| /30  | 255.255.255.252     | 4          | 2            |
| /29  | 255.255.255.248     | 8          | 6            |
| /28  | 255.255.255.240     | 16         | 14           |
| /27  | 255.255.255.224     | 32         | 30           |
| /26  | 255.255.255.192     | 64         | 62           |
| /25  | 255.255.255.128     | 128        | 126          |
| /24  | 255.255.255.0       | 256        | 254          |
| /23  | 255.255.254.0       | 512        | 510          |
| /22  | 255.255.252.0       | 1024       | 1022         |
| /21  | 255.255.248.0       | 2048       | 2046         |
| /20  | 255.255.240.0       | 4096       | 4094         |
| /16  | 255.255.0.0         | 65,536     | 65,534       |
| /8   | 255.0.0.0           | 16,777,216 | 16,777,214   |

A useful shortcut: **Block size = 256 - mask value** in the interesting octet.

---

## VLSM (Variable Length Subnet Masking)

**VLSM** allows you to use **different subnet mask lengths** for different subnets within the same major network. This is far more efficient than traditional (fixed-length) subnetting.

### Without VLSM (Fixed-Length Subnetting)

If you need subnets for:
- 50 hosts, 25 hosts, 10 hosts, and 2 point-to-point links

Using fixed /26 subnets (62 hosts each) would waste addresses on the smaller segments.

### With VLSM

You can tailor each subnet:

| Requirement      | Subnet Mask     | CIDR | Usable Hosts | Wasted |
|------------------|-----------------|------|--------------|--------|
| 50 hosts needed  | 255.255.255.192 | /26  | 62           | 12     |
| 25 hosts needed  | 255.255.255.224 | /27  | 30           | 5      |
| 10 hosts needed  | 255.255.255.240 | /28  | 14           | 4      |
| 2 hosts (P2P)    | 255.255.255.252 | /30  | 2            | 0      |

### VLSM Design Process

1. **List all subnets** required, sorted by **largest number of hosts first**.
2. **Assign the largest subnet** a mask that accommodates the required hosts.
3. **Assign the next subnet** starting after the previous subnet's broadcast address.
4. **Repeat** until all subnets are assigned.

### VLSM Practice Example

**Given:** 192.168.10.0/24 — Design subnets for:
- LAN A: 60 hosts
- LAN B: 28 hosts
- LAN C: 12 hosts
- WAN Link 1: 2 hosts
- WAN Link 2: 2 hosts

**Solution:**

**Subnet 1 — LAN A (60 hosts):** Needs /26 (62 hosts)
- Network: 192.168.10.0/26
- Range: 192.168.10.1 – 192.168.10.62
- Broadcast: 192.168.10.63

**Subnet 2 — LAN B (28 hosts):** Needs /27 (30 hosts)
- Network: 192.168.10.64/27
- Range: 192.168.10.65 – 192.168.10.94
- Broadcast: 192.168.10.95

**Subnet 3 — LAN C (12 hosts):** Needs /28 (14 hosts)
- Network: 192.168.10.96/28
- Range: 192.168.10.97 – 192.168.10.110
- Broadcast: 192.168.10.111

**Subnet 4 — WAN Link 1 (2 hosts):** Needs /30 (2 hosts)
- Network: 192.168.10.112/30
- Range: 192.168.10.113 – 192.168.10.114
- Broadcast: 192.168.10.115

**Subnet 5 — WAN Link 2 (2 hosts):** Needs /30 (2 hosts)
- Network: 192.168.10.116/30
- Range: 192.168.10.117 – 192.168.10.118
- Broadcast: 192.168.10.119

Remaining address space: 192.168.10.120 – 192.168.10.255 (available for future use).

---

## Subnetting Shortcut: The "Magic Number" Method

For quick subnetting on the CCNA exam:

1. Identify the **interesting octet** (the octet where the subnet mask is not 0 or 255).
2. Calculate the **block size**: 256 - mask value in that octet.
3. Count in multiples of the block size to find subnet boundaries.
4. The **broadcast address** of each subnet is one less than the next subnet's network address.

**Example:** 172.16.5.100/20
- Interesting octet: 3rd octet (mask = 240)
- Block size: 256 - 240 = **16**
- Subnet boundaries in the 3rd octet: 0, 16, 32, 48, 64, ...
- 5 falls in the **0** subnet (172.16.0.0/20)
- Network: 172.16.0.0, Broadcast: 172.16.15.255
- Host range: 172.16.0.1 – 172.16.15.254

---

## Practice Problems

Try these on your own (answers below):

1. What is the broadcast address of 10.1.32.0/19?
2. How many usable hosts in 172.16.0.0/22?
3. What subnet does 192.168.100.200/26 belong to?

**Answers:**
1. /19 = 255.255.224.0. Block = 32. 10.1.32.0 to 10.1.63.255. Broadcast: **10.1.63.255**
2. /22 has 10 host bits. 2^10 - 2 = **1022 usable hosts**
3. /26 = block size 64 in 4th octet. 200 falls in the 192 subnet (192.168.100.192/26). Broadcast: 192.168.100.255`,
  },

  // ─── Lesson 6: IPv6 Addressing ─────────────────────────────────────────────
  6: {
    objectives: [
      "Explain the motivation for IPv6 and the problems it solves compared to IPv4",
      "Describe the structure of an IPv6 address and apply shortening (zero compression) rules",
      "Identify IPv6 address types: unicast, multicast, anycast, and link-local",
      "Explain EUI-64 interface identifier generation from a MAC address",
      "Describe dual-stack, tunneling, and NAT64 transition mechanisms",
    ],
    keyTerms: [
      {
        term: "IPv6 Address",
        definition:
          "A 128-bit address written as eight groups of four hexadecimal digits separated by colons (e.g., 2001:0DB8:0000:0000:0000:0000:0000:0001), providing a virtually unlimited address space.",
      },
      {
        term: "Link-Local Address",
        definition:
          "An IPv6 address in the FE80::/10 range that is automatically configured on every IPv6-enabled interface and is only valid on the local link (not routable).",
      },
      {
        term: "EUI-64",
        definition:
          "Extended Unique Identifier 64-bit — a method of generating the interface ID portion of an IPv6 address by inserting FFFE into the middle of a 48-bit MAC address and flipping the 7th bit.",
      },
      {
        term: "Global Unicast Address",
        definition:
          "A globally routable IPv6 address in the 2000::/3 range, equivalent to a public IPv4 address, assigned by IANA to registries and then to organizations.",
      },
      {
        term: "Dual-Stack",
        definition:
          "A transition mechanism where a device runs both IPv4 and IPv6 simultaneously, allowing communication with hosts on either network.",
      },
    ],
    content: `## Why IPv6?

IPv4's 32-bit address space provides approximately **4.3 billion** unique addresses — a number that has been effectively exhausted. **IPv6** uses **128-bit addresses**, providing approximately **3.4 x 10^38** addresses — enough to assign trillions of addresses to every person on Earth.

### Problems IPv6 Solves

| Problem                     | IPv4                          | IPv6                              |
|-----------------------------|-------------------------------|------------------------------------|
| Address exhaustion          | ~4.3 billion addresses        | ~340 undecillion addresses         |
| NAT dependency              | Required due to address shortage | Not required (end-to-end connectivity restored) |
| Header complexity           | Variable-length header        | Simplified, fixed 40-byte header   |
| Configuration               | Manual or DHCP                | SLAAC (Stateless Address Autoconfig) + DHCPv6 |
| Security                    | Optional (IPsec)              | IPsec built into the protocol      |

---

## IPv6 Address Structure

An IPv6 address is **128 bits**, written as **eight groups of four hexadecimal digits** separated by colons:

\`\`\`
2001:0DB8:0000:0000:0000:0000:0000:0001
\`\`\`

Each group represents 16 bits (2 bytes), and eight groups x 16 bits = 128 bits.

### IPv6 Address Shortening Rules

**Rule 1 — Leading zeros can be omitted** within each group:
\`\`\`
2001:0DB8:0000:0000:0000:0000:0000:0001
  becomes
2001:DB8:0:0:0:0:0:1
\`\`\`

**Rule 2 — A single consecutive group of all-zero groups can be replaced with ::** (double colon):
\`\`\`
2001:DB8:0:0:0:0:0:1
  becomes
2001:DB8::1
\`\`\`

**Important:** The **::** can only be used **once** in an address. If used more than once, the device would not know how many zero groups each :: represents.

**More examples:**

| Full Address                                    | Shortened         |
|------------------------------------------------|-------------------|
| FE80:0000:0000:0000:0000:0000:0000:0001        | FE80::1           |
| FF02:0000:0000:0000:0000:0000:0000:0001        | FF02::1           |
| 2001:0DB8:0000:0001:0000:0000:0000:0050        | 2001:DB8:0:1::50  |
| 0000:0000:0000:0000:0000:0000:0000:0001        | ::1 (loopback)    |
| 0000:0000:0000:0000:0000:0000:0000:0000        | :: (unspecified)  |

---

## IPv6 Address Types

### Unicast (one-to-one)

| Type                    | Range       | Description                                     |
|-------------------------|-------------|--------------------------------------------------|
| **Global Unicast**      | 2000::/3    | Publicly routable, similar to public IPv4. Currently 2000::/3 is allocated. |
| **Link-Local**          | FE80::/10   | Auto-configured on every IPv6 interface. Required for IPv6 to function. Only valid on the local link. |
| **Unique Local (ULA)**  | FC00::/7    | Similar to RFC 1918 private addresses. Typically FD00::/8. Not routable on the Internet. |
| **Loopback**            | ::1/128     | Equivalent to 127.0.0.1 in IPv4.                |
| **Unspecified**         | ::/128      | All zeros. Used when no address is available.    |

### Multicast (one-to-many)

IPv6 multicast addresses start with **FF00::/8**. Important multicast addresses:

| Address        | Description                              |
|----------------|------------------------------------------|
| **FF02::1**    | All nodes on the local link              |
| **FF02::2**    | All routers on the local link            |
| **FF02::5**    | OSPF routers                             |
| **FF02::6**    | OSPF designated routers                  |
| **FF02::9**    | RIPng routers                            |
| **FF02::FB**   | mDNS                                     |

**Key difference from IPv4:** IPv6 does **not** use broadcast. Instead, multicast fulfills the roles that broadcast served in IPv4.

### Anycast (one-to-nearest)

An **anycast** address is assigned to **multiple interfaces** (typically on different devices). Traffic sent to an anycast address is delivered to the **nearest** interface (as determined by the routing protocol). Anycast addresses are syntactically identical to unicast addresses — they are distinguished by configuration.

---

## EUI-64 (Extended Unique Identifier)

**EUI-64** automatically generates the **64-bit interface ID** portion of an IPv6 address from a device's **48-bit MAC address**. The process:

1. **Split** the 48-bit MAC address in half: \`AA:BB:CC\` | \`DD:EE:FF\`
2. **Insert** \`FF:FE\` in the middle: \`AA:BB:CC:FF:FE:DD:EE:FF\`
3. **Flip** the 7th bit (the "universal/local" bit) of the first byte.

**Example:**
\`\`\`
MAC address:           00:1A:2B:3C:4D:5E
Step 1 - Split:        00:1A:2B  |  3C:4D:5E
Step 2 - Insert FFFE:  00:1A:2B:FF:FE:3C:4D:5E
Step 3 - Flip 7th bit: 02:1A:2B:FF:FE:3C:4D:5E
  (00000000 -> 00000010)
\`\`\`

If the link-local prefix is FE80::/10, the full address would be:
\`\`\`
FE80::021A:2BFF:FE3C:4D5E
\`\`\`

**CLI verification:**
\`\`\`
Router# show ipv6 interface GigabitEthernet0/0
GigabitEthernet0/0 is up, line protocol is up
  IPv6 is enabled, link-local address is FE80::21A:2BFF:FE3C:4D5E
\`\`\`

---

## IPv6 Configuration on Cisco IOS

\`\`\`
! Enable IPv6 routing (disabled by default)
Router(config)# ipv6 unicast-routing

! Configure an interface with a global unicast address
Router(config)# interface GigabitEthernet0/0
Router(config-if)# ipv6 address 2001:DB8:ACAD:1::1/64
Router(config-if)# no shutdown

! Manually assign a link-local address (optional — auto-generated if omitted)
Router(config-if)# ipv6 address FE80::1 link-local

! Enable SLAAC (auto-configuration) — just advertise the prefix
Router(config-if)# ipv6 address 2001:DB8:ACAD:2::/64 eui-64

! Verify
Router# show ipv6 interface brief
\`\`\`

---

## Transition Mechanisms

Since IPv4 and IPv6 will coexist for years, three main transition strategies exist:

### Dual-Stack
Devices run **both IPv4 and IPv6** simultaneously. This is the most common and recommended approach. Each interface has both an IPv4 and an IPv6 address.

### Tunneling
IPv6 packets are **encapsulated inside IPv4 packets** to traverse IPv4-only networks:
- **6to4** — automatic tunneling using 2002::/16 addresses
- **GRE tunnels** — manual configuration of tunnel endpoints
- **ISATAP** — Intra-Site Automatic Tunnel Addressing Protocol
- **Teredo** — tunnels IPv6 through NAT devices using UDP

### Translation (NAT64)
Translates between IPv6 and IPv4 addresses, allowing IPv6-only clients to reach IPv4-only servers (and vice versa). Uses DNS64 for name resolution.

---

## IPv6 Verification Commands

\`\`\`
! Show all IPv6 addresses on the router
Router# show ipv6 interface brief

! Show detailed IPv6 information for an interface
Router# show ipv6 interface GigabitEthernet0/0

! Ping an IPv6 address
Router# ping 2001:DB8::1

! Trace route to an IPv6 destination
Router# traceroute 2001:DB8:ACAD:2::1

! Show the IPv6 routing table
Router# show ipv6 route

! Show IPv6 neighbor cache (equivalent of ARP for IPv4)
Router# show ipv6 neighbors
\`\`\`

**Note:** In IPv6, the function of ARP is replaced by **ICMPv6 Neighbor Discovery Protocol (NDP)**, specifically **Neighbor Solicitation (NS)** and **Neighbor Advertisement (NA)** messages.`,
  },

  // ─── Lesson 7: TCP, UDP, ARP, DNS, ICMP ───────────────────────────────────
  7: {
    objectives: [
      "Compare the characteristics of TCP and UDP and identify when each is appropriate",
      "Describe the TCP three-way handshake and four-way connection termination",
      "Explain the ARP process and how a device resolves a known IP address to a MAC address",
      "Describe how DNS resolves domain names to IP addresses and identify common record types",
      "Explain the purpose and common message types of ICMP and ICMPv6",
    ],
    keyTerms: [
      {
        term: "TCP (Transmission Control Protocol)",
        definition:
          "A connection-oriented, reliable Layer 4 protocol that uses a three-way handshake, sequencing, acknowledgments, and flow control to ensure data is delivered accurately and in order.",
      },
      {
        term: "UDP (User Datagram Protocol)",
        definition:
          "A connectionless, unreliable Layer 4 protocol with no handshake or acknowledgments; it offers low overhead and is used for real-time applications like VoIP and streaming.",
      },
      {
        term: "ARP (Address Resolution Protocol)",
        definition:
          "A Layer 2/3 protocol that maps a known IPv4 address to a MAC address by broadcasting a request on the local network and receiving a unicast reply.",
      },
      {
        term: "DNS (Domain Name System)",
        definition:
          "A hierarchical naming system that translates human-readable domain names (e.g., www.cisco.com) into IP addresses that computers use to communicate.",
      },
      {
        term: "ICMP (Internet Control Message Protocol)",
        definition:
          "A Layer 3 protocol used for diagnostic and error-reporting functions, including ping (echo request/reply) and traceroute (time exceeded messages).",
      },
    ],
    content: `
![Diagram](/images/diagrams/tcp-handshake.svg)

## TCP (Transmission Control Protocol)

TCP is a **connection-oriented**, **reliable** transport protocol (Layer 4). Before data is exchanged, TCP establishes a connection using the **three-way handshake**. It guarantees that data arrives **complete, in order, and without errors**.

### TCP Header Key Fields

| Field                  | Description                                    |
|------------------------|------------------------------------------------|
| Source Port            | Ephemeral port (49152-65535) of the sender     |
| Destination Port       | Well-known or registered port of the service   |
| Sequence Number        | Order of the first byte of data in this segment|
| Acknowledgment Number  | Next expected byte from the other side         |
| Window Size            | Amount of data the receiver can accept (flow control) |
| Flags (SYN, ACK, FIN, RST) | Control connection setup and teardown     |
| Checksum               | Error detection                                |

### TCP Three-Way Handshake

The three-way handshake establishes a **full-duplex** connection:

\`\`\`
Client                              Server
  |                                    |
  |--- SYN (seq=100) --------------->  |  Step 1: Client initiates
  |                                    |
  |<-- SYN-ACK (seq=300, ack=101) --- |  Step 2: Server acknowledges
  |                                    |
  |--- ACK (ack=301) --------------->  |  Step 3: Client confirms
  |                                    |
  |===== Connection Established ======|
\`\`\`

1. **SYN** — Client sends a SYN segment with an initial sequence number.
2. **SYN-ACK** — Server responds with its own SYN and acknowledges the client's SYN.
3. **ACK** — Client acknowledges the server's SYN. Connection is now **ESTABLISHED**.

### TCP Connection Termination (Four-Way)

\`\`\`
Client                              Server
  |--- FIN -------------------------->  |  Step 1
  |<-- ACK ---------------------------  |  Step 2
  |<-- FIN ---------------------------  |  Step 3
  |--- ACK -------------------------->  |  Step 4
\`\`\`

Each side independently closes its half of the connection. A **TIME_WAIT** state (typically 2x Maximum Segment Lifetime) ensures all packets are received before fully closing.

### TCP Flow Control and Windowing

TCP uses a **sliding window** mechanism for flow control. The **window size** field tells the sender how much data the receiver can buffer. If the receiver's buffer fills, it advertises a window of 0, pausing the sender until buffer space is available.

### TCP Retransmission

If the sender does not receive an acknowledgment within the **retransmission timeout (RTO)**, it resends the unacknowledged segment. TCP also uses **fast retransmit** — if three duplicate ACKs are received, the segment is retransmitted immediately without waiting for the timeout.

---

## UDP (User Datagram Protocol)

UDP is a **connectionless**, **unreliable** transport protocol. It adds minimal overhead — just source port, destination port, length, and checksum. There is **no handshake, no sequencing, no acknowledgments, and no flow control**.

### When to Use UDP

UDP is ideal for applications where:
- **Speed matters more than reliability** (real-time voice/video)
- **Loss is tolerable** (streaming media)
- **The application handles its own reliability** (DNS, TFTP, DHCP, SNMP)
- **Small, simple transactions** (NTP, RADIUS)

### TCP vs. UDP Comparison

| Feature              | TCP                    | UDP                    |
|----------------------|------------------------|------------------------|
| Connection           | Connection-oriented    | Connectionless         |
| Reliability          | Guaranteed delivery    | Best-effort            |
| Ordering             | Sequenced              | No sequencing          |
| Flow Control         | Yes (windowing)        | No                     |
| Overhead             | Higher (20+ byte header)| Lower (8-byte header) |
| Speed                | Slower                 | Faster                 |
| Use Cases            | HTTP, FTP, SSH, SMTP   | DNS, VoIP, DHCP, SNMP  |

### Well-Known Port Numbers

| Port | Protocol | Service                    |
|------|----------|----------------------------|
| 20   | TCP      | FTP Data                   |
| 21   | TCP      | FTP Control                |
| 22   | TCP      | SSH                        |
| 23   | TCP      | Telnet                     |
| 25   | TCP      | SMTP (email sending)       |
| 53   | TCP/UDP  | DNS                        |
| 67   | UDP      | DHCP Server                |
| 68   | UDP      | DHCP Client                |
| 69   | UDP      | TFTP                       |
| 80   | TCP      | HTTP                       |
| 110  | TCP      | POP3                       |
| 143  | TCP      | IMAP                       |
| 161  | UDP      | SNMP                       |
| 443  | TCP      | HTTPS                      |
| 514  | UDP      | Syslog                     |

---

## ARP (Address Resolution Protocol)

When a device knows the **destination IP** but needs the **destination MAC address** (to build a Layer 2 frame), it uses **ARP**.

### ARP Process

1. **Host A** wants to send data to Host B (192.168.1.50) on the same LAN.
2. Host A checks its **ARP cache** — if Host B's MAC is already known, skip to step 5.
3. Host A sends an **ARP Request** — a **broadcast** frame (destination FF:FF:FF:FF:FF:FF) asking: "Who has 192.168.1.50? Tell 192.168.1.10."
4. **All devices** on the segment receive the broadcast, but only Host B responds.
5. Host B sends a **unicast ARP Reply**: "192.168.1.50 is at AA:BB:CC:11:22:33."
6. Host A stores this mapping in its **ARP cache** for future use.
7. Host A can now build the Ethernet frame with the correct destination MAC.

### ARP Types

| Type                | Description                                              |
|---------------------|----------------------------------------------------------|
| **ARP Request**     | Broadcast: "Who owns this IP?"                           |
| **ARP Reply**       | Unicast: "I own that IP; here is my MAC."                |
| **Gratuitous ARP**  | Unsolicited ARP reply, used for duplicate IP detection and updating ARP caches after a MAC change. |
| **Reverse ARP (RARP)** | Maps a MAC address to an IP (largely replaced by DHCP/BOOTP). |
| **Proxy ARP**       | A router answers ARP requests on behalf of another device on a different subnet. |

### ARP Verification

\`\`\`
! Windows — view ARP cache
arp -a

! Cisco IOS — view ARP cache
Router# show arp
Protocol  Address      Age (min)  Hardware Addr   Type   Interface
Internet  192.168.1.10       5   aabb.cc11.2233  ARPA   GigabitEthernet0/0
Internet  192.168.1.50       2   aabb.cc44.5566  ARPA   GigabitEthernet0/0

! Clear the ARP cache
Router# clear arp-cache
\`\`\`

---

## DNS (Domain Name System)

DNS translates **domain names** into **IP addresses** (and vice versa). Without DNS, you would need to memorize IP addresses for every website.

### DNS Resolution Process

1. You type \`www.cisco.com\` in your browser.
2. Your computer checks its **local DNS cache** — not found.
3. The request goes to the **recursive DNS resolver** (usually provided by your ISP or configured manually, e.g., 8.8.8.8).
4. If the resolver doesn't have the answer cached, it queries the **root DNS servers** (there are 13 root server clusters worldwide).
5. The root server directs the resolver to the **.com TLD (Top-Level Domain) servers**.
6. The TLD server directs the resolver to the **authoritative name server** for cisco.com.
7. The authoritative server returns the IP address: **72.163.4.161** (example).
8. The resolver caches the result and returns it to your computer.

### Common DNS Record Types

| Record | Purpose                                         | Example                              |
|--------|------------------------------------------------|--------------------------------------|
| **A**  | Maps hostname to IPv4 address                  | www.cisco.com → 72.163.4.161        |
| **AAAA** | Maps hostname to IPv6 address                | www.cisco.com → 2001:420:1101:1::a  |
| **CNAME** | Alias pointing to another hostname          | shop.cisco.com → www.cisco.com      |
| **MX** | Mail exchange server for a domain              | cisco.com → mail.cisco.com (priority 10) |
| **NS** | Authoritative name server for a domain         | cisco.com → ns1.cisco.com           |
| **PTR** | Reverse lookup (IP to hostname)               | 72.163.4.161 → www.cisco.com        |
| **SOA** | Start of Authority — zone information         | Primary NS, admin email, serial, timers |
| **TXT** | Arbitrary text data (SPF, DKIM, etc.)         | v=spf1 include:_spf.google.com ~all |

### DNS on Cisco Routers

\`\`\`
! Configure a DNS server
Router(config)# ip name-server 8.8.8.8
Router(config)# ip name-server 8.8.4.4

! Enable DNS lookups (enabled by default)
Router(config)# ip domain-lookup

! Set the default domain name
Router(config)# ip domain-name example.com

! Use a hostname in a ping or traceroute (requires DNS)
Router# ping www.cisco.com

! Show DNS cache
Router# show hosts
\`\`\`

---

## ICMP (Internet Control Message Protocol)

ICMP is a **Layer 3** protocol used for **diagnostics** and **error reporting**. It does not carry application data.

### Common ICMP Message Types

| Type | Code | Message                   | Purpose                                    |
|------|------|---------------------------|--------------------------------------------|
| 0    | 0    | Echo Reply                | Response to a ping request                 |
| 3    | 0-15 | Destination Unreachable   | Various: network/host/port unreachable, fragmentation needed |
| 5    | 0-3  | Redirect                  | Router tells host of a better path         |
| 8    | 0    | Echo Request              | Ping request                               |
| 11   | 0-1  | Time Exceeded             | TTL expired (used by traceroute)           |

### Ping

**Ping** sends ICMP Echo Request messages to a target and waits for Echo Replies. It measures **reachability** and **round-trip time (RTT)**.

\`\`\`
Router# ping 192.168.1.1
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 192.168.1.1, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms
\`\`\`

\`\`\`
! Ping with specific options
Router# ping
Protocol [ip]:
Target IP address: 192.168.1.1
Repeat count [5]: 10
Datagram size [100]: 1500
Timeout in seconds [2]:
Extended commands [n]: y
Source address or interface: 192.168.2.1
\`\`\`

- **!!!!** = all pings succeeded
- **.....** = all pings failed (timeout)
- **!.!.!** = intermittent success (connectivity issue)

### Traceroute

**Traceroute** discovers the path (list of routers) packets take to a destination. It works by sending packets with incrementally increasing **TTL** values. Each router decrements TTL by 1 and, when it reaches 0, sends back an ICMP **Time Exceeded** message.

\`\`\`
Router# traceroute 10.10.10.10
  1  192.168.1.1  4 msec  4 msec  4 msec
  2  10.0.0.1     8 msec  8 msec  8 msec
  3  10.10.10.10  12 msec 12 msec 12 msec
\`\`\`

### ICMPv6

IPv6 uses **ICMPv6**, which combines the functionality of ICMP, ARP, and IGMP into a single protocol. Key features:
- **Neighbor Discovery Protocol (NDP):** Replaces ARP. Uses Neighbor Solicitation (NS) and Neighbor Advertisement (NA) messages.
- **Router Solicitation (RS) / Router Advertisement (RA):** Used for SLAAC — routers advertise prefixes and hosts auto-configure addresses.
- **Echo Request/Reply:** Same as ICMP for ping.
- **Multicast Listener Discovery (MLD):** Replaces IGMP for managing multicast group membership.`,
  },

  // ─── Lesson 8: Cisco CLI Basics ────────────────────────────────────────────
  8: {
    objectives: [
      "Navigate between User EXEC, Privileged EXEC, and Global Configuration modes",
      "Use context-sensitive help (?) and command shortcuts effectively",
      "Configure basic device settings including hostname, passwords, and banners",
      "Use essential show commands to verify device status and configuration",
      "Save, erase, and manage the running and startup configurations",
    ],
    keyTerms: [
      {
        term: "User EXEC Mode",
        definition:
          "The initial CLI mode on a Cisco device (prompt: Router>), providing limited read-only commands such as ping, traceroute, and basic show commands.",
      },
      {
        term: "Privileged EXEC Mode",
        definition:
          "An elevated CLI mode (prompt: Router#) accessed with the enable command, providing full access to show commands, debug, and the ability to enter Global Configuration mode.",
      },
      {
        term: "Global Configuration Mode",
        definition:
          "The mode (prompt: Router(config)#) where you make changes that affect the entire device, such as setting the hostname, configuring routing protocols, and setting passwords.",
      },
      {
        term: "Running Configuration",
        definition:
          "The active configuration currently in RAM; changes made in configuration mode take effect immediately but are lost on reboot unless saved.",
      },
      {
        term: "Startup Configuration",
        definition:
          "The configuration stored in NVRAM that is loaded into the running configuration when the device boots; saved with the copy running-config startup-config command.",
      },
    ],
    content: `## Cisco IOS Command-Line Interface

The **Cisco IOS (Internetwork Operating System)** CLI is the primary interface for configuring and managing Cisco routers and switches. Mastering the CLI is essential for the CCNA exam and for real-world network administration.

---

## CLI Modes

Cisco IOS has a **hierarchical mode structure**. Each mode provides access to different commands:

### User EXEC Mode

\`\`\`
Router>
\`\`\`

This is the **default mode** after logging in. The prompt ends with **>**. In this mode, you can:
- View basic device information
- Use ping and traceroute
- Use a limited set of show commands
- **Cannot** make configuration changes

Enter Privileged EXEC mode by typing:
\`\`\`
Router> enable
Router#
\`\`\`

### Privileged EXEC Mode

\`\`\`
Router#
\`\`\`

The prompt ends with **#**. This mode gives you full access to:
- All show commands
- Debug commands
- Configuration modes
- File management (copy, erase)
- Reload (reboot) the device

Return to User EXEC mode:
\`\`\`
Router# disable
Router>
\`\`\`

### Global Configuration Mode

\`\`\`
Router# configure terminal
Router(config)#
\`\`\`

This is where you make **device-wide configuration changes**. Enter it from Privileged EXEC mode with \`configure terminal\` (or \`conf t\` for short).

### Sub-Modes of Global Configuration

From Global Configuration mode, you can enter various **sub-modes**:

| Sub-Mode                  | Command                              | Prompt                  |
|---------------------------|--------------------------------------|-------------------------|
| Interface Configuration   | \`interface GigabitEthernet0/0\`      | \`Router(config-if)#\`   |
| Line Configuration        | \`line console 0\`                    | \`Router(config-line)#\` |
| Router Configuration      | \`router ospf 1\`                     | \`Router(config-router)#\` |
| VLAN Configuration        | \`vlan 10\`                           | \`Router(config-vlan)#\` |

### Returning from Sub-Modes

- **exit** — returns to the previous (parent) mode
- **end** — returns directly to Privileged EXEC mode from any configuration level
- **Ctrl+Z** — same as **end**

\`\`\`
Router(config-if)# exit
Router(config)# exit
Router#

Router(config-if)# end
Router#
\`\`\`

---

## Context-Sensitive Help

Cisco IOS provides excellent built-in help using the **?** character:

### List All Available Commands
\`\`\`
Router> ?
\`\`\`

### List Commands Starting with "sh"
\`\`\`
Router# sh?
show
\`\`\`

### Show Available Options After a Command
\`\`\`
Router# show ?
  access-lists    List access lists
  arp             ARP table
  clock           Display the system clock
  cdp             CDP information
  interfaces      Interface status and configuration
  ip              IP information
  ipv6            IPv6 information
  mac-address-table  MAC address table
  running-config  Current operating configuration
  startup-config  Contents of startup configuration
  version         System hardware and software status
  vlan            VLAN information
  ...
\`\`\`

### Complete a Partial Command
\`\`\`
Router# show run<Tab>
Router# show running-config
\`\`\`

### Show Syntax for a Command
\`\`\`
Router# clock ?
  set  Set the time and date

Router# clock set ?
  hh:mm:ss  Current Time

Router# clock set 10:30:00 ?
  <1-31>  Day of the month
  MONTH   Month of the year

Router# clock set 10:30:00 15 January 2025
\`\`\`

---

## Command Shortcuts and Editing

| Shortcut       | Action                                    |
|----------------|-------------------------------------------|
| **Tab**        | Auto-complete a partial command           |
| **Ctrl+A**     | Move cursor to beginning of line          |
| **Ctrl+E**     | Move cursor to end of line                |
| **Ctrl+U**     | Delete entire line                        |
| **Ctrl+K**     | Delete from cursor to end of line         |
| **Ctrl+W**     | Delete the last word                      |
| **Ctrl+L**     | Redraw the line                           |
| **Up Arrow**   | Recall previous command                   |
| **Down Arrow** | Move to next command in history           |

---

## Basic Device Configuration

### Set the Hostname

\`\`\`
Router(config)# hostname SW1
SW1(config)#
\`\`\`

### Configure Passwords

\`\`\`
! Enable password (stored in plain text — avoid using)
Router(config)# enable password MyPassword

! Enable secret (stored as a strong hash — always prefer this)
Router(config)# enable secret MySecurePassword

! Console line password
Router(config)# line console 0
Router(config-line)# password ConsolePass
Router(config-line)# login

! VTY (Telnet/SSH) line password
Router(config)# line vty 0 4
Router(config-line)# password VTYPass
Router(config-line)# login
\`\`\`

### Encrypt Passwords

By default, the console and VTY passwords are stored in **plain text** in the configuration. Use this command to encrypt them:

\`\`\`
Router(config)# service password-encryption
\`\`\`

This uses a **Type 7** encryption (weak, easily reversible). The **enable secret** command uses **Type 5** (MD5) or **Type 8/9** (SHA-256/scrypt on newer IOS), which is much stronger.

### Configure a Banner (MOTD)

\`\`\`
Router(config)# banner motd #
Enter TEXT message. End with a '#'.
******************************************
*  Authorized access only!               *
*  All activity is monitored.            *
******************************************
#
\`\`\`

### Configure Interface IP Addresses

\`\`\`
Router(config)# interface GigabitEthernet0/0
Router(config-if)# ip address 192.168.1.1 255.255.255.0
Router(config-if)# description LAN Gateway
Router(config-if)# no shutdown
\`\`\`

The \`no shutdown\` command is critical — Cisco interfaces are **shutdown (disabled) by default** on routers.

### Configure a MOTD and Login Banner on Switches

Switches use the same banner and password commands. Remember that switches do **not** have routable interfaces by default (Layer 2 switches use **SVIs** — Switch Virtual Interfaces — for management).

\`\`\`
Switch(config)# interface vlan 1
Switch(config-if)# ip address 192.168.1.2 255.255.255.0
Switch(config-if)# no shutdown
Switch(config)# ip default-gateway 192.168.1.1
\`\`\`

---

## Essential Show Commands

### Device Information

\`\`\`
! IOS version and uptime
Router# show version
Cisco IOS Software, C2900 Software (C2900-UNIVERSALK9-M), Version 15.4(3)M
System image file is "flash:c2900-universalk9-mz.SPA.154-3.M.bin"
Router uptime is 2 weeks, 3 days, 4 hours, 22 minutes

! System clock
Router# show clock
10:30:00.000 UTC Mon Jan 15 2025

! Hardware inventory
Router# show inventory
\`\`\`

### Interface Information

\`\`\`
! Brief summary of all interfaces
Router# show ip interface brief
Interface              IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0     192.168.1.1     YES manual up                    up
GigabitEthernet0/1     10.0.0.1        YES manual up                    up
GigabitEthernet0/2     unassigned      YES unset  administratively down down

! Detailed information for one interface
Router# show interface GigabitEthernet0/0
GigabitEthernet0/0 is up, line protocol is up
  Hardware is CN Gigabit Ethernet, address is aabb.cc00.0100
  Internet address is 192.168.1.1/24
  MTU 1500 bytes, BW 1000000 Kbit/sec, DLY 10 usec
  ...

! Check for errors on interfaces
Router# show interfaces counters errors
\`\`\`

### Configuration

\`\`\`
! View the running configuration (active in RAM)
Router# show running-config

! View the startup configuration (stored in NVRAM, loaded on boot)
Router# show startup-config

! Show only specific sections
Router# show running-config | section interface
Router# show running-config | include ip address
Router# show running-config | begin line vty
\`\`\`

### Routing and ARP

\`\`\`
! View the IP routing table
Router# show ip route
Codes: C - connected, S - static, R - RIP, O - OSPF, ...
C    192.168.1.0/24 is directly connected, GigabitEthernet0/0
C    10.0.0.0/8 is directly connected, GigabitEthernet0/1

! View the ARP table
Router# show arp
Protocol  Address      Age  Hardware Addr   Type  Interface
Internet  192.168.1.10    5  aabb.cc11.2233  ARPA  Gig0/0
\`\`\`

### MAC Address Table (Switches)

\`\`\`
Switch# show mac address-table
          Mac Address Table
Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
   1    aabb.cc11.2233    DYNAMIC     Gi0/1
   1    aabb.cc44.5566    DYNAMIC     Gi0/2
\`\`\`

### CDP (Cisco Discovery Protocol)

\`\`\`
! Discover directly connected Cisco devices
Router# show cdp neighbors
Device ID    Local Intrfce   Holdtme    Capability   Platform   Port ID
SW1          Gi 0/1          148        S I          WS-C2960   Gi 0/1
R2           Gi 0/0          132        R            C2900      Gi 0/0

! Detailed CDP information
Router# show cdp neighbors detail

! Enable/disable CDP on an interface or globally
Router(config)# cdp run
Router(config)# no cdp run
Router(config-if)# cdp enable
Router(config-if)# no cdp enable
\`\`\`

---

## Saving and Managing Configurations

### Save Configuration

\`\`\`
! Save running config to startup config (NVRAM)
Router# copy running-config startup-config
Destination filename [startup-config]?
Building configuration...
[OK]

! Shortcut (IOS 12.x and later)
Router# write memory
\`\`\`

### Erase Configuration

\`\`\`
! Erase the startup configuration (factory reset)
Router# write erase
Erasing the nvram filesystem will remove all configuration files! Continue? [confirm]

! Reload the device to start with a clean config
Router# reload
System configuration has been modified. Save? [yes/no]: no
Proceed with reload? [confirm]
\`\`\`

### Backup Configuration to TFTP Server

\`\`\`
! Copy running config to a TFTP server
Router# copy running-config tftp
Address or name of remote host []? 192.168.1.100
Destination filename [Router-confg]? Router1-backup.cfg
!!
[OK - 1234 bytes]
\`\`\`

### Restore Configuration from TFTP

\`\`\`
Router# copy tftp running-config
Address or name of remote host []? 192.168.1.100
Source filename []? Router1-backup.cfg
Destination filename [running-config]?
Accessing tftp://192.168.1.100/Router1-backup.cfg...
Loading Router1-backup.cfg from 192.168.1.100 (via GigabitEthernet0/0): !
[OK - 1234 bytes]
1234 bytes copied in 0.560 secs
\`\`\`

---

## Securing Remote Access with SSH

Telnet sends data (including passwords) in **plain text**. Always use **SSH** for remote access:

\`\`\`
Router(config)# hostname R1
R1(config)# ip domain-name example.com
R1(config)# crypto key generate rsa general-keys modulus 2048
R1(config)# username admin privilege 15 secret AdminP@ss
R1(config)# line vty 0 4
R1(config-line)# login local
R1(config-line)# transport input ssh
R1(config-line)# exit
R1(config)# ip ssh version 2
R1(config)# ip ssh time-out 60
R1(config)# ip ssh authentication-retries 3
\`\`\`

Connect from another device:
\`\`\`
Router# ssh -l admin 192.168.1.1
Password:
R1#
\`\`\`

---

## Practice Lab: Basic Router Configuration

Complete this exercise to reinforce what you have learned:

\`\`\`
! 1. Enter Global Configuration mode
Router> enable
Router# configure terminal

! 2. Set hostname
Router(config)# hostname BranchR1

! 3. Set secure passwords
BranchR1(config)# enable secret Str0ngP@ss!
BranchR1(config)# line console 0
BranchR1(config-line)# password ConsoleP@ss
BranchR1(config-line)# login
BranchR1(config-line)# exit

! 4. Configure a banner
BranchR1(config)# banner motd # Authorized Users Only #

! 5. Configure an interface
BranchR1(config)# interface GigabitEthernet0/0
BranchR1(config-if)# description LAN Interface
BranchR1(config-if)# ip address 192.168.10.1 255.255.255.0
BranchR1(config-if)# no shutdown
BranchR1(config-if)# exit

! 6. Encrypt passwords
BranchR1(config)# service password-encryption

! 7. Save and verify
BranchR1(config)# end
BranchR1# copy running-config startup-config
BranchR1# show running-config
BranchR1# show ip interface brief
\`\`\`

This hands-on practice is essential. Use **Cisco Packet Tracer** or **GNS3** to build labs and reinforce these concepts. The CCNA exam tests both conceptual knowledge and practical CLI skills.`,
  },
};
