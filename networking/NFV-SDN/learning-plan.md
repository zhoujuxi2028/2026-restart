# NFV & SDN Learning Plan: 4-6 Week Comprehensive Roadmap

## Overview

**Target**: Interview-ready knowledge with practical work application skills
**Background**: Basic networking knowledge
**Time Investment**: 6+ hours/day (full-time learning)
**Expected Outcome**: Confident to apply for SDN/NFV roles after 4-6 weeks

---

## Week 1: Software Defined Networking (SDN) Fundamentals

**Location**: `01-SDN/week1-fundamentals/`

### Day 1-2: SDN Core Concepts (12-14 hours)

**Theory (4-5 hours per day)**
- [ ] What is SDN? Traditional networking vs. SDN
- [ ] Control plane and data plane separation
- [ ] SDN architecture: Application, Control, Infrastructure layers
- [ ] North-bound and South-bound interfaces
- [ ] Key benefits and use cases of SDN

**Reading Materials**
- ONF (Open Networking Foundation) SDN architecture documentation
- "Software Defined Networks: A Comprehensive Approach" - relevant chapters
- RFC 7426: Software-Defined Networking (SDN) Architecture

**Practical Labs (2-3 hours per day)**
- [ ] Install VirtualBox/VMware
- [ ] Set up Ubuntu 20.04/22.04 VM
- [ ] Install Mininet: `sudo apt-get install mininet`
- [ ] Run first Mininet topology: `sudo mn --test pingall`
- [ ] Explore Mininet CLI commands

**Exercises**
```bash
# Create custom topology
sudo mn --topo=single,3
sudo mn --topo=tree,depth=2,fanout=2

# Experiment with different topologies
# Document your observations in notes/day1-2.md
```

**Deliverables**
- Notes on SDN concepts (`notes/day1-2-concepts.md`)
- Screenshots of Mininet experiments (`labs/mininet-basics/`)

---

### Day 3-5: SDN Controllers and OpenFlow (18-20 hours)

**Theory (3-4 hours per day)**
- [ ] OpenFlow protocol fundamentals
- [ ] Flow tables, match fields, and actions
- [ ] SDN controller architecture and functions
- [ ] Popular controllers: OpenDaylight, ONOS, Floodlight, Ryu

**Deep Dive: OpenFlow**
- [ ] OpenFlow switch components
- [ ] Flow entry structure and matching
- [ ] Group tables and meter tables
- [ ] Controller-to-switch communication

**Practical Labs (3-4 hours per day)**

**Lab 1: OpenDaylight Setup**
```bash
# Install Java
sudo apt install openjdk-11-jdk

# Download OpenDaylight (Oxygen or newer release)
wget https://nexus.opendaylight.org/content/repositories/opendaylight.release/...

# Run ODL
./bin/karaf

# Access DLUX UI: http://localhost:8181/index.html
# Credentials: admin/admin
```

**Lab 2: Connect Mininet to OpenDaylight**
```bash
# Start ODL with OpenFlow plugin
feature:install odl-openflowplugin-all

# Start Mininet with remote controller
sudo mn --controller=remote,ip=127.0.0.1,port=6633 --topo tree,2

# Verify connection in ODL UI
```

**Lab 3: Basic Flow Programming**
- [ ] Add manual flows using ODL RESTCONF API
- [ ] Test connectivity with different flow rules
- [ ] Implement simple L2 learning switch

**Python Programming Exercises**
```python
# Example: REST API interaction with ODL
import requests

controller_ip = "localhost:8181"
auth = ("admin", "admin")

# Get topology
response = requests.get(
    f"http://{controller_ip}/restconf/operational/network-topology:network-topology",
    auth=auth
)
```

**Deliverables**
- OpenFlow protocol notes (`notes/day3-5-openflow.md`)
- ODL installation guide (`labs/odl-setup/INSTALL.md`)
- Flow programming examples (`labs/flow-programming/`)
- Python scripts for controller interaction (`exercises/rest-api-scripts/`)

---

