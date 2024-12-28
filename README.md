## Table of Contents
- [Project Title](#b-link-a-blockchain-driven-blood-network)
- [Description](#description)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Features](#features)
- [Installation Guide](#installation-guide)
- [Usage](#usage)
- [License](#license)

# B-LINK: A Blockchain-Driven Blood Network

## Description
B-LINK is an innovative blockchain-driven solution that redefines blood bank management by ensuring transparency, security, and efficiency in the healthcare ecosystem. Our system leverages blockchain to verify blood bank licenses, guarantees tamper-proof transaction histories, and uses IPFS for secure, decentralized data storage.

With B-LINK, hospitals and blood banks can seamlessly manage inventory, track donations, and authenticate records in real-time—eliminating fraud and inefficiencies in the blood supply chain. This scalable solution promotes trust and saves lives by ensuring the right blood is delivered to the right place, at the right time.

## Tech Stack
- **Node.js**: JavaScript runtime for building server-side applications.
- **Express.js**: Web framework for Node.js to handle routing and middleware.
- **PostgreSQL**: Relational database for storing user and blood unit data.
- **Ethereum**: Blockchain platform for deploying smart contracts.
- **IPFS**: InterPlanetary File System for decentralized storage of files.

## Prerequisites
- Node.js (version 14 or higher)
- NPM (Node Package Manager)
- PostgreSQL

## Features
- **Decentralized Data Management**: All blood donation and inventory records are stored on the blockchain, ensuring data integrity and preventing unauthorized alterations.
- **IPFS for Data Storage**: Utilizes IPFS for storing large files, such as test results, securely and in a decentralized manner.
- **Smart Contracts**: Automated processes for blood unit registration, testing, and tracking, reducing the need for intermediaries.
- **AI Predictions**: AI algorithms analyze historical data to predict future blood donation needs, optimizing inventory management and ensuring timely responses to demand fluctuations.

## Usage
1. **Start the server**:
   ```bash
   npm start
   ```
2. **Register a Blood Bank**: Use the `/BloodBank/register` endpoint to register a new blood bank.
   - **Method**: POST
   - **Request Body**: `{ "name": "Blood Bank Name", "location": "City, Country" }`
   - **Response**: `{ "message": "Blood bank registered successfully." }`
3. **Register a Hospital**: Use the `/Hospital/register` endpoint to register a new hospital.
   - **Method**: POST
   - **Request Body**: `{ "name": "Hospital Name", "location": "City, Country" }`
   - **Response**: `{ "message": "Hospital registered successfully." }`
4. **Login**: Use the `/BloodBank/login` or `/Hospital/login` endpoints to authenticate users.
5. **Manage Blood Units**: Interact with the smart contract to manage blood units via the provided functions in the `BloodManagement` contract.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.