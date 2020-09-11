import { ApolloServer, ApolloError, MockList } from 'apollo-server'
import { loadSchemaSync } from '@graphql-tools/load'
import { GraphQLScalarType } from 'graphql'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { Kind } from 'graphql/language'
import faker from 'faker'

const schema = loadSchemaSync('schema.graphql', { loaders: [new GraphQLFileLoader()] })

const resolverMap = {
  // useless at this time
  Time: new GraphQLScalarType({
    name: 'Time',
    description: 'Time',
    parseValue(value) {
      return new Date(value) // value from the client
    },
    serialize(value) {
      return value.getTime() // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(+ast.value) // ast value is always in string format
      }
      return null
    },
  }),
}

const apolloError = new ApolloError('aaaaa')

const mocks = {
  Time: () => {
    return new Date()
  },
  // uncomment next line if want to mock error
  // Practice: () => apolloError,
  Practice: () => new MockList(5),
  String: () =>faker.hacker.noun(),
  Int: () => faker.random.number(),
}

const server = new ApolloServer({
  schema,
  resolvers: resolverMap,
  mocks: mocks,
})

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})