### Day 6-7: SDN Applications and Projects (12-14 hours)

**Theory (2-3 hours per day)**
- [ ] SDN application development
- [ ] North-bound API usage
- [ ] Common SDN use cases: Traffic engineering, security, monitoring
- [ ] SDN in data centers

**Practical Projects (4-5 hours per day)**

**Project 1: Custom L2 Learning Switch**
- Build a learning switch application on ODL/Ryu
- Implement MAC learning and forwarding logic
- Test with Mininet topology

**Project 2: Simple Firewall**
- Create basic firewall rules
- Block specific traffic flows
- Implement allow/deny lists

**Project 3: Traffic Monitor**
- Collect flow statistics
- Display bandwidth usage per flow
- Create simple visualization

**Deliverables**
- Three completed projects in `projects/week1/`
- Project documentation with architecture diagrams
- Working code with comments
- Test results and screenshots

---

## Week 2: Network Function Virtualization (NFV) Fundamentals

**Location**: `02-NFV/week2-fundamentals/`

### Day 8-9: NFV Architecture and Concepts (12-14 hours)

**Theory (4-5 hours per day)**
- [ ] What is NFV? Traditional appliances vs. VNFs
- [ ] ETSI NFV architecture framework
- [ ] VNF (Virtual Network Function) components
- [ ] NFV Infrastructure (NFVI)
- [ ] VIM (Virtualized Infrastructure Manager)
- [ ] NFV MANO (Management and Orchestration)
  - NFVO (NFV Orchestrator)
  - VNFM (VNF Manager)
  - VIM (Virtualized Infrastructure Manager)

**Reading Materials**
- ETSI GS NFV 002 - NFV Architectural Framework
- ETSI GS NFV-MAN 001 - NFV Management and Orchestration
- NFV use cases white papers

**Practical Labs (2-3 hours per day)**
- [ ] Set up KVM/QEMU on Ubuntu
- [ ] Create first VM using virt-manager
- [ ] Explore libvirt and virsh commands

```bash
# Install KVM
sudo apt install qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils

# Verify KVM installation
sudo kvm-ok

# Create virtual network
virsh net-list --all
virsh net-start default
```

**Deliverables**
- NFV architecture notes with diagrams (`notes/day8-9-nfv-arch.md`)
- KVM setup documentation (`labs/kvm-setup/`)

---

### Day 10-12: Virtualization Technologies (18-20 hours)

**Theory (3 hours per day)**
- [ ] Hypervisors: Type 1 vs. Type 2
- [ ] Container vs. VM virtualization
- [ ] Docker fundamentals for VNFs
- [ ] Kubernetes basics for NFV
- [ ] OVS (Open vSwitch) architecture

**Practical Labs (3-4 hours per day)**

**Lab 1: Open vSwitch Setup**
```bash
# Install OVS
sudo apt install openvswitch-switch

# Create bridge
sudo ovs-vsctl add-br br0

# Add ports
sudo ovs-vsctl add-port br0 eth0

# Show configuration
sudo ovs-vsctl show
```

**Lab 2: Docker for VNFs**
```bash
# Pull networking containers
docker pull nginx
docker pull alpine

# Create container VNFs
docker run -d --name vnf-web nginx
docker run -d --name vnf-router alpine

# Connect containers to OVS
```

**Lab 3: Build Simple VNF**
- [ ] Create Docker-based firewall VNF
- [ ] Implement basic routing VNF
- [ ] Build load balancer VNF

**Python Programming**
```python
# Example: VNF lifecycle management script
import docker

client = docker.from_env()

def deploy_vnf(image, name, network):
    container = client.containers.run(
        image,
        name=name,
        network=network,
        detach=True
    )
    return container
```

**Deliverables**
- OVS configuration guide (`labs/ovs-setup/`)
- Docker VNF examples (`labs/docker-vnfs/`)
- Three custom VNF implementations (`projects/week2/vnf-collection/`)

---

### Day 13-14: OpenStack and NFV Platforms (12-14 hours)

