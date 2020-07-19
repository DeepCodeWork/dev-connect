import React from 'react';

const SearchBar = () => {
    return(
        <div className="mx-5">
            <form class="form-inline my-2 my-lg-0">
                <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" style={{borderRadius:"5px"}}/>
                <button class="btn btn-outline-light my-2 my-sm-0" type="submit">Search</button>
            </form>
        </div>
    );
}

export default SearchBar;