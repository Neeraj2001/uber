import { gql } from '@apollo/client';

export const UPDATE_RIDER_RATINGS = gql`
mutation MyMutation($id: uuid!, $rating: Int!, $trips: Int!, $entry: Int!) {
    update_uberrider(where: {id: {_eq: $id}}, _set: {rating: $rating, trips: $trips, entry:$entry}) {
      affected_rows
    }
  }
  `; 
  