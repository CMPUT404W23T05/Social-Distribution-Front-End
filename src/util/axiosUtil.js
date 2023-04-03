import axios from 'axios'

// These are in app; they can be used just like you would with axios, but with this.$[nodename] instead of "axios"

// e.g to get all of our local posts:
// this.$localNode.get(/authors/${authorid}/$posts)

const localNode = axios.create({
  name: 'localNode',
  baseURL: 'https://social-t30.herokuapp.com/api/',
  headers: {
    // Authorization will be set through upon initializing Store
  },
  defaults: {}
})

const node7 = axios.create({
  name: 'node7',
  baseURL: 'https://sd-7-433-api.herokuapp.com/api/',
  headers: {
    Authorization: `Basic ${btoa('node01:P*ssw0rd!')}`
  },
  defaults: {}
})

const node9 = axios.create({
  name: 'node9',
  baseURL: 'http://ultimate-teapot.herokuapp.com/main/api/',
  headers: {
    Authorization: `Basic ${btoa('team5:jN2!42GUtCgB')}`
  },
  defaults: {}
})

const node10 = axios.create({
  name: 'node10',
  baseURL: 'https://socialdistcmput404.herokuapp.com/api/',
  headers: {
    Authorization: 'Token d960c3dee9855f5f5df8207ce1cba7fc1876fedf'
  },
  defaults: {}
})

const nodes = [localNode, node7, node9, node10]

// Interceptors here
for (const node of nodes) {
  node.interceptors.request.use((config) => {
    if (config.url.startsWith('/api/')) {
      // Remove /api/ prefix
      config.url = config.url.replace('/api/')
    }
    return config
  })
}

// These are not configured in app; import them as you need them per component.
// e.g in <script>: import {queryAllNodes} from 'axiosUtil.js'

export function getAxiosTarget (endpoint) {
  // Returns the axios target for that endpoint
  // e.g) 'https://social-t30.herokuapp.com/api/...' => localNode

  console.log('Endpoint format is: ' + endpoint)
  const hostname = new URL(endpoint).host

  if (hostname.includes('social-t30')) {
    return localNode
  } else if (hostname.includes('sd-7-433-api')) {
    return node7
  } else if (hostname.includes('ultimate-teapot')) {
    return node9
  } else if (hostname.includes('socialdistcmput404')) {
    return node10
  }
  // Add more teams here if needed
}

export function retrieveCredentials (endpoint) {
  // In case we don't want to store the credentials on front-end (Probably a good idea)
}

// To use this,
export async function queryAllNodes (method = 'get', endpoint, data = null, params = null) {
  // method is axios.get/post/put (a function)
  // endpoint is the part the succeeds the base url e.g '/authors/4/posts/'
  // params is additional queries. These are optional; ignored if null
  // data is the JS object that is to be passed to server (if any)

  // Append more nodes here
  const responses = {}

  for (const node of nodes) {
    try {
      responses[node.defaults.name] = await node[method](endpoint, data, params)
    } catch (err) {
      console.log('Failed on ' + node.defaults.baseURL)
      console.log(err)
    }
  }

  console.log(responses)
  // Output: {node7: {...}, node10: {...}, ...}
  return responses
}

// Makes these globally available
export default {
  install (app) {
    app.config.globalProperties.$localNode = localNode
    app.config.globalProperties.$node7 = node7
    app.config.globalProperties.$node9 = node9
    app.config.globalProperties.$node10 = node10
  }
}
