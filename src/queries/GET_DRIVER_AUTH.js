import { gql } from '@apollo/client';

export const GET_DRIVER_AUTH = gql`
query get_driver_auth($name: String!, $password: String!) {
  uberdriver(where: {name: {_eq: $name}, password: {_eq: $password}}) {
    id
  }
}`;
