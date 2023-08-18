import { gql } from 'urql';

// query
const query = gql`
    query MyQuery {
        createds(orderBy: walletId, orderDirection: asc) {
            walletId
            addr
        }
    }
`;

export default query;