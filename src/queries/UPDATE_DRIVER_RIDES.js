import { gql } from '@apollo/client';

export const UPDATE_DRIVER_RIDES = gql`
mutation MyMutation($id: uuid!, $rides: String!, $trips: Int!, $lastride: String! ) {
    update_uberdriver(where: {id: {_eq: $id}}, _set: {rides: $rides, trips: $trips, lastride:$lastride}) {
      affected_rows
    }
  }
  `; 
  