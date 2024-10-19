import React from 'react'

const Input = ({ name, placeholder, handleInput }) => {
    // let {placeholder} = props;
    return (
        <div>
            <input name={name} className="input-field" placeholder={placeholder} onChange={handleInput} />
        </div>
    )
}

export default Input