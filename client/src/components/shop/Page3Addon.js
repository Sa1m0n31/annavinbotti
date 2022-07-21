import React from 'react';

const Page3Addon = () => {
    return <div className="page__addon center marginTop">
        <iframe width="860" height={window.innerWidth < 768 ? "325" : "465"} src="https://www.youtube.com/embed/nK7OicU12wo" title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen></iframe>
    </div>
};

export default Page3Addon;
