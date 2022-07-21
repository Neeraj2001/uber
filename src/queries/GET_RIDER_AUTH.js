import { gql } from '@apollo/client';

export const GET_RIDER_AUTH = gql`
query get_rider_auth($name: String!, $password: String!) {
  uberrider(where: {name: {_eq: $name}, password: {_eq: $password}}) {
    id
  }
}
`;
