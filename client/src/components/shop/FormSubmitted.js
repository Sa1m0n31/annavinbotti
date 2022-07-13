import React from 'react';

const FormSubmitted = ({header}) => {
    return <div className="formSubmitted">
        <h4 className="formSubmitted__header">
            {header}
        </h4>
        <a className="btn btn--sendForm" href="/panel-klienta?sekcja=zamowienia">
            Wróć do zamówień
        </a>
    </div>
};

export default FormSubmitted;
