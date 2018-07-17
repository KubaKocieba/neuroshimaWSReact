export const sendUser = (newData) => {
  return {
    type: 'SEND_USER',
    name: newData.name,
    army: newData.army,
    socket: newData.socket
  }
}

export const addUser = (newData) => {
  return {
    type: 'ADD_USER',
    data: newData
  }
}

export const listUsers = () => {
  return {
    type: 'LIST_USERS'
  }
}

export const setUsers = (newData) => {
  return {
    type: 'SET_USERS',
    data: newData
  }
}