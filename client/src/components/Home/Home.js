import React from 'react';
import classes from './Home.module.css';

const Home = () => {
    return(
        <div className={ classes.home }>
            <div className={ classes.image }>
                <div className={ classes.overlay }>
                    <p>this is my background</p>
                </div>
            </div>
        </div>
    );
}

export default Home;