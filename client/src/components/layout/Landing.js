import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

export const Landing = () => {
  return (
    <div style={LandingStyle}>
      <Container className='landing-container text-center'>
        <h2>
          Innovative way of reviewing:<br></br>Review while doing something
          else!
        </h2>
        <p>
          Talking tester reads the questions for you and you can also answer by
          talking. It also saves your past tries which allows you to filter
          through them.
        </p>
        <div className='d-flex justify-content-center'>
          <Link to='/login'>
            <Button variant='primary me-4'>Login</Button>{' '}
          </Link>
          <Link to='/register'>
            <Button variant='primary'>Register</Button>{' '}
          </Link>
        </div>
      </Container>
    </div>
  );
};

const LandingStyle = {
  width: '100%',
  height: 'calc(100vh - 200px)',
  display: 'flex',
  alignItems: 'center',
};

export default Landing;
