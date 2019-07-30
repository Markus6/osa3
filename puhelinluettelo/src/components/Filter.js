import React from 'react';

const Filter = ({ filter, handleFilterchange }) => {
    return (
        <div>
            <p>
            filter shown with <input value={filter} onChange={handleFilterchange} />
            </p>
        </div>
    )
}

export default Filter;