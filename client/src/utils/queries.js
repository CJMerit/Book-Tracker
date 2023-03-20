import { gql } from '@apollo/client';

export const QUERY_USER = gql`
    query User {
        user {
            _id
            username
            email
            bookCount
            savedBooks {
                bookId
                authors
                description
                image
                link
                title
            }
        }
    }
`