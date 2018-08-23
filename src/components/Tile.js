import React from 'react'

const tile = (props) => {
  return (
    <span onDragStart={props.dragStart} onDragOver={props.dragFurther}>
        <span>{props.name}</span><span onClick={props.click}>X</span>
      <span>&#x2B22;</span>
    </span>

  )
}

export default tile;
