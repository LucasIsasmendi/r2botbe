# Vote App r2botbe
This release is part of the **R2BOT FAMILY**:
* **r2botsdk** (popvote-sdk): validates hkid, phone#, avoid cast more than once, call **r2botbe** (this release)
* **r2botfe** (election bot): interface wit the user

## API
### Election
`/castvotefull`
* receive ballot string options "soa",
* generates wallet, sign ballot,
* insert address, ballot and signed ballot into mongodb
* insert address, ballot and signed ballot into valid votes file
* return wallet + signed ballot

`/data-integrity-process` **Pending Dev**
* validate information integrity with database. flat files and external source
* returns valid or invalid

`/closeelection` **Pending Dev**
* send files to IPFS
* send ipfs main folder hash to bitcoin
* returns ipfs main hash, bitcoin transaction hash

### Files
`/admin/downloadfile/valid_votes`
* get all valid votes

`/admin/downloadfile/invalid_votes`
* get all invalid votes

`/admin/downloadfile/voters`
* get all voters

## Research
[links](research.md) to understand releases
