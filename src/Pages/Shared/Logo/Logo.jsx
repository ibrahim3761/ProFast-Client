import React from 'react';
import logo from '../../../assets/logo.png';
const Logo = () => {
    return (
        <div className='flex items-end'>
            <img className='mb-2 w-7' src={logo} alt="" />
            <p className='-ml-3 text-3xl'>Profast</p>
        </div>
    );
};

export default Logo;