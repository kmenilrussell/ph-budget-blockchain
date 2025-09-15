// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title BudgetTransparency
 * @dev A proof-of-concept smart contract to track public budget allocations,
 * fund releases, and expenditures on a transparent and immutable ledger.
 *
 * This contract allows an authorized account (the contract owner) to create
 * budget allocations for agencies and projects, release funds against those
 * allocations, and record expenditures down to individual beneficiaries. Each
 * action emits an event, enabling off-chain indexing and real-time monitoring
 * by citizens and oversight bodies. The contract stores minimal data to keep
 * on-chain storage costs low; more detailed documents (e.g. project plans,
 * contracts) should be stored off-chain (e.g. IPFS) and referenced here via
 * their content hash.
 */
contract BudgetTransparency {
    /// @notice Representation of a budget allocation.
    struct Allocation {
        uint256 id;
        string agency;
        string project;
        uint256 amount;
        uint256 timestamp;
        bool exists;
    }

    /// @notice Representation of a release of funds against an allocation.
    struct Release {
        uint256 id;
        uint256 allocationId;
        uint256 amount;
        uint256 timestamp;
        string description;
    }

    /// @notice Representation of an expenditure of released funds.
    struct Expenditure {
        uint256 id;
        uint256 releaseId;
        uint256 amount;
        string beneficiary;
        string documentHash; // Off-chain document hash (e.g. IPFS) proving expenditure details
        uint256 timestamp;
    }

    // State counters for unique IDs.
    uint256 public allocationCount;
    uint256 public releaseCount;
    uint256 public expenditureCount;

    // Storage mappings for allocations, releases, and expenditures.
    mapping(uint256 => Allocation) public allocations;
    mapping(uint256 => Release) public releases;
    mapping(uint256 => Expenditure) public expenditures;

    // Contract owner (e.g. government budget authority) with permission to write data.
    address public owner;

    /// @dev Modifier to restrict actions to the owner.
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    /// @notice Events emitted for off-chain tracking.
    event AllocationCreated(uint256 id, string agency, string project, uint256 amount);
    event FundsReleased(uint256 id, uint256 allocationId, uint256 amount, string description);
    event ExpenditureRecorded(uint256 id, uint256 releaseId, uint256 amount, string beneficiary, string documentHash);

    /// @dev Constructor sets the deployer as the owner.
    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Create a new budget allocation.
     * @param agency Name of the implementing agency.
     * @param project Name of the project or program.
     * @param amount Amount allocated (in smallest currency unit, e.g. wei).
     */
    function createAllocation(string memory agency, string memory project, uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be > 0");
        allocationCount++;
        allocations[allocationCount] = Allocation({
            id: allocationCount,
            agency: agency,
            project: project,
            amount: amount,
            timestamp: block.timestamp,
            exists: true
        });
        emit AllocationCreated(allocationCount, agency, project, amount);
    }

    /**
     * @notice Release funds against a specific allocation.
     * @param allocationId ID of the allocation to release funds from.
     * @param amount Amount released.
     * @param description Brief description or purpose of the release.
     */
    function releaseFunds(uint256 allocationId, uint256 amount, string memory description) external onlyOwner {
        Allocation storage alloc = allocations[allocationId];
        require(alloc.exists, "Allocation does not exist");
        require(amount > 0, "Amount must be > 0");
        // Note: In a complete implementation, you might track total released per allocation and ensure it
        // does not exceed the allocated amount. This minimal example omits such checks for simplicity.
        releaseCount++;
        releases[releaseCount] = Release({
            id: releaseCount,
            allocationId: allocationId,
            amount: amount,
            timestamp: block.timestamp,
            description: description
        });
        emit FundsReleased(releaseCount, allocationId, amount, description);
    }

    /**
     * @notice Record an expenditure from a release.
     * @param releaseId ID of the release the expenditure belongs to.
     * @param amount Amount spent.
     * @param beneficiary Name or identifier of the beneficiary.
     * @param documentHash Off-chain document hash (e.g. IPFS CID) for supporting documentation.
     */
    function recordExpenditure(
        uint256 releaseId,
        uint256 amount,
        string memory beneficiary,
        string memory documentHash
    ) external onlyOwner {
        require(releaseId > 0 && releaseId <= releaseCount, "Release does not exist");
        require(amount > 0, "Amount must be > 0");
        expenditureCount++;
        expenditures[expenditureCount] = Expenditure({
            id: expenditureCount,
            releaseId: releaseId,
            amount: amount,
            beneficiary: beneficiary,
            documentHash: documentHash,
            timestamp: block.timestamp
        });
        emit ExpenditureRecorded(expenditureCount, releaseId, amount, beneficiary, documentHash);
    }

    /**
     * @notice Get allocation details by ID.
     * @param id The allocation ID to retrieve.
     * @return Allocation struct with allocation details.
     */
    function getAllocation(uint256 id) external view returns (Allocation memory) {
        require(id > 0 && id <= allocationCount, "Allocation does not exist");
        return allocations[id];
    }

    /**
     * @notice Get release details by ID.
     * @param id The release ID to retrieve.
     * @return Release struct with release details.
     */
    function getRelease(uint256 id) external view returns (Release memory) {
        require(id > 0 && id <= releaseCount, "Release does not exist");
        return releases[id];
    }

    /**
     * @notice Get expenditure details by ID.
     * @param id The expenditure ID to retrieve.
     * @return Expenditure struct with expenditure details.
     */
    function getExpenditure(uint256 id) external view returns (Expenditure memory) {
        require(id > 0 && id <= expenditureCount, "Expenditure does not exist");
        return expenditures[id];
    }

    /**
     * @notice Get all allocations.
     * @return Array of all allocation IDs.
     */
    function getAllAllocations() external view returns (uint256[] memory) {
        uint256[] memory ids = new uint256[](allocationCount);
        for (uint256 i = 1; i <= allocationCount; i++) {
            ids[i - 1] = i;
        }
        return ids;
    }

    /**
     * @notice Get all releases.
     * @return Array of all release IDs.
     */
    function getAllReleases() external view returns (uint256[] memory) {
        uint256[] memory ids = new uint256[](releaseCount);
        for (uint256 i = 1; i <= releaseCount; i++) {
            ids[i - 1] = i;
        }
        return ids;
    }

    /**
     * @notice Get all expenditures.
     * @return Array of all expenditure IDs.
     */
    function getAllExpenditures() external view returns (uint256[] memory) {
        uint256[] memory ids = new uint256[](expenditureCount);
        for (uint256 i = 1; i <= expenditureCount; i++) {
            ids[i - 1] = i;
        }
        return ids;
    }

    /**
     * @notice Transfer ownership of the contract.
     * @param newOwner The address of the new owner.
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner address");
        owner = newOwner;
    }
}