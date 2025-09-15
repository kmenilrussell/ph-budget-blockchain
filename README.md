# Philippine Blockchain Budget Transparency System

A comprehensive blockchain-based budget transparency system for the Philippine government, implementing the concepts proposed in Senate Bill No. 1330.

## Overview

This system provides real-time tracking of government budget allocations, fund releases, and expenditures using blockchain technology for immutable record-keeping and enhanced transparency.

## Features

### Core Functionality
- **Budget Allocation Management**: Create and track government budget allocations
- **Fund Release Tracking**: Monitor fund disbursements to agencies
- **Expenditure Recording**: Document how funds are spent with beneficiary details
- **Project Management**: Associate budgets with specific government projects
- **Agency Management**: Comprehensive database of Philippine government agencies

### Blockchain Integration
- **Smart Contract Operations**: Ethereum-based smart contract for immutable records
- **Data Integrity Verification**: Real-time verification between database and blockchain
- **Transaction History**: Complete audit trail of all budget operations
- **Immutable Records**: Tamper-proof budget transaction recording

### Advanced Features
- **Real-time Dashboard**: Live updates of budget metrics and utilization rates
- **Budget Flow Visualization**: Interactive visualization of fund movement
- **Advanced Analytics**: KPIs, performance indicators, and financial trends
- **Role-based Access Control**: Different permissions for DBM, COA, Agency users
- **Document Management**: IPFS integration for contract and document storage
- **Notification System**: Alerts for budget events and status changes

## Technology Stack

- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API Routes with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Blockchain**: Ethereum/Polygon smart contracts (Solidity)
- **Storage**: IPFS for document storage
- **Real-time**: WebSocket connections for live updates

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Git
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd budget-transparency-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your database and blockchain configuration:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/budget_db"
   BLOCKCHAIN_RPC_URL="https://polygon-mainnet.infura.io/v3/your-key"
   CONTRACT_ADDRESS="0x..."
   WALLET_PRIVATE_KEY="your-wallet-private-key"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### For Citizens
- View budget allocations and expenditures
- Track fund utilization across government agencies
- Verify data integrity through blockchain verification
- Access public documents and contracts

### For Government Agencies
- Submit budget allocation requests
- Record fund releases and expenditures
- Manage project documentation
- Monitor budget utilization in real-time

### For Auditors (COA)
- Verify transactions against blockchain records
- Generate audit reports
- Identify discrepancies and anomalies
- Monitor compliance with budget regulations

## API Endpoints

### Core API
- `GET /api/agencies` - List all government agencies
- `POST /api/allocations` - Create new budget allocation
- `GET /api/allocations` - List all allocations
- `POST /api/releases` - Record fund release
- `POST /api/expenditures` - Record expenditure
- `GET /api/dashboard` - Get dashboard statistics

### Blockchain API
- `POST /api/blockchain/allocate` - Record allocation on blockchain
- `POST /api/blockchain/release` - Record release on blockchain
- `POST /api/blockchain/expend` - Record expenditure on blockchain
- `GET /api/blockchain/verify` - Verify data integrity
- `GET /api/blockchain/transactions` - Get transaction history

## Smart Contract

The system uses a Solidity smart contract deployed on Ethereum/Polygon:

```solidity
contract BudgetTransparency {
    struct Allocation { uint id; string agency; string project; uint256 amount; }
    struct Release { uint id; uint allocationId; uint256 amount; string description; }
    struct Expenditure { uint id; uint releaseId; uint256 amount; string beneficiary; }
    
    function createAllocation(string memory agency, string memory project, uint256 amount) public;
    function releaseFunds(uint allocationId, uint256 amount, string memory description) public;
    function recordExpenditure(uint releaseId, uint256 amount, string memory beneficiary) public;
}
```

## Data Structure

### Philippine Government Agencies
The system includes all major Philippine government agencies:
- Executive Departments (DBM, DOF, DPWH, DepEd, DOH, DICT, etc.)
- Constitutional Commissions (COA, COMELEC, CSC)
- Sectoral Agencies (NEDA, PSA, TESDA)
- Local Government Units (MMDA, Provincial, City, Municipal)

### Budget Categories
- Personnel Services
- Maintenance and Other Operating Expenses
- Capital Outlays
- Financial Expenses

## Deployment

### Production Deployment
1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

3. **Set up reverse proxy** (nginx example)
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Blockchain Deployment
1. **Compile contract**
   ```bash
   npx hardhat compile
   ```

2. **Deploy to network**
   ```bash
   npx hardhat run scripts/deploy.js --network polygon
   ```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Philippine Senate for proposing SB 1330
- Department of Budget and Management (DBM)
- Commission on Audit (COA)
- All government agencies participating in transparency initiatives

## Roadmap

- [ ] Mobile application development
- [ ] Multi-language support (Filipino, English)
- [ ] Advanced data visualization tools
- [ ] Machine learning for anomaly detection
- [ ] Integration with other government systems
- [ ] Public API for third-party developers

---

**Transparency. Accountability. Good Governance.**
