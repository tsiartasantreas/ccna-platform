export const module6Lessons: Record<number, { objectives: string[]; keyTerms: { term: string; definition: string }[]; content: string }> = {
  1: {
    objectives: [
      "Differentiate between the control plane and the data plane in traditional and SDN networking",
      "Explain the role of an SDN controller and how it centralizes network management",
      "Describe the three main SDN architectures: centralized, distributed, and hybrid",
      "Identify the benefits of SDN including programmability, automation, and scalability",
      "Understand how southbound and northbound APIs enable communication in SDN environments",
    ],
    keyTerms: [
      {
        term: "Control Plane",
        definition: "The part of the network responsible for making decisions about where traffic should be sent, including routing protocols like OSPF, EIGRP, and BGP that build routing tables.",
      },
      {
        term: "Data Plane (Forwarding Plane)",
        definition: "The part of the network responsible for actually moving packets based on the control plane decisions. It processes packets by looking up destination addresses in the routing or switching table and forwarding them out the appropriate interface.",
      },
      {
        term: "SDN Controller",
        definition: "A centralized software application that manages flow control in an SDN network. It communicates with network devices using southbound APIs and exposes network services to applications through northbound APIs.",
      },
      {
        term: "Southbound API",
        definition: "An API used by the SDN controller to communicate downward with network devices (switches, routers). Examples include OpenFlow, NETCONF, and SNMP.",
      },
      {
        term: "Northbound API",
        definition: "An API used by the SDN controller to communicate upward with applications and services. These APIs allow applications to interact with the network, such as REST APIs.",
      },
    ],
    content: `
![Diagram](/images/diagrams/sdn-architecture.svg)

## Understanding Software-Defined Networking (SDN)

Traditional networking tightly couples the **control plane** and the **data plane** within each individual network device. Every router and switch independently runs routing protocols, builds its own forwarding tables, and makes its own decisions about how to handle traffic. While this distributed approach has served networking well for decades, it creates significant challenges when managing large-scale networks — each device must be configured and managed individually.

**Software-Defined Networking (SDN)** fundamentally changes this model by separating (or "decoupling") the control plane from the data plane, creating a more flexible, programmable, and centrally manageable network architecture.

---

## The Traditional Networking Model

In a traditional network, each device operates autonomously:

- **Control Plane**: Runs routing protocols (OSPF, EIGRP, BGP), builds the routing table, and makes forwarding decisions. This is the "brain" of the device.
- **Data Plane (Forwarding Plane)**: Receives incoming packets, looks up the destination in the routing or switching table, and forwards the packet out the correct interface. This is the "muscle" of the device.

Both planes reside on the same physical device. A Cisco router running OSPF, for example, uses the control plane to learn routes via OSPF hello packets and link-state advertisements, then programs the data plane (the routing table and CEF table) with the best paths.

### Problems with the Traditional Model

| Challenge | Description |
|-----------|-------------|
| **Per-device configuration** | Each device must be configured individually using CLI or SNMP |
| **Inconsistency** | Human error can lead to configuration drift across hundreds of devices |
| **Slow provisioning** | Deploying a new service requires touching many devices manually |
| **Limited visibility** | Getting a holistic view of the network requires polling each device |
| **Vendor lock-in** | Proprietary operating systems and CLIs make multi-vendor management difficult |

---

## The SDN Architecture

SDN introduces a layered architecture that separates network intelligence from the physical infrastructure:

### Application Plane (Top Layer)
This is where network applications reside — things like monitoring tools, security policies, traffic engineering applications, and load balancers. These applications communicate with the SDN controller through **northbound APIs** (typically REST APIs).

### Control Plane (Middle Layer — SDN Controller)
The **SDN controller** is the centralized brain of the network. It has a global view of the entire network topology and makes decisions on behalf of all devices. Popular SDN controllers include:
- Cisco DNA Center (for enterprise)
- OpenDaylight (open source)
- Cisco ACI APIC (for data center)
- ONOS (Open Network Operating System)

### Infrastructure Plane (Bottom Layer — Network Devices)
The physical switches, routers, and access points that forward traffic based on instructions from the controller. These devices communicate with the controller through **southbound APIs**.

\`\`\`
+---------------------------+
|    Application Plane      |  ← Network Apps (Monitoring, Security, QoS)
+---------------------------+
|   Northbound APIs (REST)  |
+---------------------------+
|    Control Plane           |  ← SDN Controller (Centralized Brain)
|    (SDN Controller)        |
+---------------------------+
|   Southbound APIs          |  ← OpenFlow, NETCONF, SNMP
|   (OpenFlow, NETCONF)      |
+---------------------------+
|    Infrastructure Plane    |  ← Switches, Routers, Access Points
|    (Data Plane)            |
+---------------------------+
\`\`\`

---

## How the SDN Controller Works

The SDN controller performs several critical functions:

1. **Topology Discovery**: The controller discovers the entire network topology by communicating with all devices through southbound APIs. It maintains a real-time map of the network.

2. **Path Computation**: Instead of each device independently computing paths (as with OSPF or EIGRP), the controller calculates optimal paths centrally, considering the entire network state.

3. **Flow Programming**: The controller pushes forwarding rules (flow entries) down to network devices. These flow entries tell devices exactly how to handle specific types of traffic.

4. **Policy Enforcement**: Security policies, QoS rules, and access control are defined at the controller level and automatically distributed to all relevant devices.

5. **Monitoring and Analytics**: The controller collects telemetry data from all devices, providing centralized visibility into network health and performance.

---

## Southbound and Northbound APIs

### Southbound APIs (Controller to Devices)
These APIs enable the controller to communicate with the network infrastructure:

| API | Description | Use Case |
|-----|-------------|----------|
| **OpenFlow** | The original SDN protocol; defines how the controller programs flow tables in switches | Data center SDN, research networks |
| **NETCONF** | Network Configuration Protocol; uses XML-based data encoding for device configuration | Enterprise network configuration |
| **SNMP** | Simple Network Monitoring Protocol; traditionally used for monitoring and basic configuration | Legacy monitoring and management |
| **RESTCONF** | RESTful interface to NETCONF; uses HTTP methods with XML/JSON | Modern network automation |
| **gRPC** | Google Remote Procedure Call; high-performance RPC framework | High-frequency telemetry streaming |

### Northbound APIs (Controller to Applications)
These APIs allow applications to interact with the network:

- **REST APIs**: The most common northbound API, using HTTP methods (GET, POST, PUT, DELETE) with JSON or XML payloads
- **GraphQL**: An alternative to REST that allows applications to request exactly the data they need
- **Java/Python APIs**: SDKs that allow programmatic access to the controller

---

## SDN Deployment Models

### Open SDN
Uses open standards like OpenFlow. The controller is separate from the network devices, which act as simple forwarding engines. Example: OpenDaylight with OpenFlow switches.

### Cisco SDN (Intent-Based Networking)
Cisco's approach uses controllers like **DNA Center** that focus on intent-based networking. The administrator expresses the desired network intent (what they want the network to do), and the controller translates that intent into device configurations.

### Hybrid SDN
Combines traditional distributed routing protocols with SDN centralized control. Some traffic decisions are made by the devices themselves (using OSPF/BGP), while the SDN controller handles policy enforcement and traffic engineering.

---

## Benefits of SDN

1. **Centralized Management**: Configure and manage the entire network from a single point of control
2. **Automation**: Eliminate manual, repetitive configuration tasks across hundreds of devices
3. **Programmability**: Write scripts and applications that interact with the network programmatically
4. **Faster Provisioning**: Deploy new services in minutes rather than days or weeks
5. **Improved Visibility**: Real-time, holistic view of the entire network
6. **Vendor Independence**: Open standards reduce reliance on proprietary solutions
7. **Cost Reduction**: Use commodity hardware (white-box switches) with centralized intelligence

---

## Key Takeaways

- SDN separates the **control plane** from the **data plane**, centralizing network intelligence in an SDN controller
- The controller communicates down to devices via **southbound APIs** (OpenFlow, NETCONF) and up to applications via **northbound APIs** (REST)
- SDN enables **automation**, **programmability**, and **centralized management** of the entire network
- Cisco's approach focuses on **intent-based networking** where you describe what you want, not how to do it
- SDN is a foundational concept for understanding network automation and programmability in modern enterprise networks`,
  },

  2: {
    objectives: [
      "Explain the purpose and structure of REST APIs in network automation",
      "Describe the four primary HTTP methods (GET, POST, PUT, DELETE) and their use cases",
      "Interpret common HTTP response status codes (200, 201, 400, 401, 404, 500)",
      "Differentiate between JSON and XML data formats and their syntax",
      "Map CRUD operations to HTTP methods and understand their practical applications",
    ],
    keyTerms: [
      {
        term: "REST API (Representational State Transfer)",
        definition: "An architectural style for designing networked applications that uses HTTP methods to perform operations on resources. REST APIs are stateless, meaning each request from client to server must contain all information needed to understand and process the request.",
      },
      {
        term: "HTTP Methods",
        definition: "The set of request methods that indicate the desired action to be performed on a resource: GET (retrieve), POST (create), PUT (update/replace), PATCH (partial update), and DELETE (remove).",
      },
      {
        term: "JSON (JavaScript Object Notation)",
        definition: "A lightweight, human-readable data interchange format that uses key-value pairs and arrays. It is the most common format for REST API communication in modern network automation.",
      },
      {
        term: "CRUD",
        definition: "An acronym for the four basic operations performed on data: Create, Read, Update, and Delete. These map directly to HTTP methods POST, GET, PUT, and DELETE respectively.",
      },
      {
        term: "Status Code",
        definition: "A three-digit number returned by a server in response to an HTTP request, indicating whether the request was successful (2xx), redirected (3xx), client error (4xx), or server error (5xx).",
      },
    ],
    content: `
![Diagram](/images/diagrams/rest-api.svg)

## Introduction to REST APIs

An **API (Application Programming Interface)** is a set of rules and protocols that allows different software applications to communicate with each other. In the context of network automation, APIs allow scripts, applications, and management platforms to interact with network devices programmatically — without needing to log in and type CLI commands manually.

**REST (Representational State Transfer)** is the most widely used architectural style for APIs in network automation. REST APIs use standard HTTP methods to perform operations on network resources, making them easy to understand and use.

---

## Why REST APIs Matter for Networking

Traditionally, network engineers interact with devices through the CLI (Command Line Interface). While CLI is powerful, it has limitations for automation:

| CLI Approach | REST API Approach |
|-------------|-------------------|
| Manual, one device at a time | Programmatic, hundreds of devices at once |
| Text-based output, hard to parse | Structured data (JSON/XML), easy to parse |
| Requires SSH session per device | Single HTTP request can reach many devices |
| Human-readable but not machine-friendly | Machine-readable and automatable |
| Vendor-specific syntax | Standardized HTTP methods |

---

## HTTP Methods

REST APIs use HTTP methods to define what action should be performed on a resource. The four primary methods map directly to **CRUD** operations:

### GET — Read (Retrieve Data)
The GET method retrieves information from the server. It is safe (does not modify data) and idempotent (calling it multiple times gives the same result).

\`\`\`bash
# Retrieve interface status from a network device
curl -X GET "https://192.168.1.1/restconf/data/interfaces" \\
  -H "Accept: application/yang-data+json" \\
  -u admin:cisco123

# Retrieve VLAN information
curl -X GET "https://switch1.example.com/api/v1/vlans" \\
  -H "Accept: application/json"
\`\`\`

### POST — Create (Add New Data)
The POST method creates a new resource on the server. It is not idempotent — calling POST multiple times creates multiple resources.

\`\`\`bash
# Create a new VLAN
curl -X POST "https://switch1.example.com/api/v1/vlans" \\
  -H "Content-Type: application/json" \\
  -u admin:cisco123 \\
  -d '{
    "vlan_id": 100,
    "name": "Engineering",
    "state": "active"
  }'
\`\`\`

### PUT — Update (Replace Existing Data)
The PUT method replaces an existing resource entirely. It is idempotent — calling PUT multiple times with the same data produces the same result.

\`\`\`bash
# Update VLAN 100 configuration
curl -X PUT "https://switch1.example.com/api/v1/vlans/100" \\
  -H "Content-Type: application/json" \\
  -u admin:cisco123 \\
  -d '{
    "vlan_id": 100,
    "name": "Engineering-Updated",
    "state": "active"
  }'
\`\`\`

### DELETE — Delete (Remove Data)
The DELETE method removes a resource from the server. It is idempotent — deleting the same resource multiple times has the same effect.

\`\`\`bash
# Delete VLAN 100
curl -X DELETE "https://switch1.example.com/api/v1/vlans/100" \\
  -u admin:cisco123
\`\`\`

### PATCH — Partial Update
The PATCH method partially updates an existing resource (unlike PUT, which replaces it entirely).

\`\`\`bash
# Only change the VLAN name (partial update)
curl -X PATCH "https://switch1.example.com/api/v1/vlans/100" \\
  -H "Content-Type: application/json" \\
  -u admin:cisco123 \\
  -d '{
    "name": "Engineering-V2"
  }'
\`\`\`

---

## CRUD Operations Summary

| CRUD Operation | HTTP Method | Example Action | Idempotent? |
|---------------|-------------|----------------|-------------|
| **Create** | POST | Create a new VLAN | No |
| **Read** | GET | Get list of interfaces | Yes |
| **Update** | PUT / PATCH | Change IP address on interface | Yes |
| **Delete** | DELETE | Remove an ACL entry | Yes |

---

## HTTP Response Status Codes

When a client sends a request, the server responds with a **status code** indicating the result:

### 2xx — Success

| Code | Meaning | Description |
|------|---------|-------------|
| **200** | OK | Request succeeded; response contains requested data |
| **201** | Created | Resource was successfully created (response usually includes the new resource) |
| **204** | No Content | Request succeeded but no content to return (common with DELETE) |

### 4xx — Client Errors

| Code | Meaning | Description |
|------|---------|-------------|
| **400** | Bad Request | The request was malformed or missing required fields |
| **401** | Unauthorized | Authentication is required or credentials are invalid |
| **403** | Forbidden | Authenticated but not authorized to perform this action |
| **404** | Not Found | The requested resource does not exist |
| **405** | Method Not Allowed | The HTTP method is not supported for this resource |
| **409** | Conflict | The request conflicts with the current state (e.g., resource already exists) |

### 5xx — Server Errors

| Code | Meaning | Description |
|------|---------|-------------|
| **500** | Internal Server Error | The server encountered an unexpected error |
| **501** | Not Implemented | The server does not support the requested functionality |
| **503** | Service Unavailable | The server is temporarily overloaded or under maintenance |

\`\`\`
Example REST API Interaction:

Client (curl)                           Server (Network Device)
    |                                        |
    |--- POST /api/v1/vlans --------------->|
    |    Body: {"vlan_id":100,"name":"Eng"}  |
    |                                        |
    |<-- 201 Created ----------------------|
    |    Body: {"vlan_id":100,"name":"Eng",  |
    |            "status":"created"}         |
    |                                        |
    |--- GET /api/v1/vlans/100 ------------>|
    |                                        |
    |<-- 200 OK ---------------------------|
    |    Body: {"vlan_id":100,"name":"Eng"}  |
\`\`\`

---

## Data Formats: JSON vs XML

REST APIs typically use one of two data formats for request and response bodies:

### JSON (JavaScript Object Notation)

JSON is the most popular format for modern APIs. It is lightweight, easy to read, and natively supported by most programming languages.

\`\`\`json
{
  "interface": {
    "name": "GigabitEthernet0/1",
    "ip_address": "192.168.1.1",
    "subnet_mask": "255.255.255.0",
    "status": "up",
    "vlans": [10, 20, 30]
  }
}
\`\`\`

**JSON Key Rules:**
- Uses curly braces \`{}\` for objects
- Uses square brackets \`[]\` for arrays
- Keys and string values are in double quotes
- Numbers and booleans do not need quotes
- Key-value pairs are separated by commas

### XML (eXtensible Markup Language)

XML is an older format still used by many network APIs, especially NETCONF. It uses tags to define data structure.

\`\`\`xml
<interface>
  <name>GigabitEthernet0/1</name>
  <ip_address>192.168.1.1</ip_address>
  <subnet_mask>255.255.255.0</subnet_mask>
  <status>up</status>
  <vlans>
    <vlan>10</vlan>
    <vlan>20</vlan>
    <vlan>30</vlan>
  </vlans>
</interface>
\`\`\`

### JSON vs XML Comparison

| Feature | JSON | XML |
|---------|------|-----|
| **Readability** | Very easy to read | More verbose |
| **Size** | Smaller, less overhead | Larger due to closing tags |
| **Parsing** | Native JavaScript support | Requires XML parser |
| **Use in networking** | REST APIs, RESTCONF | NETCONF, SOAP APIs |
| **Data types** | String, number, boolean, null, array, object | All text (types defined by schema) |

---

## Anatomy of a REST API Request

A complete REST API request includes several components:

\`\`\`
POST /api/v1/vlans HTTP/1.1
Host: switch1.example.com
Authorization: Basic YWRtaW46Y2lzY28xMjM=
Content-Type: application/json
Accept: application/json

{
  "vlan_id": 200,
  "name": "Finance",
  "state": "active"
}
\`\`\`

| Component | Description |
|-----------|-------------|
| **Method** | POST — what action to perform |
| **URL/Endpoint** | /api/v1/vlans — the resource path |
| **Host** | The server address |
| **Headers** | Authorization, Content-Type, Accept |
| **Body** | The data payload (JSON in this case) |

---

## Practical Example: Using Python with REST APIs

\`\`\`python
import requests
import json

# Disable SSL warnings for lab environments
import urllib3
urllib3.disable_warnings()

base_url = "https://192.168.1.1/restconf/data"
headers = {
    "Accept": "application/yang-data+json",
    "Content-Type": "application/yang-data+json"
}
auth = ("admin", "cisco123")

# GET - Retrieve interface information
response = requests.get(
    f"{base_url}/ietf-interfaces:interfaces",
    headers=headers,
    auth=auth,
    verify=False
)
print(f"Status: {response.status_code}")
print(json.dumps(response.json(), indent=2))

# POST - Create a new loopback interface
new_interface = {
    "ietf-interfaces:interface": {
        "name": "Loopback100",
        "type": "iana-if-type:softwareLoopback",
        "enabled": True,
        "ietf-ip:ipv4": {
            "address": [
                {
                    "ip": "10.100.100.1",
                    "netmask": "255.255.255.255"
                }
            ]
        }
    }
}

response = requests.post(
    f"{base_url}/ietf-interfaces:interfaces",
    headers=headers,
    auth=auth,
    json=new_interface,
    verify=False
)
print(f"Create Status: {response.status_code}")  # Expect 201
\`\`\`

---

## Key Takeaways

- REST APIs use standard **HTTP methods** (GET, POST, PUT, DELETE) to perform **CRUD** operations on network resources
- **Status codes** (200, 201, 400, 404, 500) tell you whether a request succeeded or failed and why
- **JSON** is the most common data format for modern network APIs; **XML** is used by NETCONF
- REST APIs are **stateless** — each request must contain all authentication and context information
- Understanding REST APIs is essential for working with Cisco DNA Center, RESTCONF, and virtually all modern network management platforms`,
  },

  3: {
    objectives: [
      "Explain the purpose of configuration management tools in network automation",
      "Differentiate between agent-based and agentless configuration management approaches",
      "Describe the core concepts and workflows of Ansible, Puppet, and Chef",
      "Understand the role of playbooks, manifests, and recipes in automation",
      "Identify which configuration management tool is best suited for different network scenarios",
    ],
    keyTerms: [
      {
        term: "Configuration Management",
        definition: "The practice of maintaining and controlling the configuration of network devices and servers in a consistent, desired state using automated tools, reducing manual configuration errors and enabling scalability.",
      },
      {
        term: "Agentless",
        definition: "A configuration management approach where the managed device does not require any special software (agent) to be installed. The management server connects to devices using existing protocols like SSH or NETCONF. Ansible is an example of an agentless tool.",
      },
      {
        term: "Agent-Based",
        definition: "A configuration management approach where a small software agent is installed on each managed device. The agent pulls configuration from the management server and applies it locally. Puppet and Chef use this model.",
      },
      {
        term: "Playbook",
        definition: "An Ansible configuration file written in YAML that defines a series of tasks to be executed on managed devices. Playbooks describe the desired state of the network and the steps to achieve it.",
      },
      {
        term: "Idempotency",
        definition: "The property of an operation where running it multiple times produces the same result as running it once. Configuration management tools are idempotent — applying the same configuration twice does not cause errors or duplicate entries.",
      },
    ],
    content: `## Introduction to Configuration Management

**Configuration management** is the practice of using automated tools to maintain network devices in a consistent, desired state. Instead of manually logging into each device and typing configuration commands, configuration management tools allow you to define the desired state of your network in code and automatically apply it to hundreds or thousands of devices.

This approach is sometimes called **Infrastructure as Code (IaC)** — your network configurations are stored in version-controlled files, just like software source code.

---

## Why Configuration Management Matters

Consider a network with 500 switches that all need a new VLAN, an updated ACL, and a changed SNMP community string. Without automation:

| Manual Approach | Automated Approach |
|----------------|---------------------|
| SSH into each device one by one | Define change once in a configuration file |
| Type commands manually on each device | Apply change to all 500 devices simultaneously |
| Takes hours or days | Takes minutes |
| High risk of human error | Consistent, repeatable results |
| No audit trail | Changes tracked in version control (Git) |
| Difficult to rollback | Easy to revert to previous configuration |

---

## Agentless vs. Agent-Based Approaches

### Agentless Approach

In the **agentless** model, no special software needs to be installed on the managed network devices. The automation server connects to devices using existing protocols:

- **SSH** — The most common method for CLI-based automation
- **NETCONF/RESTCONF** — For programmatic, model-driven configuration
- **SNMP** — For monitoring and basic configuration

**Advantages:**
- No software to install or maintain on network devices
- Works with existing device infrastructure
- Lower overhead on managed devices
- Easier to get started

**Disadvantages:**
- Requires network connectivity to each device for every operation
- May be slower for large-scale operations (sequential SSH connections)
- Limited to what the device's CLI/API supports

**Example Tools:** Ansible, Salt

### Agent-Based Approach

In the **agent-based** model, a small software application (agent) is installed on each managed device. The agent:

1. Periodically contacts the management server (pull model)
2. Downloads the latest configuration
3. Compares it to the current device state
4. Applies any necessary changes automatically

**Advantages:**
- Devices can self-heal if configuration is changed manually
- Continuous enforcement of desired state
- Can work in environments with intermittent connectivity
- More granular control over device state

**Disadvantages:**
- Requires installing and maintaining agents on every device
- Agent compatibility may be limited on some network devices
- Additional resource overhead on managed devices
- More complex initial setup

**Example Tools:** Puppet, Chef

---

## Ansible

**Ansible** is the most popular configuration management tool for network automation. It is **agentless**, using SSH and Python to connect to and configure devices.

### Key Concepts

| Concept | Description |
|---------|-------------|
| **Control Node** | The server where Ansible is installed; runs playbooks |
| **Managed Nodes** | The network devices being configured |
| **Inventory** | A file listing all managed devices and their grouping |
| **Playbook** | A YAML file defining tasks to execute on devices |
| **Module** | A reusable unit of code that performs a specific task |
| **Role** | A packaged collection of playbooks, templates, and variables |
| **Facts** | Information gathered about managed devices (hostname, OS, interfaces) |

### Ansible Workflow

\`\`\`
1. Define Inventory (list of devices)
       ↓
2. Write Playbook (YAML file with tasks)
       ↓
3. Run Playbook (ansible-playbook command)
       ↓
4. Ansible connects via SSH to each device
       ↓
5. Executes modules (commands) on devices
       ↓
6. Returns results to the control node
\`\`\`

### Ansible Inventory File

\`\`\`ini
# inventory.ini
[switches]
switch1 ansible_host=192.168.1.10
switch2 ansible_host=192.168.1.11
switch3 ansible_host=192.168.1.12

[routers]
router1 ansible_host=10.0.0.1
router2 ansible_host=10.0.0.2

[cisco:children]
switches
routers

[cisco:vars]
ansible_network_os=cisco.ios.ios
ansible_user=admin
ansible_password=cisco123
ansible_connection=network_cli
\`\`\`

### Ansible Playbook Example

\`\`\`yaml
# configure_vlans.yml
---
- name: Configure VLANs on Cisco Switches
  hosts: switches
  gather_facts: no
  connection: network_cli

  tasks:
    - name: Create VLAN 100 - Engineering
      cisco.ios.ios_vlans:
        config:
          - vlan_id: 100
            name: Engineering
            state: active
        state: merged

    - name: Create VLAN 200 - Finance
      cisco.ios.ios_vlans:
        config:
          - vlan_id: 200
            name: Finance
            state: active
        state: merged

    - name: Configure access port
      cisco.ios.ios_interfaces:
        config:
          - name: GigabitEthernet0/1
            description: "Connected to Engineering PC"
            enabled: true
        state: merged

    - name: Save configuration
      cisco.ios.ios_config:
        save_when: always
\`\`\`

### Running Ansible Playbooks

\`\`\`bash
# Run a playbook against all devices in inventory
ansible-playbook -i inventory.ini configure_vlans.yml

# Run against a specific group
ansible-playbook -i inventory.ini configure_vlans.yml --limit switches

# Dry run (check mode) - shows what would change without applying
ansible-playbook -i inventory.ini configure_vlans.yml --check

# Verbose output for debugging
ansible-playbook -i inventory.ini configure_vlans.yml -vvv
\`\`\`

---

## Puppet

**Puppet** is an agent-based configuration management tool. It uses a **declarative** language to describe the desired state of devices.

### Key Concepts

| Concept | Description |
|---------|-------------|
| **Puppet Master** | The central server that stores configurations (manifests) |
| **Puppet Agent** | Software installed on managed devices that pulls configurations |
| **Manifest** | A configuration file (.pp) written in Puppet's DSL |
| **Module** | A collection of manifests, templates, and files for a specific purpose |
| **Catalog** | A compiled version of the manifest that the agent applies |
| **Facter** | A tool that gathers system information (facts) about managed nodes |

### Puppet Workflow

\`\`\`
1. Administrator writes Manifests on Puppet Master
       ↓
2. Puppet Agent on device contacts Master (every 30 min by default)
       ↓
3. Agent sends Facts (device information) to Master
       ↓
4. Master compiles Catalog from Manifests + Facts
       ↓
5. Agent receives Catalog and applies changes
       ↓
6. Agent reports status back to Master
\`\`\`

### Puppet Manifest Example

\`\`\`puppet
# vlan_config.pp
node 'switch1.example.com' {
  network_vlan { '100':
    ensure => present,
    name   => 'Engineering',
    state  => 'active',
  }

  network_vlan { '200':
    ensure => present,
    name   => 'Finance',
    state  => 'active',
  }

  network_interface { 'GigabitEthernet0/1':
    ensure      => present,
    description => 'Engineering Workstation',
    mode        => 'access',
    access_vlan => 100,
  }
}
\`\`\`

**Note:** Puppet for network devices often uses a **proxy agent** model — a proxy server runs the agent on behalf of network devices, since you typically cannot install Puppet agents directly on Cisco switches and routers.

---

## Chef

**Chef** uses a **Ruby-based DSL** (Domain Specific Language) and follows an imperative approach — you describe *how* to achieve the desired state, not just *what* the desired state should be.

### Key Concepts

| Concept | Description |
|---------|-------------|
| **Chef Server** | Central repository for cookbooks, policies, and node data |
| **Chef Client (Node)** | Agent installed on managed devices |
| **Cookbook** | A collection of recipes and related files for configuring a service or application |
| **Recipe** | The smallest unit of configuration in Chef; written in Ruby |
| **Ohai** | A tool that collects system configuration data (similar to Puppet's Facter) |
| **Knife** | A CLI tool for interacting with the Chef Server |

### Chef Workflow

\`\`\`
1. Administrator writes Cookbooks/Recipes on Chef Workstation
       ↓
2. Upload Cookbooks to Chef Server (using knife)
       ↓
3. Chef Client on node contacts Server (every 30 min)
       ↓
4. Client downloads relevant Cookbooks
       ↓
5. Client applies Recipes to configure the node
       ↓
6. Client reports status back to Server
\`\`\`

### Chef Recipe Example

\`\`\`ruby
# configure_vlan.rb
network_vlan '100' do
  vlan_name 'Engineering'
  action :create
end

network_vlan '200' do
  vlan_name 'Finance'
  action :create
end

network_interface 'GigabitEthernet0/1' do
  description 'Engineering Workstation'
  mode 'access'
  access_vlan 100
  action :configure
end
\`\`\`

---

## Comparison: Ansible vs. Puppet vs. Chef

| Feature | Ansible | Puppet | Chef |
|---------|---------|--------|------|
| **Architecture** | Agentless | Agent-based | Agent-based |
| **Language** | YAML (Playbooks) | Puppet DSL (Manifests) | Ruby DSL (Recipes) |
| **Approach** | Procedural (imperative) | Declarative | Imperative |
| **Learning Curve** | Easiest | Moderate | Steepest |
| **Agent Required?** | No (uses SSH) | Yes (or proxy agent) | Yes |
| **Pull/Push** | Push (primarily) | Pull | Pull |
| **Best For** | Network devices, quick automation | Server infrastructure | Complex server environments |
| **Network Device Support** | Excellent (built-in modules) | Good (with proxy) | Limited |

---

## Choosing the Right Tool for Networking

For CCNA-level network automation, **Ansible** is generally the recommended choice because:

1. **Agentless** — Works with existing SSH/NETCONF on network devices
2. **Easy to learn** — YAML playbooks are human-readable
3. **Network-specific modules** — Cisco provides official Ansible modules for IOS, NX-OS, IOS-XR
4. **Large community** — Extensive documentation and community support
5. **Push model** — Changes are applied immediately when you run the playbook

Puppet and Chef are more commonly used in server/data center environments where agents can be installed on the managed systems.

---

## Key Takeaways

- Configuration management tools automate the process of maintaining devices in a **desired state**
- **Agentless** tools (Ansible) connect via SSH/NETCONF; **agent-based** tools (Puppet, Chef) require software on each device
- **Ansible** is the most popular choice for network automation due to its agentless architecture and YAML-based playbooks
- All configuration management tools are **idempotent** — running them multiple times produces the same result
- Understanding these tools prepares you for working with Cisco DNA Center and modern network automation platforms`,
  },

  4: {
    objectives: [
      "Explain the concept of intent-based networking and how Cisco DNA Center implements it",
      "Describe the NETCONF protocol and its use of YANG data models for network configuration",
      "Differentiate between NETCONF and RESTCONF and identify appropriate use cases for each",
      "Understand the YANG data modeling language and how it defines network configuration and state",
      "Demonstrate practical knowledge of Cisco DNA Center's automation and programmability features",
    ],
    keyTerms: [
      {
        term: "Intent-Based Networking (IBN)",
        definition: "A networking approach where the administrator defines the desired business intent (what the network should do), and an automation platform translates that intent into network configurations, continuously verifying that the network is operating as intended.",
      },
      {
        term: "NETCONF",
        definition: "Network Configuration Protocol — an IETF standard protocol (RFC 6241) that provides mechanisms to install, manipulate, and delete the configuration of network devices. It uses XML for data encoding and typically runs over SSH (port 830).",
      },
      {
        term: "RESTCONF",
        definition: "A RESTful protocol (RFC 8040) that provides a programmatic interface for accessing YANG data models using HTTP methods. It is essentially a REST API wrapper around NETCONF capabilities, using JSON or XML over HTTP/HTTPS.",
      },
      {
        term: "YANG",
        definition: "Yet Another Next Generation — a data modeling language (RFC 7950) used to define the configuration and state data of network devices. YANG models define what configuration parameters are available and their structure, data types, and constraints.",
      },
      {
        term: "Cisco DNA Center",
        definition: "Cisco's intent-based networking platform that provides centralized management, automation, assurance, and programmability for enterprise networks. It serves as the SDN controller for campus and branch networks.",
      },
    ],
    content: `## Intent-Based Networking

Traditional networking requires administrators to manually configure each device, translate business requirements into CLI commands, and constantly monitor the network to ensure it operates correctly. **Intent-Based Networking (IBN)** transforms this approach by allowing administrators to express *what* they want the network to do, rather than *how* to configure it.

### The IBN Lifecycle

Intent-based networking follows a continuous four-stage lifecycle:

\`\`\`
+------------------+     +------------------+     +------------------+     +------------------+
|      TRANSLATE   | --> |       ACT        | --> |      VERIFY      | --> |     OBSERVE      |
|                  |     |                  |     |                  |     |                  |
| Define business  |     | Automatically    |     | Continuously     |     | Collect telemetry|
| intent in plain  |     | configure network|     | check that the   |     | and analytics to |
| language         |     | devices to match |     | network matches  |     | detect issues    |
|                  |     | the intent       |     | the intent       |     | and anomalies    |
+------------------+     +------------------+     +------------------+     +------------------+
         ^                                                                               |
         |_______________________________________________________________________________|
                                         Feedback Loop
\`\`\`

1. **Translate**: The administrator defines the desired outcome in business terms (e.g., "Prioritize voice traffic on all floors" or "Isolate guest traffic from corporate network")
2. **Act**: The platform automatically generates and deploys the necessary configurations to all relevant devices
3. **Verify**: The platform continuously checks that the network is actually operating according to the defined intent
4. **Observe**: Telemetry data is collected and analyzed to detect anomalies, predict failures, and suggest optimizations

---

## Cisco DNA Center

**Cisco DNA Center** is Cisco's enterprise intent-based networking platform. It serves as the centralized management, automation, and assurance platform for campus and branch networks.

### Key Capabilities

| Capability | Description |
|-----------|-------------|
| **Automation** | Zero-touch provisioning, automated configuration, software image management |
| **Assurance** | Proactive monitoring, issue detection, root cause analysis, guided remediation |
| **Analytics** | Network telemetry, application experience metrics, client analytics |
| **Security** | Software-Defined Access (SD-Access), micro-segmentation, group-based policies |
| **Programmability** | REST APIs, SDKs, integration with third-party tools |

### DNA Center as an SDN Controller

DNA Center acts as the SDN controller for the campus network:

- Uses **southbound APIs** (NETCONF, SNMP, CLI) to communicate with network devices
- Exposes **northbound APIs** (REST) for integration with external applications and automation tools
- Maintains a real-time inventory and topology map of the entire network
- Translates intent into device-specific configurations

### DNA Center Automation Features

**Zero-Touch Provisioning (ZTP):**
New devices automatically receive their configuration when connected to the network, eliminating manual setup.

**Software Image Management (SWIM):**
Centralized management of device firmware upgrades — schedule upgrades, verify compatibility, and roll back if needed.

**Configuration Templates:**
Reusable configuration templates with variables that can be applied to groups of devices.

---

## NETCONF Protocol

**NETCONF (Network Configuration Protocol)** is an IETF standard protocol defined in RFC 6241. It provides a programmatic mechanism to install, manipulate, and delete the configuration of network devices.

### NETCONF Architecture

NETCONF operates in layers:

\`\`\`
+------------------------------------------+
|            Content Layer                  |  ← YANG data models (config & state)
+------------------------------------------+
|            Operations Layer               |  ← <get>, <get-config>, <edit-config>,
|                                            |    <delete-config>, <copy-config>
+------------------------------------------+
|            Messages Layer                  |  ← RPC messages, notifications
+------------------------------------------+
|            Transport Layer                 |  ← SSH (default), TLS, BEEP
+------------------------------------------+
\`\`\`

### NETCONF Operations

| Operation | Description |
|-----------|-------------|
| **get** | Retrieves both configuration and state/operational data |
| **get-config** | Retrieves only configuration data from a specified datastore |
| **edit-config** | Loads or modifies configuration data in a specified datastore |
| **delete-config** | Deletes a configuration datastore (except running) |
| **copy-config** | Copies one datastore to another (e.g., startup to running) |
| **lock** | Locks a device configuration datastore to prevent conflicts |
| **unlock** | Unlocks a previously locked datastore |
| **close-session** | Gracefully terminates the NETCONF session |
| **kill-session** | Forcefully terminates another NETCONF session |

### NETCONF Datastores

| Datastore | Description |
|-----------|-------------|
| **running** | The current active configuration of the device |
| **candidate** | A staging area for configuration changes (must be committed to become running) |
| **startup** | The configuration loaded when the device boots |

### NETCONF Communication Example

NETCONF uses XML-formatted messages sent over SSH. Here is an example interaction:

\`\`\`xml
<!-- Client sends: Get device configuration -->
<?xml version="1.0" encoding="UTF-8"?>
<rpc xmlns="urn:ietf:params:xml:ns:netconf:base:1.0" message-id="1">
  <get-config>
    <source>
      <running/>
    </source>
    <filter type="subtree">
      <interfaces xmlns="urn:ietf:params:xml:ns:yang:ietf-interfaces">
        <interface>
          <name>GigabitEthernet0/0</name>
        </interface>
      </interfaces>
    </filter>
  </get-config>
</rpc>

<!-- Server responds with: Configuration data -->
<?xml version="1.0" encoding="UTF-8"?>
<rpc-reply xmlns="urn:ietf:params:xml:ns:netconf:base:1.0" message-id="1">
  <data>
    <interfaces xmlns="urn:ietf:params:xml:ns:yang:ietf-interfaces">
      <interface>
        <name>GigabitEthernet0/0</name>
        <type>iana-if-type:ethernetCsmacd</type>
        <enabled>true</enabled>
        <ipv4 xmlns="urn:ietf:params:xml:ns:yang:ietf-ip">
          <address>
            <ip>192.168.1.1</ip>
            <netmask>255.255.255.0</netmask>
          </address>
        </ipv4>
      </interface>
    </interfaces>
  </data>
</rpc-reply>
\`\`\`

### Enabling NETCONF on Cisco IOS-XE

\`\`\`
! Enable NETCONF on a Cisco IOS-XE device
Router(config)# netconf-yang

! Verify NETCONF is running
Router# show netconf-yang sessions

! The default NETCONF port is 830 over SSH
! You can test connectivity using an SSH client:
! ssh -p 830 admin@192.168.1.1 -s netconf
\`\`\`

---

## RESTCONF Protocol

**RESTCONF** (RFC 8040) provides a RESTful HTTP interface to YANG data models. It is essentially a REST API wrapper around NETCONF's capabilities, making it easier to interact with network devices using standard HTTP tools.

### RESTCONF vs. NETCONF

| Feature | NETCONF | RESTCONF |
|---------|---------|----------|
| **Transport** | SSH (port 830) | HTTP/HTTPS (port 443/80) |
| **Data Format** | XML only | XML or JSON |
| **Interface Style** | RPC-based (XML messages) | RESTful (HTTP methods) |
| **Datastore Access** | Full (running, candidate, startup) | Typically running datastore |
| **Operations** | get, edit-config, lock, unlock, etc. | GET, POST, PUT, PATCH, DELETE |
| **Complexity** | More complex | Simpler, more widely understood |
| **Best For** | Complex, multi-step configurations | Simple CRUD operations, integration with web apps |

### RESTCONF API Structure

RESTCONF URLs follow a predictable structure based on YANG models:

\`\`\`
https://<device>/restconf/data/<yang-module>:<container>/<list>/<key>
\`\`\`

### RESTCONF Examples

\`\`\`bash
# GET - Retrieve interface information
curl -X GET \\
  "https://192.168.1.1/restconf/data/ietf-interfaces:interfaces" \\
  -H "Accept: application/yang-data+json" \\
  -u admin:cisco123 \\
  -k

# POST - Create a new loopback interface
curl -X POST \\
  "https://192.168.1.1/restconf/data/ietf-interfaces:interfaces" \\
  -H "Content-Type: application/yang-data+json" \\
  -u admin:cisco123 \\
  -k \\
  -d '{
    "ietf-interfaces:interface": {
      "name": "Loopback100",
      "type": "iana-if-type:softwareLoopback",
      "enabled": true,
      "ietf-ip:ipv4": {
        "address": [{
          "ip": "10.100.100.1",
          "netmask": "255.255.255.255"
        }]
      }
    }
  }'

# PUT - Replace interface configuration
curl -X PUT \\
  "https://192.168.1.1/restconf/data/ietf-interfaces:interfaces/interface=Loopback100" \\
  -H "Content-Type: application/yang-data+json" \\
  -u admin:cisco123 \\
  -k \\
  -d '{
    "ietf-interfaces:interface": {
      "name": "Loopback100",
      "type": "iana-if-type:softwareLoopback",
      "enabled": false
    }
  }'

# DELETE - Remove an interface
curl -X DELETE \\
  "https://192.168.1.1/restconf/data/ietf-interfaces:interfaces/interface=Loopback100" \\
  -u admin:cisco123 \\
  -k
\`\`\`

### Enabling RESTCONF on Cisco IOS-XE

\`\`\`
! Enable RESTCONF on a Cisco IOS-XE device
Router(config)# restconf

! Ensure HTTP server is enabled with HTTPS
Router(config)# ip http server
Router(config)# ip http secure-server

! Verify RESTCONF is running
Router# show restconf
\`\`\`

---

## YANG Data Models

**YANG (Yet Another Next Generation)** is a data modeling language (RFC 7950) used to define the configuration and state data that network devices expose through NETCONF and RESTCONF.

### Why YANG Matters

YANG provides a standardized way to describe what configuration options a device supports. Instead of each vendor having proprietary MIBs (for SNMP) or undocumented CLI syntax, YANG models provide a formal, machine-readable description of the device's capabilities.

### YANG Model Types

| Type | Description |
|------|-------------|
| **Configuration data** | Parameters that can be changed (IP addresses, VLANs, ACLs) |
| **State data** | Read-only operational information (interface counters, CPU usage) |
| **RPCs** | Operations that can be invoked (ping, traceroute, reset) |
| **Notifications** | Events the device can send (link down, configuration change) |

### YANG Model Example

\`\`\`yang
// Simplified YANG model for an interface
module ietf-interfaces {
  namespace "urn:ietf:params:xml:ns:yang:ietf-interfaces";
  prefix if;

  container interfaces {
    list interface {
      key "name";

      leaf name {
        type string;
        description "Interface name";
      }

      leaf type {
        type identityref {
          base interface-type;
        }
        description "Interface type (e.g., ethernet, loopback)";
      }

      leaf enabled {
        type boolean;
        default "true";
        description "Whether the interface is enabled";
      }

      leaf description {
        type string;
        description "Interface description";
      }
    }
  }
}
\`\`\`

### Common YANG Models

| Model | Description |
|-------|-------------|
| **ietf-interfaces** | Interface configuration and state (RFC 8343) |
| **ietf-ip** | IP address configuration (RFC 8344) |
| **ietf-routing** | Routing configuration (RFC 8349) |
| **openconfig-interfaces** | OpenConfig model for interfaces (vendor-neutral) |
| **Cisco-IOS-XE-native** | Cisco IOS-XE specific configuration model |

### Using YANG with Python

\`\`\`python
from ncclient import manager
import xml.etree.ElementTree as ET

# Connect to device via NETCONF
with manager.connect(
    host="192.168.1.1",
    port=830,
    username="admin",
    password="cisco123",
    hostkey_verify=False
) as m:
    # Get interface configuration using YANG filter
    interface_filter = '''
        <interfaces xmlns="urn:ietf:params:xml:ns:yang:ietf-interfaces">
            <interface>
                <name>GigabitEthernet0/0</name>
            </interface>
        </interfaces>
    '''

    result = m.get_config(source="running", filter=("subtree", interface_filter))
    print(result)

    # Edit configuration
    config = '''
        <config>
            <interfaces xmlns="urn:ietf:params:xml:ns:yang:ietf-interfaces">
                <interface>
                    <name>Loopback100</name>
                    <type xmlns:iana="urn:ietf:params:xml:ns:yang:iana-if-type">
                        iana:softwareLoopback
                    </type>
                    <enabled>true</enabled>
                </interface>
            </interfaces>
        </config>
    '''

    result = m.edit_config(target="running", config=config)
    print(f"Edit result: {result}")
\`\`\`

---

## Putting It All Together

The following diagram shows how these technologies work together in a modern Cisco enterprise network:

\`\`\`
+----------------------------------------------------------+
|                   Cisco DNA Center                        |
|              (Intent-Based Networking Platform)           |
|                                                          |
|  +------------+  +------------+  +------------+          |
|  | Automation |  | Assurance  |  | Analytics  |          |
|  +------------+  +------------+  +------------+          |
|                                                          |
|           Northbound REST APIs (JSON)                    |
|                      ↕                                   |
|              SDN Controller Engine                        |
|                      ↕                                   |
|         Southbound: NETCONF / RESTCONF / CLI             |
+----------------------------------------------------------+
                        ↕
    +-------------------+-------------------+
    |                   |                   |
+---+---+          +----+----+        +-----+-----+
|  Router|          |  Switch  |        | Wireless   |
| IOS-XE |          |  IOS-XE  |        | Controller |
|        |          |          |        |            |
| YANG   |          | YANG     |        | YANG       |
| Models |          | Models   |        | Models     |
+--------+          +----------+        +------------+

Configuration via: NETCONF (XML) or RESTCONF (JSON/XML)
Monitoring via: Streaming Telemetry (gRPC)
\`\`\`

---

## Key Takeaways

- **Intent-Based Networking** lets administrators define *what* they want, not *how* to configure it, following a Translate-Act-Verify-Observe lifecycle
- **Cisco DNA Center** is the enterprise IBN platform providing automation, assurance, analytics, and programmability
- **NETCONF** uses XML over SSH and provides full configuration datastore management; best for complex configurations
- **RESTCONF** provides a RESTful HTTP interface to YANG models using JSON or XML; best for web-based integration and simple operations
- **YANG** is the data modeling language that defines what configuration and state data network devices expose through NETCONF and RESTCONF
- Together, these technologies enable fully automated, programmable, and verifiable network management`,
  },
};