**Theory (2-3 hours per day)**
- [ ] OpenStack architecture overview
- [ ] OpenStack components for NFV: Nova, Neutron, Heat
- [ ] DevStack for development
- [ ] OpenStack networking concepts
- [ ] Alternative platforms: OSM, ONAP

**Practical Labs (4-5 hours per day)**

**Lab 1: DevStack Installation**
```bash
# Install DevStack (single-node)
git clone https://opendev.org/openstack/devstack
cd devstack

# Create local.conf
cat > local.conf << EOF
[[local|localrc]]
ADMIN_PASSWORD=secret
DATABASE_PASSWORD=secret
RABBIT_PASSWORD=secret
SERVICE_PASSWORD=secret
EOF

# Run installation
./stack.sh
```

**Lab 2: Deploy VNF on OpenStack**
- [ ] Create VM instances
- [ ] Configure networking
- [ ] Deploy simple VNF image
- [ ] Test connectivity

**Lab 3: Heat Templates**
- [ ] Create Heat orchestration template
- [ ] Deploy multi-VM VNF topology
- [ ] Automate VNF deployment

**Deliverables**
- DevStack installation guide (`labs/devstack-setup/`)
- Heat templates (`exercises/heat-templates/`)
- VNF deployment documentation (`projects/week2/openstack-vnf/`)

---

## Week 3: NFV+SDN Integration and Advanced Patterns

**Location**: `03-Integration/`

### Day 15-17: Service Function Chaining (18-20 hours)

**Theory (3 hours per day)**
- [ ] Service Function Chaining (SFC) concepts
- [ ] NSH (Network Service Header) protocol
- [ ] SFC architecture and components
- [ ] Traffic steering mechanisms
- [ ] Real-world SFC use cases

**Practical Labs (3-4 hours per day)**

**Lab 1: SFC with OpenDaylight**
```bash
# Install SFC features in ODL
feature:install odl-sfc-all

# Configure service functions
# Create service chains
# Test traffic steering
```

**Lab 2: Build End-to-End Service Chain**
- [ ] Deploy chain: Firewall → IDS → Load Balancer
- [ ] Configure traffic classification
- [ ] Test chain functionality
- [ ] Measure performance impact

**Project: Enterprise Security Chain**
- Design multi-VNF security service chain
- Implement traffic steering
- Add monitoring and logging
- Document architecture

**Deliverables**
- SFC concepts and architecture (`week3-service-chaining/notes/sfc-concepts.md`)
- Working SFC implementation (`week3-service-chaining/labs/`)
- Enterprise security chain project (`projects/security-chain/`)

---

### Day 18-19: Network Orchestration (12-14 hours)

**Theory (3 hours per day)**
- [ ] ETSI MANO architecture deep dive
- [ ] VNF onboarding process
- [ ] VNF lifecycle management
- [ ] Network service descriptors
- [ ] Orchestration vs. choreography

**Practical Labs (3-4 hours per day)**

**Lab 1: OSM (Open Source MANO)**
```bash
# Install OSM
wget https://osm-download.etsi.org/ftp/osm-11.0-eleven/install_osm.sh
chmod +x install_osm.sh
./install_osm.sh

# Access OSM UI
# Add VIM account
# Onboard VNFs
```

**Lab 2: VNF Package Creation**
- [ ] Create VNF descriptor
- [ ] Package VNF
- [ ] Onboard to OSM
- [ ] Instantiate VNF

**Project: Multi-VNF Service Orchestration**
- Define network service with 3+ VNFs
- Create service descriptor
- Implement automated deployment
- Add scaling policies

**Deliverables**
- OSM setup and usage guide (`week3-orchestration/labs/osm/`)
- VNF packages (`week3-orchestration/exercises/vnf-packages/`)
- Orchestration project (`projects/multi-vnf-service/`)

---

### Day 20-21: Advanced Topics and Integration (12-14 hours)

**Theory (2-3 hours per day)**
- [ ] 5G network slicing with NFV/SDN
- [ ] SD-WAN architecture
- [ ] Intent-Based Networking (IBN)
- [ ] Network automation with Ansible
- [ ] Performance optimization techniques

