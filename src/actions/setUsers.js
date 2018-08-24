export const sendUser = (newData) => {
  return {
    type: 'SEND_USER',
    data: newData
  }
}

export const setUsers = (newData) => {
  return {
    type: 'SET_USERS',
    data: newData
  }
}

export const editUser = (newData) => {
  return {
    type: 'EDIT_USER',
    data: newData
  }
}