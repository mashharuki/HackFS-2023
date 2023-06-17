# Polybase Scripts

- create

  ```bash
  node src/create.js
  ```

  result

  ```bash
  Add .signer() to populate ctx.publicKey, see: https://polybase.xyz/docs/authentication
  read data: {"data":[],"cursor":{"before":null,"after":null}}
  ```
- read

  ```bash
  node src/read.js
  ```

  result

  ```bash
  read data: {"data":[],"cursor":{"before":null,"after":null}}
  ```

### Table define

| No. | name       | type   |
| --- | ---------- | ------ |
| 1   | id | string |
| 2   | sender | string |
| 3   | type       | string |
| 4   | tokenAddr  | string |
| 5   | to         | string |
| 6   | amount     | string |
| 7   | factory    | string |
| 8   | status     | string |
| 9   | date       | string |

1. sender Address and txHash
2. Token Type (Native, ERC20, NFT)
3. Token Addres (Natibe token is 0x0)
4. to address
5. amount or id (amount)
6. factory
