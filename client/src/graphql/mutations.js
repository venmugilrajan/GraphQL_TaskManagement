import { gql } from "@apollo/client";

export const CREATE_TASK = gql`
  mutation CreateTask($jobtodo: String!) {
    createTask(jobtodo: $jobtodo) {
      id jobtodo toggle
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $jobtodo: String!, $toggle: Int) {
    updateTask(id: $id, jobtodo: $jobtodo, toggle: $toggle) {
      id jobtodo toggle
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      id jobtodo toggle
    }
  }
`;
