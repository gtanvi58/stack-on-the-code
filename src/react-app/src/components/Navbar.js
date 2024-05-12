import { Link } from "react-router-dom";

function Navbar(){
    return (
        <header>
            <nav className="nav">
                <h1 className="nav--title"> Stack On The Code </h1>
                <ul className="nav--items">
                    <li> Search </li>
                    <li> History </li>
                    <li> Logout </li>
                </ul>
            </nav>
        </header>
    );
}

export default Navbar;