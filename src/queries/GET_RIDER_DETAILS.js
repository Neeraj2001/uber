import { gql } from '@apollo/client';

export const GET_RIDER_DETAILS = gql`
query get_rider_details {
  uberrider(order_by: {rating: desc, trips: asc}) {
    name
    id
    contact
    rating
    trips
    entry
    rides
  }
}`;
