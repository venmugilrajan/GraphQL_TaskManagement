const {
  GraphQLObjectType, GraphQLSchema, GraphQLString,
  GraphQLInt, GraphQLID, GraphQLList, GraphQLNonNull
} = require("graphql");
const Task = require("../models/Task");

const TaskType = new GraphQLObjectType({
  name: "Task",
  fields: {
    id: { type: GraphQLID },
    jobtodo: { type: GraphQLString },
    toggle: { type: GraphQLInt }
  }
});

const RootQuery = new GraphQLObjectType({
  name: "Query",
  fields: {
    getTasks: {
      type: new GraphQLList(TaskType),
      resolve: async () => await Task.find()
    },
    getTaskById: {
      type: TaskType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_, args) => await Task.findById(args.id)
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createTask: {
      type: TaskType,
      args: { jobtodo: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: async (_, args) => {
        if (!args.jobtodo.trim()) throw new Error("Task cannot be empty");
        return await new Task({ jobtodo: args.jobtodo, toggle: 0 }).save();
      }
    },
    updateTask: {
      type: TaskType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        jobtodo: { type: new GraphQLNonNull(GraphQLString) },
        toggle: { type: GraphQLInt }
      },
      resolve: async (_, args) => {
        const task = await Task.findById(args.id);
        if (!task) throw new Error("Task not found");
        task.jobtodo = args.jobtodo;
        if (args.toggle !== undefined) task.toggle = args.toggle;
        return await task.save();
      }
    },
    deleteTask: {
      type: TaskType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_, args) => {
        const task = await Task.findById(args.id);
        if (!task) throw new Error("Task not found");
        await Task.findByIdAndDelete(args.id);
        return task;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
