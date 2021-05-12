import React from 'react'
import { Link } from 'react-router-dom'
import './Header.css'
import LoginButton from '../buttons/LoginButton'
import Search from '../Search'

function Header(props) {
  let icon_link = props.session.picture;
  icon_link = icon_link?.slice(icon_link?.indexOf('/'), -1);

  return (
    <div className="Header">
      <div className="UserDiv">
        <Link to="/collections">
          <img src={icon_link} alt=''/>
          <p>{props.session.name}</p>
        </Link>
      </div>
      <div className="SearchDiv">
        <Link to="/">
          <Search
            updateSearchResults={props.updateSearchResults}
            addSearchResults={props.addSearchResults}
          />
        </Link>
      </div>
      <div className="LoginDiv">
        <LoginButton
          session={props.session}
          updateSession={props.updateSession} />
      </div>
    </div>
  );
}

export default Header;
