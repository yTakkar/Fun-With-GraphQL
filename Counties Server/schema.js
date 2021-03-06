const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLInputObjectType,
} = require('graphql')
const axios = require('axios')

const getCountry = async country => {
  let { data } = await axios.get(`http://localhost:3000/countries/${country}`)
  return data
}

const cityType = new GraphQLObjectType({
  name: 'cityType',
  description: 'City Type..',
  fields: () => ({
    name: { type: GraphQLString },
    population: { type: GraphQLString }
  })
})

const countryType = new GraphQLObjectType({
  name: 'countryType',
  description: 'Country type..',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    cities: { type: new GraphQLList(cityType) },
    nearest: { 
      type: countryType,
      resolve: d => getCountry(d.nearest)
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  description: 'This is root query type..',
  fields: () => ({
    country: {
      type: countryType,
      args: {
        id: { type: GraphQLInt }
      },
      resolve: async (root, { id }) => getCountry(id)
    },
    countries: {
      type: new GraphQLList(countryType),
      resolve: () => getCountry('')
    }
  })
})

const cityInput = new GraphQLInputObjectType({
  name: 'cityInput',
  description: 'City Type..',
  fields: () => ({
    name: { type: GraphQLString },
    population: { type: GraphQLString }
  })
})

const RootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  description: 'Mutates',
  fields: () => ({
    addCountry: {
      type: countryType,
      args: {
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        cities: { type: new GraphQLList(cityInput) }
      },
      resolve: (source, args) => {
        console.log(source, args)
      }
    }  
  })
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
})
