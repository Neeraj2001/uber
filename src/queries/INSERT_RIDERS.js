import { gql } from '@apollo/client';

export const INSERT_RIDER = gql`
mutation MyMutation($password: String!, $name: String!, $contact: bigint!) {
    insert_uberrider(objects: {password: $password, contact: $contact, name: $name}) {
      affected_rows
    }
  }
  `;

