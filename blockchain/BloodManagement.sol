// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BloodManagement {
    // Enums
    enum BloodStatus { 
        NOT_VERIFIED,    // Initial state when blood is collected
        TESTED_SAFE,     // After testing, if blood is safe
        DISCARDED,       // If blood is not safe after testing
        RESERVED,        // When hospital reserves the blood
        EXPIRED,        // 30+ days after collection
        TRANSFUSED      // When blood has been transfused to a patient
    }

    // Structs
    struct BloodUnit {
        string bloodUnitId;
        string donorId;
        string bloodGroup;
        string rhFactor;
        uint256 collectedTimestamp;
        string bloodBankId;
        BloodStatus status;
        string testResultsCID;  // IPFS CID for test results
    }

    struct BloodBank {
        string bloodBankId;
        string name;
        string licenseNumber;
        string city;
        bool isVerified;
        address walletAddress;
        uint256 registrationTimestamp;
    }

    // State variables
    mapping(string => BloodUnit) public bloodUnits;           // bloodUnitId => BloodUnit
    mapping(string => BloodBank) public bloodBanks;           // bloodBankId => BloodBank
    mapping(address => bool) public authorizedInspectors;     // Addresses authorized to update test results
    address public owner;
    string[] public allBloodUnitIds;                         // Array to keep track of all blood unit IDs

    // Events
    event BloodUnitAdded(string bloodUnitId, string bloodBankId, uint256 timestamp);
    event BloodStatusUpdated(string bloodUnitId, BloodStatus newStatus);
    event BloodBankRegistered(string bloodBankId, string licenseNumber);
    event TestResultsUpdated(string bloodUnitId, string testResultsCID);
    event BloodUnitExpired(string bloodUnitId, uint256 timestamp);

    constructor() {
        owner = msg.sender;
    }

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier onlyAuthorizedInspector() {
        require(authorizedInspectors[msg.sender], "Only authorized inspectors can perform this action");
        _;
    }

    modifier onlyVerifiedBloodBank() {
        require(bloodBanks[getBloodBankId(msg.sender)].isVerified, "Only verified blood banks can perform this action");
        _;
    }

    // Blood Bank Management
    function registerBloodBank(
        string memory _bloodBankId, 
        string memory _name,
        string memory _licenseNumber,
        string memory _city
    ) external {
        require(bloodBanks[_bloodBankId].walletAddress == address(0), "Blood bank already registered");
        
        bloodBanks[_bloodBankId] = BloodBank({
            bloodBankId: _bloodBankId,
            name: _name,
            licenseNumber: _licenseNumber,
            city: _city,
            isVerified: false,
            walletAddress: msg.sender,
            registrationTimestamp: block.timestamp
        });

        emit BloodBankRegistered(_bloodBankId, _licenseNumber);
    }

    function verifyBloodBank(string memory _bloodBankId) external onlyOwner {
        require(!bloodBanks[_bloodBankId].isVerified, "Blood bank already verified");
        bloodBanks[_bloodBankId].isVerified = true;
    }

    // Blood Unit Management
    function addBloodUnit(
        string memory _bloodUnitId,
        string memory _donorId,
        string memory _bloodGroup,
        string memory _rhFactor,
        string memory _bloodBankId
    ) external onlyVerifiedBloodBank {
        require(bytes(bloodUnits[_bloodUnitId].bloodUnitId).length == 0, "Blood unit already exists");

        bloodUnits[_bloodUnitId] = BloodUnit({
            bloodUnitId: _bloodUnitId,
            donorId: _donorId,
            bloodGroup: _bloodGroup,
            rhFactor: _rhFactor,
            collectedTimestamp: block.timestamp,
            bloodBankId: _bloodBankId,
            status: BloodStatus.NOT_VERIFIED,
            testResultsCID: ""
        });

        allBloodUnitIds.push(_bloodUnitId);  // Add to tracking array
        emit BloodUnitAdded(_bloodUnitId, _bloodBankId, block.timestamp);
    }

    function updateTestResults(
        string memory _bloodUnitId, 
        string memory _testResultsCID, 
        bool _isSafe
    ) external onlyAuthorizedInspector {
        require(bytes(bloodUnits[_bloodUnitId].bloodUnitId).length != 0, "Blood unit does not exist");
        require(bloodUnits[_bloodUnitId].status == BloodStatus.NOT_VERIFIED, "Blood unit already tested");

        bloodUnits[_bloodUnitId].testResultsCID = _testResultsCID;
        bloodUnits[_bloodUnitId].status = _isSafe ? BloodStatus.TESTED_SAFE : BloodStatus.DISCARDED;

        emit TestResultsUpdated(_bloodUnitId, _testResultsCID);
        emit BloodStatusUpdated(_bloodUnitId, bloodUnits[_bloodUnitId].status);
    }

    function reserveBloodUnit(string memory _bloodUnitId) external {
        require(bytes(bloodUnits[_bloodUnitId].bloodUnitId).length != 0, "Blood unit does not exist");
        require(bloodUnits[_bloodUnitId].status == BloodStatus.TESTED_SAFE, "Blood unit not available");
        require(!isExpired(_bloodUnitId), "Blood unit expired");

        bloodUnits[_bloodUnitId].status = BloodStatus.RESERVED;
        emit BloodStatusUpdated(_bloodUnitId, BloodStatus.RESERVED);
    }

    function markBloodAsTransfused(string memory _bloodUnitId) external {
        require(bytes(bloodUnits[_bloodUnitId].bloodUnitId).length != 0, "Blood unit does not exist");
        require(bloodUnits[_bloodUnitId].status == BloodStatus.RESERVED, "Blood unit must be reserved before transfusion");
        require(!isExpired(_bloodUnitId), "Cannot transfuse expired blood");

        bloodUnits[_bloodUnitId].status = BloodStatus.TRANSFUSED;
        emit BloodStatusUpdated(_bloodUnitId, BloodStatus.TRANSFUSED);
    }

    // Expiry Management
    function checkAndUpdateExpiredUnits(uint256 batchSize) external {
        require(batchSize > 0 && batchSize <= 100, "Invalid batch size");
        uint256 processed = 0;
        uint256 totalUnits = allBloodUnitIds.length;
        
        for (uint256 i = 0; i < totalUnits && processed < batchSize; i++) {
            string memory bloodUnitId = allBloodUnitIds[i];
            BloodUnit storage unit = bloodUnits[bloodUnitId];
            
            // Only check units that are not already expired or discarded
            if (unit.status != BloodStatus.EXPIRED && 
                unit.status != BloodStatus.DISCARDED && 
                isExpired(bloodUnitId)) {
                unit.status = BloodStatus.EXPIRED;
                emit BloodUnitExpired(bloodUnitId, block.timestamp);
                processed++;
            }
        }
    }

    function getExpiredUnitsCount() external view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < allBloodUnitIds.length; i++) {
            if (bloodUnits[allBloodUnitIds[i]].status == BloodStatus.EXPIRED) {
                count++;
            }
        }
        return count;
    }

    // Utility functions
    function isExpired(string memory _bloodUnitId) public view returns (bool) {
        return (block.timestamp - bloodUnits[_bloodUnitId].collectedTimestamp) > 30 days;
    }

    function getBloodBankId(address _walletAddress) internal view returns (string memory) {
        // This is a simplified version. In production, you'd want a more efficient way to look this up
        return bloodBanks[bloodBanks[msg.sender].bloodBankId].bloodBankId;
    }

    function getBloodUnitsByStatus(BloodStatus _status) public view returns (string[] memory) {
        uint256 count = 0;
        
        // First count matching blood units
        for (uint256 i = 0; i < allBloodUnitIds.length; i++) {
            if (bloodUnits[allBloodUnitIds[i]].status == _status) {
                count++;
            }
        }

        // Create array of matching blood unit IDs
        string[] memory matchingUnits = new string[](count);
        uint256 currentIndex = 0;

        // Fill array with matching blood unit IDs
        for (uint256 i = 0; i < allBloodUnitIds.length && currentIndex < count; i++) {
            if (bloodUnits[allBloodUnitIds[i]].status == _status) {
                matchingUnits[currentIndex] = allBloodUnitIds[i];
                currentIndex++;
            }
        }

        return matchingUnits;
    }

    // Function to get compatible blood units
    function getCompatibleBloodUnits(string memory _bloodGroup, string memory _rhFactor) public view returns (string[] memory) {
        uint256 count = 0;
        
        // First count matching blood units
        for (uint256 i = 0; i < allBloodUnitIds.length; i++) {
            BloodUnit storage unit = bloodUnits[allBloodUnitIds[i]];
            
            // Check if blood unit is available (tested safe and not reserved/expired/transfused)
            if (unit.status == BloodStatus.TESTED_SAFE) {
                // Check blood type compatibility
                if (isBloodCompatible(unit.bloodGroup, unit.rhFactor, _bloodGroup, _rhFactor)) {
                    count++;
                }
            }
        }

        // Create array of matching blood unit IDs
        string[] memory matchingUnits = new string[](count);
        uint256 currentIndex = 0;

        // Fill array with matching blood unit IDs
        for (uint256 i = 0; i < allBloodUnitIds.length && currentIndex < count; i++) {
            BloodUnit storage unit = bloodUnits[allBloodUnitIds[i]];
            
            if (unit.status == BloodStatus.TESTED_SAFE) {
                if (isBloodCompatible(unit.bloodGroup, unit.rhFactor, _bloodGroup, _rhFactor)) {
                    matchingUnits[currentIndex] = allBloodUnitIds[i];
                    currentIndex++;
                }
            }
        }

        return matchingUnits;
    }

    // Helper function to check blood type compatibility
    function isBloodCompatible(
        string memory donorGroup, 
        string memory donorRh, 
        string memory recipientGroup, 
        string memory recipientRh
    ) internal pure returns (bool) {
        // RH compatibility check
        // If recipient is Rh-, they can only receive Rh-
        if (keccak256(bytes(recipientRh)) == keccak256(bytes("negative")) && 
            keccak256(bytes(donorRh)) == keccak256(bytes("positive"))) {
            return false;
        }

        // Blood group compatibility check
        bytes32 dGroup = keccak256(bytes(donorGroup));
        bytes32 rGroup = keccak256(bytes(recipientGroup));

        // O can donate to anyone
        if (dGroup == keccak256(bytes("O"))) {
            return true;
        }

        // AB can receive from anyone
        if (rGroup == keccak256(bytes("AB"))) {
            return true;
        }

        // A can donate to A and AB
        if (dGroup == keccak256(bytes("A")) && rGroup == keccak256(bytes("A"))) {
            return true;
        }

        // B can donate to B and AB
        if (dGroup == keccak256(bytes("B")) && rGroup == keccak256(bytes("B"))) {
            return true;
        }

        return false;
    }

    // Admin functions
    function addInspector(address _inspector) external onlyOwner {
        authorizedInspectors[_inspector] = true;
    }

    function removeInspector(address _inspector) external onlyOwner {
        authorizedInspectors[_inspector] = false;
    }
}
