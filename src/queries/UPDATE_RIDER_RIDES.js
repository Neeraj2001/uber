import { gql } from '@apollo/client';

export const UPDATE_RIDER_RIDES = gql`
mutation MyMutation($id: uuid!, $rides: String!, $trips: Int! ) {
    update_uberrider(where: {id: {_eq: $id}}, _set: {rides: $rides, trips: $trips}) {
      affected_rows
    }
  }
  `; 
  