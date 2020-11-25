import gql from 'graphql-tag';

const getUserInformation = gql`
    query getUserInformation($userPath: String!) {
        jcr {
            nodeByPath(path: $userPath) {
                name
                displayName
            }
        }
    }
`;

export {getUserInformation};