**Practical Labs (4-5 hours per day)**

**Lab 1: Network Automation**
```yaml
# Ansible playbook for VNF deployment
---
- name: Deploy VNF Infrastructure
  hosts: nfv_nodes
  tasks:
    - name: Install dependencies
      apt:
        name: "{{ item }}"
        state: present
      loop:
        - docker.io
        - openvswitch-switch
```

**Lab 2: SD-WAN Simulation**
- [ ] Set up multi-site topology
- [ ] Implement path selection
- [ ] Add QoS policies
- [ ] Monitor WAN performance

**Capstone Project: Complete NFV/SDN Solution**
- Design enterprise network with SDN+NFV
- Implement multi-site connectivity
- Deploy service chains
- Add automation and monitoring
- Create comprehensive documentation

**Deliverables**
- Automation playbooks (`exercises/ansible-automation/`)
- SD-WAN implementation (`labs/sd-wan/`)
- Capstone project (`projects/capstone-solution/`)

---

## Week 4: Interview Preparation and Portfolio Development

**Location**: `04-Interview-Prep/`

### Day 22-23: Concepts Review and Consolidation (12-14 hours)

**Focus Areas (6-7 hours per day)**

**SDN Review**
- [ ] Revise control/data plane separation
- [ ] OpenFlow protocol details
- [ ] Controller architectures
- [ ] Common SDN use cases

**NFV Review**
- [ ] ETSI NFV architecture components
- [ ] VNF lifecycle management
- [ ] MANO architecture
- [ ] VNF performance considerations

**Integration Review**
- [ ] Service function chaining
- [ ] NFV+SDN orchestration
- [ ] Network automation

**Create Concept Summaries**
- [ ] One-page cheat sheets for each topic
- [ ] Architecture diagrams
- [ ] Comparison tables (SDN vs traditional, NFV vs appliances)
- [ ] Key terminology glossary

**Deliverables**
- Concept cheat sheets (`concepts-review/cheat-sheets/`)
- Architecture diagrams (`concepts-review/diagrams/`)
- Terminology glossary (`concepts-review/glossary.md`)

---

### Day 24-25: Interview Questions and Case Studies (12-14 hours)

**Prepare Answers (6-7 hours per day)**

**Common Technical Questions**
- [ ] "Explain SDN architecture"
- [ ] "What is the difference between SDN and NFV?"
- [ ] "How does OpenFlow work?"
- [ ] "Describe VNF lifecycle management"
- [ ] "What are the benefits of service chaining?"
- [ ] "How would you troubleshoot SDN controller connectivity?"
- [ ] "Explain the role of NFVO in MANO architecture"

**Scenario-Based Questions**
- [ ] "Design a data center network with SDN"
- [ ] "How would you migrate from traditional to NFV?"
- [ ] "Troubleshoot: VNF not receiving traffic"
- [ ] "Optimize: Service chain performance issues"

**Case Studies**
- [ ] Analyze real-world SDN deployment (e.g., Google B4)
- [ ] Study NFV implementation at major telecom
- [ ] Review SD-WAN adoption case study

**Behavioral Questions**
- [ ] "Describe a complex technical problem you solved"
- [ ] "How do you stay updated with networking technologies?"
- [ ] "Tell me about a time you worked in a team"

**Deliverables**
- Question bank with detailed answers (`common-questions/technical-qa.md`)
- Case study analyses (`case-studies/real-world-examples/`)
- Behavioral question responses (`common-questions/behavioral-qa.md`)

---

### Day 26-27: Project Portfolio Development (12-14 hours)

**Portfolio Projects (6-7 hours per day)**

**Project 1: SDN Controller Application**
- Clean up and document your best SDN project
- Add README with problem statement, solution, architecture
- Include code comments and usage instructions
- Add screenshots/diagrams

**Project 2: VNF Implementation**
- Package your most impressive VNF
- Document deployment process
- Include performance metrics
- Add troubleshooting guide

