# Sigpas: Reimagining proofs by introducing Multisignature NFTs

## Table of Contents

1. [Introduction](#introduction)
2. [Project Overview](#project-overview)
3. [Multisignature NFT Concept](#multisignature-nft-concept)
4. [Current Implementation with ERC721](#current-implementation-with-erc721)
5. [Future Enhancements](#future-enhancements)
6. [Roadmap for New ERC Token](#roadmap-for-new-erc-token)

## Introduction

The project aims to develop Platform as a Service model to let clients easily mint NFTs following a unique method of multisignature NFTs and transfer it to users.

## Project Overview

Sigpas lets client to Issue Credentials through Multisignature NFT process. The client can create the token and set the required number of signatures for validation which will result in NFT minting following the ERC721 contract logic.

Deplyed Contract Address on Educhain: 0x03fb364DE447f8e7250e12c1383Bb8D1Bd341ccb


Key Features:
- 2 layered minting model
- Multisignature verification process for NFT creation and transfers.
- Enhanced trust and Authenticity
- Platform as a Service Model.

## Multisignature NFT Concept

A Multisignature NFT is a non-fungible token (NFT) that requires multiple parties (signers) to approve or authorize specific actions, such as minting, transferring, or burning the NFT. This adds an additional layer of security, governance, and trust, particularly in collaborative or high-value scenarios.

### How it works:

1. **Create Credentials**: The Client fills in the details, sets the required number of signatures for validation for NFT Creation and starts the minting process.

2. **Validators**: The Accounts with validators roles logs in to the validator dashboard and signs the portal.

3. **NFT minting**: ERC721 contract mints the NFT automatically after the required number of validaters sign the credentials.

4. **Student dashboard**: The NFT is displayed in the student dashboard.

## Current Implementation with ERC721

In the current version of the Multisignature NFT Wallet, we are using the ERC721 standard as a foundation for our implementation. ERC721 is the most widely adopted standard for NFTs on the Ethereum blockchain.

### Adapting ERC721 for Multisignature:

1. **Extended Metadata**: We've extended the standard ERC721 metadata to include fields for multiple signatures and the signing threshold.

2. **Modified Transfer Function**: The transfer function (`transferFrom`) has been modified to require multiple signatures before executing.

3. **Signature Verification**: A new function has been added to verify the validity and number of signatures before any transfer.

4. **Signature Storage**: Signatures are stored off-chain to reduce gas costs, with only a hash of the combined signatures stored on-chain.


## Future Enhancements

[Previous future enhancements remain, with the following addition:]

5. **New ERC Token Standard**: Development of a new ERC token standard specifically designed for Multisignature NFTs, improving efficiency and expanding capabilities.
6. **SDK Development**: Develop a SDK model, using which users can directly use the concept for their projects. 
## Roadmap for New ERC Token

As part of our commitment to innovation and improving the Multisignature NFT ecosystem, we are planning to develop a new ERC token standard specifically designed for Multisignature NFTs. This new standard will build upon the lessons learned from our current ERC721-based implementation and introduce native support for multisignature operations.

Key features of the planned ERC token:

1. **Native Multisignature Support**: Built-in functions for managing multiple signatures and thresholds.

2. **Gas Optimization**: Improved efficiency in storing and verifying multiple signatures.

3. **Flexible Governance Models**: Support for various multisignature schemes (e.g., n-of-m signatures, weighted signatures).

4. **Interoperability**: Ensuring compatibility with existing NFT marketplaces and wallets while offering enhanced features for multisignature-aware platforms.

5. **Standardized Events**: New events for multisignature-specific actions to improve traceability and integration with other systems.

We are currently in the planning phase for this new ERC token and will be engaging with the Ethereum community to gather feedback and ensure the standard meets the needs of the broader ecosystem.
