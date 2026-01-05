# Threat Model Builder

A visual tool that helps teams identify and document security risks in their software systems.

---

## What Does This Project Do?

Imagine you're building a house. Before construction begins, an architect creates blueprints showing every room, window, and door. These blueprints help identify potential problems like weak entry points or areas that need extra security.

**This project does the same thing for software security.**

It provides a drag-and-drop interface where developers can:
- Map out their application's architecture (databases, APIs, user interfaces, etc.)
- Automatically identify potential security vulnerabilities
- Track security improvements over time
- Generate reports for compliance and auditing

---

## Why Does This Matter?

In today's digital world, data breaches and cyber attacks are constant threats. Organizations need to:
- Know where their sensitive data lives
- Understand how that data flows through their systems
- Identify weak points before attackers do
- Document security measures for regulatory compliance

This tool makes security analysis accessible to teams without requiring deep cybersecurity expertise.

---

## Key Features

### Visual Architecture Diagram
- **Drag-and-drop interface** - Simply drag components onto a canvas to build your system diagram
- **Pre-built component library** - Includes 17 component types including databases, APIs, mobile apps, load balancers, DNS, CDN, and more
- **Prebuilt architectures** - 6 sample architectures to get started quickly (REST API, Microservices, Mobile Backend, Three-Tier, Event-Driven, SaaS)
- **Trust boundary visualization** - Clearly show where security zones begin and end

### Automated Threat Analysis
- **STRIDE methodology** - A proven framework for identifying threats across six categories:
  - Spoofing (pretending to be someone else)
  - Tampering (modifying data without permission)
  - Repudiation (denying actions took place)
  - Information Disclosure (unauthorized data exposure)
  - Denial of Service (making systems unavailable)
  - Elevation of Privilege (gaining unauthorized access)
- **60+ CWE vulnerability references** - Each threat mapped to real Common Weakness Enumeration entries
- **Automatic threat generation** - Threats auto-generated for all 17 component types

### Mitigation Tracking
- **Suggested security controls** - Each identified threat comes with recommended mitigations
- **Implementation status tracking** - Mark mitigations as Not Implemented, In Progress, or Implemented
- **Priority scoring** - Focus on the most critical security gaps first
- **NIST/OWASP mappings** - Mitigations linked to NIST controls and OWASP recommendations

### Reporting & Export
- **JSON export** - Share complete threat models with team members
- **PDF export** - Generate compliance-ready reports with executive summaries
- **Summary dashboards** - View threat counts by severity (Critical, High, Medium, Low)
- **Audit-ready documentation** - Export reports for compliance reviews

---

## Tech Stack

- **Frontend**: React 18, Next.js 14
- **State Management**: Zustand
- **Diagramming**: React Flow
- **UI Components**: Radix UI, Tailwind CSS
- **Testing**: Jest (36 tests, all passing)
- **Type Safety**: TypeScript
- **Export**: JSON and PDF reports (jspdf)
- **Icons**: Lucide React

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ryanwelchtech/threat-model-builder.git

# Navigate to project directory
cd threat-model-builder

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run lint` | Check code quality |
| `npm run type-check` | Verify TypeScript types |
| `npm test` | Run test suite (36 tests) |

---

## How It Works (Simple Walkthrough)

1. **Build Your Diagram**
   - Drag components from the sidebar onto the canvas
   - Connect them to show data flow between systems
   - Add trust boundaries to separate security zones

2. **Review Identified Threats**
   - Click any component to see its associated threats
   - Threats are automatically generated based on component type
   - Each threat shows severity, likelihood, and impact

3. **Track Mitigations**
   - View suggested security controls for each threat
   - Update implementation status as your team works through items
   - Monitor overall security posture with the dashboard

4. **Export and Share**
   - Save your threat model as JSON
   - Share with team members for collaborative review
   - Generate reports for compliance documentation

---

## Project Structure

```
threat-model-builder/
├── src/
│   ├── app/                  # Next.js application pages
│   ├── components/           # UI components
│   │   ├── canvas/          # Diagram canvas components
│   │   ├── panel/           # Side panel components
│   │   ├── sidebar/         # Component library sidebar
│   │   └── ui/              # Reusable UI elements
│   ├── data/                # Pre-built component and threat data
│   ├── store/               # State management (Zustand)
│   ├── types/               # TypeScript type definitions
│   └── lib/                 # Utility functions
├── .github/workflows/       # CI/CD configuration
└── tests/                   # Test files (36 passing)
```

---

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

---

## License

Private project - all rights reserved.

---

## Contact

For questions or collaboration opportunities, please reach out via GitHub.

---

## Acknowledgments

- **STRIDE Methodology** - Originally developed by Microsoft
- **React Flow** - Powerful diagramming library
- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Utility-first CSS framework
