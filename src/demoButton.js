import * as React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const DemoButton = () => {
  return (
    <Link to="/demo">
      <Button variant="contained"> Web AR Demo</Button>
    </Link>
  );
};

export default DemoButton;
