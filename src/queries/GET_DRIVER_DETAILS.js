import { gql } from '@apollo/client';

export const GET_DRIVER_DETAILS = gql`
query get_driver_details {
    uberdriver(order_by: {rating: desc, trips: asc}) {
      name
      id
      contact
      rating
      trips
      vehical
      entry
      rides
    }
  }`;
  