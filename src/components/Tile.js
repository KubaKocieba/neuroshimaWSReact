import React from 'react'

const tile = (props) => {
  let allowRemove = props.name.indexOf('hq') === -1 ? <span onClick={props.click}>X</span> : null;

  return (
    <span draggable onDragStart={props.dragStart} onDragOver={props.dragFurther}>
        <span>{props.name}</span>
      { allowRemove }
      <span style={{cursor: 'pointer'}}>&#x2B22;</span>
    </span>

  )
}

export default tile;
