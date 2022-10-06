import React from 'react';

const DisplayAddress = ({header, lines, extraClass}) => {
    return <div className={extraClass ? extraClass : ""}>
        <h4 className="admin__order__right__header">
            {header}
        </h4>
        <p className="admin__order__right__text">
            {lines?.map((item, index) => {
                return <span key={index}>
                    {item}
                </span>
            })}
        </p>
    </div>
};

export default DisplayAddress;