**Project 3: End-to-End Integration**
- Showcase your capstone project
- Create video demo (optional)
- Write detailed documentation
- Highlight unique features

**Create Portfolio Website/GitHub**
```markdown
# Portfolio Structure
├── README.md (overview of all projects)
├── sdn-controller-app/
│   ├── README.md
│   ├── architecture.png
│   ├── src/
│   └── docs/
├── vnf-implementation/
└── integration-project/
```

**Deliverables**
- Three polished portfolio projects (`project-portfolio/`)
- Project descriptions optimized for resume (`project-portfolio/resume-descriptions.md`)
- GitHub repository with professional README
- Optional: Demo videos

---

### Day 28: Mock Interviews and Final Review (6-8 hours)

**Morning: Technical Mock Interview (3-4 hours)**
- [ ] Practice explaining projects out loud
- [ ] Draw architecture diagrams on whiteboard/paper
- [ ] Time yourself answering questions
- [ ] Record yourself for self-review

**Afternoon: Final Review (3-4 hours)**
- [ ] Review all concept cheat sheets
- [ ] Go through question bank
- [ ] Test lab environments one final time
- [ ] Update progress tracking to 100%

**Resume and LinkedIn Updates**
- [ ] Add NFV/SDN skills
- [ ] Include portfolio projects
- [ ] Update project descriptions
- [ ] Add relevant keywords

**Deliverables**
- Updated resume with NFV/SDN experience
- LinkedIn profile updates
- Confidence in discussing 3+ detailed projects

---

## Extended Learning (Week 5-6+) - Optional

### Advanced Topics
- [ ] P4 programming language
- [ ] eBPF for programmable networks
- [ ] Network telemetry and observability
- [ ] Multi-cloud networking
- [ ] Edge computing with NFV

### Certifications
- [ ] Linux Foundation CKA (Kubernetes)
- [ ] Red Hat OpenStack certification
- [ ] Vendor-specific certifications (Cisco, VMware)

### Open Source Contributions
- [ ] Contribute to OpenDaylight/ONOS
- [ ] Fix bugs in NFV projects
- [ ] Write documentation
- [ ] Create tutorials

---

## Success Metrics

### By End of Week 2
- ✓ Comfortable with SDN concepts and controllers
- ✓ Built and deployed basic VNFs
- ✓ Hands-on with OpenFlow and OpenStack

### By End of Week 3
- ✓ Implemented service function chaining
- ✓ Used orchestration platforms
- ✓ Completed 3+ substantial projects

### By End of Week 4
- ✓ Can discuss NFV/SDN confidently in interviews
- ✓ Portfolio of demonstrable projects
- ✓ Ready to apply for positions

---

## Daily Study Tips

1. **Morning**: Start with theory and reading (fresh mind for concepts)
2. **Afternoon**: Hands-on labs and exercises (active learning)
3. **Evening**: Documentation and reflection (consolidate learning)
4. **Take Breaks**: 10-minute breaks every hour
5. **Ask Questions**: Use forums when stuck (don't waste hours debugging)
6. **Document Everything**: Your notes will be valuable for interviews

---

## Troubleshooting Common Issues

### Lab Environment Issues
- VM not starting → Check virtualization enabled in BIOS
- Network connectivity → Verify bridge/NAT settings
- Low performance → Allocate more RAM/CPU to VMs

### Learning Challenges
- Concepts unclear → Watch video tutorials, read multiple sources
- Labs not working → Check versions, follow official docs
- Feeling overwhelmed → Focus on one topic at a time, review previous days

---

## Next Steps After Completion

1. **Apply for Jobs**: Start applying with updated resume
2. **Network**: Join SDN/NFV communities, attend meetups
3. **Keep Learning**: Follow industry trends, new technologies
4. **Contribute**: Share your knowledge through blogs/videos
5. **Specialize**: Choose niche area (5G, SD-WAN, security)

**Remember**: This is a marathon, not a sprint. Consistency is key! 🎯
