import { gql } from '@apollo/client';

export const INSERT_DRIVER = gql`
mutation Driver($contact: bigint!, $name: String!, $vehical: String!, $password: String!) {
    insert_uberdriver(objects: {contact: $contact, name: $name, password: $password, vehical: $vehical}) {
      affected_rows
    }
  }`;

