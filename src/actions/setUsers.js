export const sendUser = (newData) => {
  return {
    type: 'SEND_USER',
    data: newData
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