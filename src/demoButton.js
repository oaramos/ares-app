import * as React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

export default function DemoButton() {
  return (
    <Link to="/demo">
      <Button variant="contained"> Web AR Demo</Button>
    </Link>
  );
}
