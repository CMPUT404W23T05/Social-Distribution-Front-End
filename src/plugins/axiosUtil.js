import axios from 'axios'

// These are in app; they can be used just like you would with axios, but with this.$[nodename] instead of "axios"

// e.g to get all of our local posts:
// this.$localNode.get(/authors/${authorid}/$posts)

const localNode = axios.create({
  baseURL: 'https://social-t30.herokuapp.com/api/',
  headers: {
    // Authorization will be set through upon initializing Store
  }
})

const node7 = axios.create({
  baseURL: 'https://sd-7-433-api.herokuapp.com/api/',
  headers: {
    Authorization: `Basic ${btoa('node01:P*ssw0rd!')}`
  }
})

const node10 = axios.create({
  baseURL: 'https://socialdistcmput404.herokuapp.com/api/',
  headers: {
    Authorization: 'Token d960c3dee9855f5f5df8207ce1cba7fc1876fedf'
  }
})

// These are not configured in app; import them as you need them per component.
// e.g in <script>: import {queryAllNodes} from 'axiosUtil.js'

function retrieveCredentials (endpoint) {
  // In case we don't want to store the credentials on front-end (Probably a good idea)
}

// To use this,
async function queryAllNodes (method = 'get', endpoint, params = null, data = null) {
  // method is axios.get/post/put (a function)
  // endpoint is the part the succeeds the base url e.g '/authors/4/posts/'
  // params is additional queries. These are optional; ignored if null
  // data is the JS object that is to be passed to server (if any)

  // Append more nodes here
  const nodes = [localNode, node7, node10]

  const responses = {}

  for (const node of nodes) {
    responses[node] = await node[method](endpoint, data, params)
  }

  // Output: {node7: {...}, node10: {...}, ...}
  return responses
}

// Makes these globally available
export default {
  install (app) {
    app.config.globalProperties.$localNode = localNode
    app.config.globalProperties.$node7 = node7
    app.config.globalProperties.$node10 = node10
  }
}
