import React from 'react';

const NavbarItem = (props) => {
    return(
        <div>
            <li className="nav-item">
                <a className="nav-link" >{ props.link.link }</a>
            </li>
        </div>
    );
}

export default NavbarItem;