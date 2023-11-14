import { Button } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

function Demo() {
  return (
    <>
      <h1>Work in Progress! Check back soon :D</h1>

      <Link to="/">
        <Button>Back to Home</Button>
      </Link>
    </>
  );
}

export default Demo;
