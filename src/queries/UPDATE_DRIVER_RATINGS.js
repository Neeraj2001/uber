import { gql } from '@apollo/client';

export const UPDATE_DRIVER_RATINGS = gql`
mutation MyMutation($id: uuid!, $rating: Int!, $trips: Int!, $entry: Int!, $lastride: String!) {
    update_uberdriver(where: {id: {_eq: $id}}, _set: {rating: $rating, trips: $trips, entry: $entry, lastride:$lastride}) {
      affected_rows
    }
  }
  `; 
  