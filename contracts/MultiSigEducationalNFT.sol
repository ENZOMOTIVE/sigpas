// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MultiSigEducationalNFT is ERC721, AccessControl {
    using Counters for Counters.Counter;
    
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");
    
    Counters.Counter private _tokenIds;
    
    struct Credential {
        string metadataURI;
        address student;
        uint256 requiredSignatures;
        mapping(address => bool) signatures;
        bool isValid;
        uint256 signatureCount;
    }
    
    mapping(uint256 => Credential) public credentials;
    
    event CredentialCreated(uint256 tokenId, address student, string metadataURI);
    event CredentialSigned(uint256 tokenId, address signer);
    event CredentialValidated(uint256 tokenId);
    
    constructor() ERC721("Educational Credential", "EDU") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    function createCredential(
        address student,
        string memory metadataURI,
        uint256 requiredSignatures
    ) public onlyRole(ISSUER_ROLE) returns (uint256) {
        require(requiredSignatures > 0, "Required signatures must be greater than 0");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        Credential storage credential = credentials[newTokenId];
        credential.metadataURI = metadataURI;
        credential.student = student;
        credential.requiredSignatures = requiredSignatures;
        credential.isValid = false;
        credential.signatureCount = 0;
        
        emit CredentialCreated(newTokenId, student, metadataURI);
        return newTokenId;
    }
    
    function signCredential(uint256 tokenId) public onlyRole(VALIDATOR_ROLE) {
        Credential storage credential = credentials[tokenId];
        require(!credential.isValid, "Credential already validated");
        require(!credential.signatures[msg.sender], "Already signed by this validator");
        
        credential.signatures[msg.sender] = true;
        credential.signatureCount++;
        
        emit CredentialSigned(tokenId, msg.sender);
        
        if (credential.signatureCount >= credential.requiredSignatures) {
            _mint(credential.student, tokenId);
            credential.isValid = true;
            emit CredentialValidated(tokenId);
        }
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        // Use ownerOf instead of _exists to check token existence
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return credentials[tokenId].metadataURI;
    }
    
    function getSignatureCount(uint256 tokenId) public view returns (uint256) {
        return credentials[tokenId].signatureCount;
    }
    
    function isCredentialValid(uint256 tokenId) public view returns (bool) {
        return credentials[tokenId].isValid;
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
