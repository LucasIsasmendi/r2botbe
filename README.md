# Vote App r2botbe
This release is part of the **R2BOT FAMILY**:
* **r2botsdk** (popvote-sdk): validates hkid, phone#, avoid cast more than once, call **r2botbe** (this release)
* **r2botfe** (election bot): interface wit the user

## API
### Main (API)
#### Full
`/castvotefull`

#### step by step
`/getnewkey`

`/doesitvote`

`/signballot`

`/checksignature`

`/castvote`

### User (User)
`/user/votedone`
* receive phone number
* vote status set true mongodb collection **users**

`/user/doesitvote`
* receive phone number
* return if user allready voted, check vote status into mongodb collection **users**

### Election (Admin)
`/admin/castvotefull`
* receive ballot string options "soa",
* generates wallet, sign ballot,
* insert address, ballot and signed ballot into mongodb collection **voters**
* insert address, ballot and signed ballot into valid votes file
* return wallet + signed ballot

`/admin/data-integrity-process` **Pending Dev**
* validate information integrity with database. flat files and external source
* returns valid or invalid

`/admin/closeelection` **Pending Dev**
* send files to IPFS
* send ipfs main folder hash to bitcoin
* returns ipfs main hash, bitcoin transaction hash

#### Files
`/admin/downloadfile/valid_votes`
* get all valid votes

`/admin/downloadfile/invalid_votes`
* get all invalid votes

`/admin/downloadfile/voters`
* get all voters

## Research
[links](research.md) to understand releases
