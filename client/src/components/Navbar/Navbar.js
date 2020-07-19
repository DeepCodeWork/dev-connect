import React from 'react';
import logo from '../../assets/img/logo.png';
import classes from './Navbar.module.css';
import SearchBar from './SearchBar/SearchBar';
import NavbarItems from './NavbarItems/NavbarItems';

const Navbar = () => {

    const navLinks = [
        { link:'Home'   , to:'' },
        { link:'login'  , to:'' },
        { link:'profile', to:'' }
    ]

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">

                <a className="navbar-brand" href="#"><img className={classes.logo} src={ logo }/> Dev Connect</a>

                <div>
                    <SearchBar/>
                </div>

                <div className="ml-auto">
                    <NavbarItems links={navLinks}/>
                </div>

            </nav>  
        </div>
    );
}

export default Navbar;