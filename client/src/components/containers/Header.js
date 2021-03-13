import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import './Header.css'
import LoginButton from '../buttons/LoginButton'
import Search from '../Search'

function Header(props) {
  let icon_link = props.session.picture;
  icon_link = icon_link?.slice(icon_link?.indexOf('/'), -1);

  return (
    <div className="Header">
      <div className="UserDiv">
          <img src={icon_link} alt=''/>
          <p>{props.session.name}</p>
      </div>
      <div className="SearchDiv">
        <Search updateSearchResults={props.updateSearchResults} />
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
